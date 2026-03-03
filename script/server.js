const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(body);
}


const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return sendJson(res, 200, { ok: true });


  // Endpoint to open a visible PowerShell window and type random text
  if (req.method === 'POST' && req.url === '/open-cmd') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        if (process.platform !== 'win32') return sendJson(res, 400, { error: 'This feature is Windows-only' });
        const data = JSON.parse(body || '{}');
        const length = Math.max(1, Math.min(500, parseInt(data.length) || 30));
        const speedMs = Math.max(10, Math.min(1000, parseInt(data.speedMs) || 80));

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let text = '';
        for (let i = 0; i < length; i++) {
          text += chars[Math.floor(Math.random() * chars.length)];
        }

        // Create a temporary PowerShell script that types the text with a delay
        const psLines = [];
        // assign the text (escape single quotes by doubling them)
        const escText = text.replace(/'/g, "''");
        psLines.push(`$text = '${escText}'`);
        psLines.push(`$delay = ${speedMs}`);
        psLines.push(`foreach ($c in $text.ToCharArray()) { Write-Host -NoNewLine $c; Start-Sleep -Milliseconds $delay }`);
        psLines.push('Write-Host');
        const psContent = psLines.join('\r\n');

        const tmpName = path.join(process.cwd(), `typing_${Date.now()}.ps1`);
        fs.writeFileSync(tmpName, psContent, { encoding: 'utf8' });

        // Use cmd Start to open a visible window running PowerShell with our script
        const { spawn } = require('child_process');
        const child = spawn('cmd', ['/c', 'start', 'powershell', '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', tmpName], { detached: true, windowsHide: false });
        child.unref();

        // Schedule cleanup of the temporary script after a short delay
        setTimeout(() => {
          try { fs.unlinkSync(tmpName); } catch (e) { /* ignore */ }
        }, 15000);

        sendJson(res, 200, { ok: true, text });
      } catch (err) {
        sendJson(res, 500, { error: err.message });
      }
    });
    return;
  }

  // Simple status page
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
    res.end('CMD typing server running');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log('Server listening on http://localhost:' + PORT);
});

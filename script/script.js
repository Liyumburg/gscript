// Request the local server to open a PowerShell window and type random text

document.getElementById('open-cmd').addEventListener('click', async function () {
  try {
    const resp = await fetch('http://localhost:3000/open-cmd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ length: 40, speedMs: 70 })
    });
    const result = await resp.json();
    if (resp.ok) alert('Launched typing window with text: ' + (result.text || '[hidden]'));
    else alert('Server error: ' + (result.error || resp.statusText));
  } catch (err) {
    alert('Request failed: ' + err.message + '\nMake sure the local server is running: node server.js');
  }
});

// Request the local server to open a PowerShell window and type random text
document.getElementById('open-cmd').addEventListener('click', async function () {
  try {
    const resp = await fetch('http://localhost:3000/open-cmd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ length: 40, speedMs: 70 })
    });
    const result = await resp.json();
    if (resp.ok) alert('Launched typing window with text: ' + (result.text || '[hidden]'));
    else alert('Server error: ' + (result.error || resp.statusText));
  } catch (err) {
    alert('Request failed: ' + err.message + '\nMake sure the local server is running: node server.js');
  }
});

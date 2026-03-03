# Auto Download Demo

Open `index.html` in a browser and click a button to trigger a download.

Quick start (Windows):

# CMD Auto-Typer Demo

This project demonstrates a simple web page that tells a local Node.js server to
open a **PowerShell window** on the same machine and automatically type a
sequence of random characters. It is intentionally minimal, designed to show
how a browser-triggered action can launch and interact with a system terminal.

## Quick start

1. Launch the server (requires Node.js 12+):

   ```bash
   cd "C:\Users\soliv\Desktop\script"
   node server.js
   ```

2. Open the web interface (any modern browser):

   ```bash
   start index.html
   ```

3. Click **Open CMD and auto-type random text**. A new PowerShell window will
   appear and display a randomly generated string, typing one character at a
time.

## How it works

- The front end (`index.html`/`script.js`) sends a `POST` request to
  `http://localhost:3000/open-cmd` with optional parameters (`length` and
  `speedMs`).
- The server (`server.js`) constructs a temporary PowerShell script containing
  the generated text and a loop that outputs characters with delays. It then
  launches `cmd.exe` with `start` to open a visible window running that script.
- After a short delay the temporary script file is deleted automatically.

## Notes & warnings

- **Windows only.** The mechanism relies on PowerShell and `cmd.exe`.
- Browsers cannot themselves open or control system terminals; the Node server
  acts as a trusted intermediary. Do not expose this server to untrusted
  networks.
- Launching shells and writing files can be dangerous—keep this demo on a
  machine you control.

The rest of the original download/demo code has been removed to keep the
example focused on the CMD-typing functionality.

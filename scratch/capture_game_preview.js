const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.whenReady().then(async () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[BROWSER]: ${message}`);
  });

  await win.loadFile(path.join(__dirname, '..', 'index.html'));
  await new Promise(r => setTimeout(r, 1500));

  const img = await win.webContents.capturePage();
  const outPath = path.join(__dirname, 'gameplay_preview.png');
  fs.writeFileSync(outPath, img.toPNG());
  console.log(`Saved screenshot to: ${outPath}`);

  app.quit();
});

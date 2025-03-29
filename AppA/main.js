const { app, BrowserWindow, ipcMain } = require("electron");

function createWindow(windowName = "index") {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile(`./${windowName}.html`);
}

ipcMain.on("launch-another-window", () => {
  createWindow("another-window");
});

app.whenReady().then(createWindow);


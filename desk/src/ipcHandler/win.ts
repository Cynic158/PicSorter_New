import { app, ipcMain, BrowserWindow } from "electron";

const winHandler = (mainWindow: BrowserWindow) => {
  ipcMain.handle("Win_quit" as WinApi, () => {
    app.quit();
  });

  ipcMain.handle("Win_hide" as WinApi, () => {
    mainWindow.minimize();
  });

  ipcMain.handle("Win_max" as WinApi, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
};

export default winHandler;

import { app, ipcMain, BrowserWindow, clipboard } from "electron";
import { generateErrorLog } from "../utils/index";

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

  ipcMain.handle("Win_copy" as WinApi, async (_event, content: string) => {
    try {
      clipboard.writeText(content);
      // 复制成功
      return {
        success: true,
        data: "",
      };
    } catch (error) {
      // 编写错误报告
      let errorLog = generateErrorLog(error);
      return {
        success: false,
        data: errorLog,
      };
    }
  });
};

export default winHandler;

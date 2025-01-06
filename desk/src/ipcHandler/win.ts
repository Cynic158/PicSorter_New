import { app, ipcMain, BrowserWindow, clipboard } from "electron";
import { generateErrorLog } from "../utils/index";

const winHandler = (mainWindow: BrowserWindow) => {
  // 退出应用
  ipcMain.handle("Win_quit" as WinApi, () => {
    app.quit();
  });

  // 隐藏应用
  ipcMain.handle("Win_hide" as WinApi, () => {
    mainWindow.minimize();
  });

  // 最大化应用
  ipcMain.handle("Win_max" as WinApi, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  // 复制内容到剪切板
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

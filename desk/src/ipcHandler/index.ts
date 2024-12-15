import { BrowserWindow } from "electron";
import winHandler from "./win";

const ipcHandler = (mainWindow: BrowserWindow) => {
  winHandler(mainWindow);
};

export default ipcHandler;

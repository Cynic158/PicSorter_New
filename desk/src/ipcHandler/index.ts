import { BrowserWindow } from "electron";
import winHandler from "./win";
import sortHandler from "./sort";

const ipcHandler = (mainWindow: BrowserWindow) => {
  winHandler(mainWindow);
  sortHandler();
};

export default ipcHandler;

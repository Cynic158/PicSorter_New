import { BrowserWindow } from "electron";
import winHandler from "./win";
import picHandler from "./pic";
import sortHandler from "./sort";

const ipcHandler = (
  mainWindow: BrowserWindow,
  getPicListSave: () => Array<PicInfo>,
  setPicListSave: (list: Array<PicInfo>) => void
) => {
  winHandler(mainWindow);
  picHandler(getPicListSave, setPicListSave);
  sortHandler();
};

export default ipcHandler;

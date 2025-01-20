import { BrowserWindow } from "electron";
import winHandler from "./win";
import picHandler from "./pic";
import sortHandler from "./sort";

const ipcHandler = (
  mainWindow: BrowserWindow,
  getPicListSave: () => Array<PicInfo>,
  setPicListSave: (list: Array<PicInfo>) => void,
  resetPicStatic: ResetPicStaticType
) => {
  winHandler(mainWindow);
  picHandler(getPicListSave, setPicListSave);
  sortHandler(resetPicStatic);
};

export default ipcHandler;

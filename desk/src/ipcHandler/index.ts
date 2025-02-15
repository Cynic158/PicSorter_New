import { BrowserWindow } from "electron";
import winHandler from "./win";
import picHandler from "./pic";
import sortHandler from "./sort";
import settingHandler from "./setting";

const ipcHandler = (
  mainWindow: BrowserWindow,
  getPicListSave: GetPicListSaveType,
  setPicListSave: SetPicListSave,
  resetPicStatic: ResetPicStaticType,
  resetSortStatic: ResetSortStaticType
) => {
  winHandler(mainWindow);
  picHandler(getPicListSave, setPicListSave);
  sortHandler(resetPicStatic, resetSortStatic, getPicListSave, setPicListSave);
  settingHandler();
};

export default ipcHandler;

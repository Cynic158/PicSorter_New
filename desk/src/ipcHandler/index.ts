import { BrowserWindow } from "electron";
import winHandler from "./win";
import picHandler from "./pic";
import sortHandler from "./sort";
import settingHandler from "./setting";
import toolHandler from "./tool";

const ipcHandler = (
  mainWindow: BrowserWindow,
  getPicListSave: GetPicListSaveType,
  setPicListSave: SetPicListSave,
  resetPicStatic: ResetPicStaticType,
  resetSortStatic: ResetSortStaticType,
  updateHandlePicCount: UpdateHandlePicCountType,
  appPath: string
) => {
  winHandler(mainWindow);
  picHandler(getPicListSave, setPicListSave, updateHandlePicCount, appPath);
  sortHandler(
    resetPicStatic,
    resetSortStatic,
    getPicListSave,
    setPicListSave,
    updateHandlePicCount,
    appPath
  );
  settingHandler(appPath);
  toolHandler();
};

export default ipcHandler;

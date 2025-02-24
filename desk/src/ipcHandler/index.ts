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
  updateHandlePicCount: UpdateHandlePicCountType
) => {
  winHandler(mainWindow);
  picHandler(getPicListSave, setPicListSave, updateHandlePicCount);
  sortHandler(
    resetPicStatic,
    resetSortStatic,
    getPicListSave,
    setPicListSave,
    updateHandlePicCount
  );
  settingHandler();
  toolHandler();
};

export default ipcHandler;

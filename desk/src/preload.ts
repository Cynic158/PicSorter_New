import { contextBridge, ipcRenderer } from "electron";

// winipc
const Win_quit = () => {
  ipcRenderer.invoke("Win_quit" as WinApi);
};
const Win_hide = () => {
  ipcRenderer.invoke("Win_hide" as WinApi);
};
const Win_max = () => {
  ipcRenderer.invoke("Win_max" as WinApi);
};
const Win_copy = async (content: string) => {
  const res = await ipcRenderer.invoke("Win_copy" as WinApi, content);
  return res;
};
const Win_link = async (url: string) => {
  const res = await ipcRenderer.invoke("Win_link" as WinApi, url);
  return res;
};

// picipc
const Pic_getPicList = async (
  mode: viewType,
  refresh: boolean,
  currentPicPath?: string
) => {
  const res = await ipcRenderer.invoke(
    "Pic_getPicList" as PicApi,
    mode,
    refresh,
    currentPicPath
  );
  return res;
};
const Pic_renamePic = async (renamePath: string, newName: string) => {
  const res = await ipcRenderer.invoke(
    "Pic_renamePic" as PicApi,
    renamePath,
    newName
  );
  return res;
};
const Pic_getPicInfo = async (picPath: string) => {
  const res = await ipcRenderer.invoke("Pic_getPicInfo" as PicApi, picPath);
  return res;
};
const Pic_showPic = async (picPath: string) => {
  const res = await ipcRenderer.invoke("Pic_showPic" as PicApi, picPath);
  return res;
};

// sortipc
const Sort_getPicFolder = () => {
  ipcRenderer.invoke("Sort_getPicFolder" as SortApi);
};
const Sort_getPicFolderPath = async (defaultPath: string) => {
  const res = await ipcRenderer.invoke(
    "Sort_getPicFolderPath" as SortApi,
    defaultPath
  );
  return res;
};
const Sort_setPicFolderPath = async (folderConfig: PicFolderConfigType) => {
  const res = await ipcRenderer.invoke(
    "Sort_setPicFolderPath" as SortApi,
    folderConfig
  );
  return res;
};
const Sort_getPicFolderInfo = async () => {
  const res = await ipcRenderer.invoke("Sort_getPicFolderInfo" as SortApi);
  return res;
};
const Sort_openPicFolder = async () => {
  const res = await ipcRenderer.invoke("Sort_openPicFolder" as SortApi);
  return res;
};
const Sort_getSortFolder = async () => {
  const res = await ipcRenderer.invoke("Sort_getSortFolder" as SortApi);
  return res;
};
const Sort_getSortFolderPath = async (defaultPath: string) => {
  const res = await ipcRenderer.invoke(
    "Sort_getSortFolderPath" as SortApi,
    defaultPath
  );
  return res;
};
const Sort_setSortFolderPath = async (folderConfig: SortFolderConfigType) => {
  const res = await ipcRenderer.invoke(
    "Sort_setSortFolderPath" as SortApi,
    folderConfig
  );
  return res;
};
const Sort_getSortFolderInfo = async () => {
  const res = await ipcRenderer.invoke("Sort_getSortFolderInfo" as SortApi);
  return res;
};
const Sort_openSortFolder = async () => {
  const res = await ipcRenderer.invoke("Sort_openSortFolder" as SortApi);
  return res;
};
const Sort_insertSortFolder = async (name: string) => {
  const res = await ipcRenderer.invoke(
    "Sort_insertSortFolder" as SortApi,
    name
  );
  return res;
};
const Sort_deleteSortFolder = async (targets: Array<string>) => {
  const res = await ipcRenderer.invoke(
    "Sort_deleteSortFolder" as SortApi,
    targets
  );
  return res;
};
const Sort_deletePic = async (picPath: string, cut: boolean = false) => {
  const res = await ipcRenderer.invoke(
    "Sort_deletePic" as SortApi,
    picPath,
    cut
  );
  return res;
};
const Sort_deletePicGroup = async (
  picPathGroup: Array<string>,
  cut: boolean = false
) => {
  const res = await ipcRenderer.invoke(
    "Sort_deletePicGroup" as SortApi,
    picPathGroup,
    cut
  );
  return res;
};
const Sort_copyPic = async (
  picPath: string,
  targets: Array<string>,
  action: "copy" | "cut",
  force: boolean
) => {
  const res = await ipcRenderer.invoke(
    "Sort_copyPic" as SortApi,
    picPath,
    targets,
    action,
    force
  );
  return res;
};
const Sort_copyPicGroup = async (
  picPathGroup: Array<string>,
  targets: Array<string>,
  action: "copy" | "cut",
  force: boolean
) => {
  const res = await ipcRenderer.invoke(
    "Sort_copyPicGroup" as SortApi,
    picPathGroup,
    targets,
    action,
    force
  );
  return res;
};
const Sort_openSortItemFolder = async (sortName: string) => {
  const res = await ipcRenderer.invoke(
    "Sort_openSortItemFolder" as SortApi,
    sortName
  );
  return res;
};
const Sort_getSortItemFolderInfo = async (sortName: string) => {
  const res = await ipcRenderer.invoke(
    "Sort_getSortItemFolderInfo" as SortApi,
    sortName
  );
  return res;
};
const Sort_setTopList = async (sortName: string, type: "insert" | "delete") => {
  const res = await ipcRenderer.invoke(
    "Sort_setTopList" as SortApi,
    sortName,
    type
  );
  return res;
};
const Sort_renameSortItem = async (oldName: string, newName: string) => {
  const res = await ipcRenderer.invoke(
    "Sort_renameSortItem" as SortApi,
    oldName,
    newName
  );
  return res;
};

const Setting_getAutoConfig = async (sortName: string) => {
  const res = await ipcRenderer.invoke(
    "Setting_getAutoConfig" as SettingApi,
    sortName
  );
  return res;
};
const Setting_setAutoConfig = async (autoConfig: AutoRenameConfig) => {
  const res = await ipcRenderer.invoke(
    "Setting_setAutoConfig" as SettingApi,
    autoConfig
  );
  return res;
};
const Setting_getDefaultSetting = async () => {
  const res = await ipcRenderer.invoke(
    "Setting_getDefaultSetting" as SettingApi
  );
  return res;
};
const Setting_setDefaultSetting = async (
  clearList: boolean,
  picLoadLimit: number
) => {
  const res = await ipcRenderer.invoke(
    "Setting_setDefaultSetting" as SettingApi,
    clearList,
    picLoadLimit
  );
  return res;
};
const Setting_openConfigFolder = async () => {
  const res = await ipcRenderer.invoke(
    "Setting_openConfigFolder" as SettingApi
  );
  return res;
};
const Setting_getTopList = async () => {
  const res = await ipcRenderer.invoke("Setting_getTopList" as SettingApi);
  return res;
};
const Setting_setTopList = async (topList: Array<string>) => {
  const res = await ipcRenderer.invoke(
    "Setting_setTopList" as SettingApi,
    topList
  );
  return res;
};
const Setting_getAutoConfigList = async () => {
  const res = await ipcRenderer.invoke(
    "Setting_getAutoConfigList" as SettingApi
  );
  return res;
};
const Setting_setAutoConfigList = async (autoList: Array<string>) => {
  const res = await ipcRenderer.invoke(
    "Setting_setAutoConfigList" as SettingApi,
    autoList
  );
  return res;
};
const Setting_openFolder = async (folderPath: string) => {
  const res = await ipcRenderer.invoke(
    "Setting_openFolder" as SettingApi,
    folderPath
  );
  return res;
};
const Setting_getHandlePicCount = async () => {
  const res = await ipcRenderer.invoke(
    "Setting_getHandlePicCount" as SettingApi
  );
  return res;
};

contextBridge.exposeInMainWorld("DeskApi", {
  Win_quit,
  Win_hide,
  Win_max,
  Win_copy,
  Win_link,
  Pic_getPicList,
  Pic_renamePic,
  Pic_getPicInfo,
  Pic_showPic,
  Sort_getPicFolder,
  Sort_getPicFolderPath,
  Sort_setPicFolderPath,
  Sort_getPicFolderInfo,
  Sort_openPicFolder,
  Sort_getSortFolder,
  Sort_getSortFolderPath,
  Sort_setSortFolderPath,
  Sort_getSortFolderInfo,
  Sort_openSortFolder,
  Sort_insertSortFolder,
  Sort_deleteSortFolder,
  Sort_deletePic,
  Sort_deletePicGroup,
  Sort_copyPic,
  Sort_copyPicGroup,
  Sort_openSortItemFolder,
  Sort_getSortItemFolderInfo,
  Sort_setTopList,
  Sort_renameSortItem,
  Setting_getAutoConfig,
  Setting_setAutoConfig,
  Setting_getDefaultSetting,
  Setting_setDefaultSetting,
  Setting_openConfigFolder,
  Setting_getTopList,
  Setting_setTopList,
  Setting_getAutoConfigList,
  Setting_setAutoConfigList,
  Setting_openFolder,
  Setting_getHandlePicCount,
});

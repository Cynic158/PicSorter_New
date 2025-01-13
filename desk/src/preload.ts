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

// picipc
const Pic_getPicList = async (
  mode: viewType,
  refresh: boolean,
  currentPic?: string
) => {
  const res = await ipcRenderer.invoke(
    "Pic_getPicList" as PicApi,
    mode,
    refresh,
    currentPic
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

contextBridge.exposeInMainWorld("DeskApi", {
  Win_quit,
  Win_hide,
  Win_max,
  Win_copy,
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
});

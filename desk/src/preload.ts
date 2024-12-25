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

// sortipc
const Sort_getPicFolder = () => {
  ipcRenderer.invoke("Sort_getPicFolder" as SortApi);
};
const Sort_getPicFolderPath = () => {
  ipcRenderer.invoke("Sort_getPicFolderPath" as SortApi);
};
const Sort_setPicFolderPath = () => {
  ipcRenderer.invoke("Sort_setPicFolderPath" as SortApi);
};
const Sort_getPicFolderInfo = () => {
  ipcRenderer.invoke("Sort_getPicFolderInfo" as SortApi);
};
const Sort_openPicFolder = () => {
  ipcRenderer.invoke("Sort_openPicFolder" as SortApi);
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
const Sort_setSortFolderPath = async (folderConfig: SortFolderConfig) => {
  const res = await ipcRenderer.invoke(
    "Sort_setSortFolderPath" as SortApi,
    folderConfig
  );
  return res;
};
const Sort_getSortFolderInfo = () => {
  ipcRenderer.invoke("Sort_getSortFolderInfo" as SortApi);
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

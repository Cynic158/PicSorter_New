import { contextBridge, ipcRenderer } from "electron";

// winipc
const quitApp = () => {
  ipcRenderer.invoke("quitApp");
};

contextBridge.exposeInMainWorld("DeskApi", {
  quitApp,
});

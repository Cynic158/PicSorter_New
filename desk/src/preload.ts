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
ipcRenderer.on("set-app-container", (_event, isMaximized: boolean) => {
  // 动态设置 body 的 margin
  let el = document.querySelector(".app-container") as HTMLDivElement;
  if (isMaximized) {
    el.classList.add("max");
  } else {
    el.classList.remove("max");
  }
});
ipcRenderer.on("hide-app-container", (_event, hide: boolean) => {
  let el = document.querySelector(".app-container") as HTMLDivElement;

  if (hide) {
    el.classList.add("hide");
    el.classList.remove("show");
  } else {
    el.classList.add("show");
    el.classList.remove("hide");
  }
});

contextBridge.exposeInMainWorld("DeskApi", {
  Win_quit,
  Win_hide,
  Win_max,
});

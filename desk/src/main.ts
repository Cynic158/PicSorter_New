import { app, BrowserWindow, Tray } from "electron";
import ipcHandler from "./ipcHandler";
// import fs from "fs";
import path from "path";
import pathManager from "./utils/path";
// import express from "express";

// 获取要读取的pic目录路径
const appPath = app.getAppPath();
const iconPath = pathManager.iconPath;

let mainWindow: BrowserWindow;

function createMainWindow() {
  // 创建主窗口
  mainWindow = new BrowserWindow({
    width: 1500, // 窗口宽度
    height: 800, // 窗口高度
    minWidth: 1500,
    minHeight: 800,
    backgroundColor: "#4c4c4c",
    show: false,
    frame: false,
    transparent: false,
    resizable: true,
    webPreferences: {
      preload: path.resolve(__dirname, "./preload.js"),
    },
    icon: path.resolve(appPath, iconPath),
  });

  // 加载应用的ui
  mainWindow.loadURL("http://localhost:5173/");

  // 打开开发者工具（可选）
  // mainWindow.webContents.openDevTools();

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // 当窗口关闭时触发
  mainWindow.on("closed", () => {
    mainWindow = null as any;
  });

  // 导入ipc通信主入口
  ipcHandler(mainWindow);

  function createTray(mainWindow: BrowserWindow) {
    const tray = new Tray(path.resolve(appPath, iconPath));
    tray.setToolTip("PicSorter");
    tray.on("click", () => {
      mainWindow.isVisible() ? mainWindow.minimize() : mainWindow.show();
    });
  }
  createTray(mainWindow);
}

// 当 Electron 完成初始化并准备创建浏览器窗口时触发
app.on("ready", () => {
  createMainWindow();
});

// 当所有窗口都关闭时触发
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// 当应用程序被激活（点击图标）时触发
app.on("activate", () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

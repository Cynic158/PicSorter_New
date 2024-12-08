// import { app, BrowserWindow, Tray, ipcMain } from "electron";
import { app, BrowserWindow } from "electron";
// import fs from "fs";
import path from "path";
// import express from "express";

// 获取要读取的pic目录路径
// let appPath = app.getAppPath();

let mainWindow: BrowserWindow;

function createMainWindow() {
  // 创建主窗口
  mainWindow = new BrowserWindow({
    width: 1500, // 窗口宽度
    height: 800, // 窗口高度
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      preload: path.resolve(__dirname, "./preload.js"),
    },
    // icon: path.resolve(app.getAppPath(), "../icon.png"),
    // icon: path.resolve(app.getAppPath(), "./icon.png"),
  });

  // 加载应用的 HTML 文件
  // mainWindow.loadURL("http://localhost:7777/");
  mainWindow.loadURL("http://juustalkmomobiu.top");
  // mainWindow.loadFile("./index.html");

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

  // function createTray(mainWindow: BrowserWindow) {
  //   const tray = new Tray(path.resolve(app.getAppPath(), "../icon.png"));
  //   // const tray = new Tray(path.resolve(app.getAppPath(), "./icon.png"));
  //   tray.setToolTip("PicSorter");
  //   tray.on("click", () => {
  //     mainWindow.isVisible() ? mainWindow.minimize() : mainWindow.show();
  //   });
  // }
  // createTray(mainWindow);
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

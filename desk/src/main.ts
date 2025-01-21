import { app, BrowserWindow, Tray } from "electron";
import { cloneDeep } from "lodash";
import ipcHandler from "./ipcHandler";
import fs from "fs";
import path from "path";
import pathManager from "./utils/path";
import express from "express";

// 获取要读取的pic目录路径
const appPath = app.getAppPath();
const iconPath = pathManager.iconPath;
const sortConfigPath = pathManager.sortConfigPath;
const webDistPath = pathManager.webDistPath;

// 先提供一个无效默认的地址
let picStaticPath = path.resolve(appPath, "./pic");
let sortStaticPath = path.resolve(appPath, "./sort");
// 读取未分类存储文件夹路径
const configPath = path.resolve(appPath, sortConfigPath);
// 读取当前配置文件内容
const fileContent = fs.readFileSync(configPath, "utf-8");
// 解析JSON内容
const config: SortConfig = JSON.parse(fileContent);
if (config.picFolderPath) {
  // 更换为配置文件中的图片本地地址
  picStaticPath = config.picFolderPath;
}
if (config.sortFolderPath) {
  sortStaticPath = config.sortFolderPath;
}

const server = express();
// 应用ui地址
const distPath = path.resolve(appPath, webDistPath);
// 挂载应用ui
server.use(express.static(distPath));
// 挂载图片本地服务器
// server.use("/pic", express.static(picStaticPath));
// 动态挂载静态资源
server.use("/pic", (req, res, next) => {
  express.static(picStaticPath)(req, res, next);
});
server.use("/sort", (req, res, next) => {
  express.static(sortStaticPath)(req, res, next);
});
server.listen(7777, "127.0.0.1", () => {
  console.log("local server start at: http://127.0.0.1:7777");
});

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
  mainWindow.loadURL("http://127.0.0.1:5173/");
  // mainWindow.loadURL("http://127.0.0.1:7777/");

  // 打开开发者工具（可选）
  // mainWindow.webContents.openDevTools();

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  // 当窗口关闭时触发
  mainWindow.on("closed", () => {
    mainWindow = null as any;
  });

  // 图片列表缓存
  let picListSave: Array<PicInfo> = [];
  const getPicListSave = () => {
    return cloneDeep(picListSave);
  };
  const setPicListSave = (list: Array<PicInfo>) => {
    picListSave = cloneDeep(list);
  };

  // 图片服务器重启方法
  const resetPicStatic = async (picFolderPath: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        picStaticPath = picFolderPath;
        resolve(true);
      } catch (_error) {
        resolve(false);
      }
    });
  };
  const resetSortStatic = async (sortFolderPath: string): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        sortStaticPath = sortFolderPath;
        resolve(true);
      } catch (_error) {
        resolve(false);
      }
    });
  };

  // 导入ipc通信主入口
  ipcHandler(
    mainWindow,
    getPicListSave,
    setPicListSave,
    resetPicStatic,
    resetSortStatic
  );

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

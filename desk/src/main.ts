import { app, BrowserWindow, Tray } from "electron";
import { cloneDeep } from "lodash";
import ipcHandler from "./ipcHandler";
import fs from "fs";
import path from "path";
import pathManager from "./utils/path";
import express from "express";
import portfinder from "portfinder";

// 获取要读取的pic目录路径
let appPath = app.getAppPath();
// 打包环境
appPath = path.resolve(appPath, "../");
// dev环境
// appPath = path.resolve(appPath, "./");
const iconPath = pathManager.iconPath;
const sortConfigPath = pathManager.sortConfigPath;
const settingConfigPath = pathManager.settingConfigPath;
const webDistPath = pathManager.webDistPath;
const startupPath = pathManager.startupPath;

let showStartup = false;
// 读取是否显示启动图
try {
  // 读取重命名配置
  const settingPath = path.resolve(appPath, settingConfigPath);
  // 读取当前配置文件内容
  const settingContent = fs.readFileSync(settingPath, "utf-8");
  // 解析JSON内容
  const settingConfig: SettingConfig = JSON.parse(settingContent);
  if (settingConfig.showStartup) {
    showStartup = settingConfig.showStartup;
  }
} catch (_error) {
  showStartup = false;
}

let startupWindow: BrowserWindow;
let mainWindow: BrowserWindow;

function createStartupWindow() {
  // 创建启动窗口
  startupWindow = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false, // 无边框
    alwaysOnTop: false, // 置顶
    resizable: false, // 不允许调整大小
    transparent: true,
    show: true,
  });

  // 启动图
  startupWindow.loadFile(path.resolve(appPath, startupPath));
  startupWindow.center();
}

async function createMainWindow() {
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
  portfinder.basePort = 7777;
  let portRes = await portfinder.getPortPromise();
  server.listen(portRes, "127.0.0.1", () => {
    console.log(`local server start at: http://127.0.0.1:${portRes}`);
  });

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
  // mainWindow.loadURL("http://127.0.0.1:7777/");
  mainWindow.loadURL(`http://127.0.0.1:${portRes}/`);

  mainWindow.on("ready-to-show", () => {
    if (showStartup) {
      setTimeout(() => {
        startupWindow.close();
        mainWindow.show();
      }, 2000);
    } else {
      mainWindow.show();
    }
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

  // 记录处理图片数量
  const updateHandlePicCount = async (count: number) => {
    if (count > 0) {
      // 读取重命名配置
      const settingPath = path.resolve(appPath, settingConfigPath);
      // 读取当前配置文件内容
      const settingContent = await fs.promises.readFile(settingPath, "utf-8");
      // 解析JSON内容
      const settingConfig: SettingConfig = JSON.parse(settingContent);
      let cloneSettingConfig = cloneDeep(settingConfig);
      cloneSettingConfig.handlePicCount =
        cloneSettingConfig.handlePicCount + count;
      await fs.promises.writeFile(
        settingPath,
        JSON.stringify(cloneSettingConfig, null, 2),
        "utf-8"
      );
    }
  };

  // 导入ipc通信主入口
  ipcHandler(
    mainWindow,
    getPicListSave,
    setPicListSave,
    resetPicStatic,
    resetSortStatic,
    updateHandlePicCount,
    appPath
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
  if (showStartup) {
    createStartupWindow();
  }
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

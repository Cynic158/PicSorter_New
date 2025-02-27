import { ipcMain, shell } from "electron";
import { generateErrorLog, checkPathsExist } from "../utils/index";
import pathManager from "../utils/path";
import fs from "fs";
import path from "path";
import { cloneDeep } from "lodash";

const settingHandler = (appPath: string) => {
  const settingConfigPath = pathManager.settingConfigPath;
  const sortConfigPath = pathManager.sortConfigPath;
  const picConfigPath = pathManager.picConfigPath;
  const configFilesPath = pathManager.configPath;

  // 获取指定分类项的自动重命名配置
  ipcMain.handle(
    "Setting_getAutoConfig" as SettingApi,
    async (_event, sortName: string) => {
      try {
        // 获取sortConfig的完整路径
        const configPath = path.resolve(appPath, sortConfigPath);
        // 读取当前配置文件内容
        const fileContent = await fs.promises.readFile(configPath, "utf-8");
        // 解析JSON内容
        const config: SortConfig = JSON.parse(fileContent);
        // 总分类文件夹路径
        let sortFolderPath = config.sortFolderPath;
        // 分类项路径
        let sortItemPath = path.join(sortFolderPath, sortName);
        // 检查对应文件夹存不存在
        const checkRes = await checkPathsExist("folder", [sortItemPath]);
        if (!checkRes.success) {
          return {
            success: false,
            data: "onlymessage指定的分类文件夹丢失",
          };
        }

        // 读取重命名配置
        const settingPath = path.resolve(appPath, settingConfigPath);
        // 读取当前配置文件内容
        const settingContent = await fs.promises.readFile(settingPath, "utf-8");
        // 解析JSON内容
        const settingConfig: SettingConfig = JSON.parse(settingContent);
        // 自动重命名配置
        let autoRenameConfig = settingConfig.autoRename;
        // 查找指定的重命名配置
        let findAutoConfig = autoRenameConfig.find(
          (item) => item.path == sortItemPath
        );
        if (findAutoConfig) {
          return {
            success: true,
            data: findAutoConfig,
          };
        } else {
          return {
            success: true,
            data: {
              path: sortItemPath,
              enable: false,
              separator: "_",
              applyNew: true,
              sortType: "nameAsc",
              format: [],
            },
          };
        }
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );

  // 设置指定分类项的自动重命名配置
  ipcMain.handle(
    "Setting_setAutoConfig" as SettingApi,
    async (_event, autoConfig: AutoRenameConfig) => {
      try {
        // 读取重命名配置
        const settingPath = path.resolve(appPath, settingConfigPath);
        // 读取当前配置文件内容
        const settingContent = await fs.promises.readFile(settingPath, "utf-8");
        // 解析JSON内容
        const settingConfig: SettingConfig = JSON.parse(settingContent);
        // 自动重命名配置
        let autoRenameConfig = cloneDeep(settingConfig.autoRename);
        // 获取对应重命名配置
        let findIndex = autoRenameConfig.findIndex(
          (item) => item.path == autoConfig.path
        );
        if (findIndex == -1) {
          // 没找到，新增
          autoRenameConfig.push(autoConfig);
          settingConfig.autoRename = autoRenameConfig;
          // 写回文件
          await fs.promises.writeFile(
            settingPath,
            JSON.stringify(settingConfig, null, 2),
            "utf-8"
          );
          return {
            success: true,
            data: "",
          };
        } else {
          autoRenameConfig[findIndex] = cloneDeep(autoConfig);
          settingConfig.autoRename = autoRenameConfig;
          // 写回文件
          await fs.promises.writeFile(
            settingPath,
            JSON.stringify(settingConfig, null, 2),
            "utf-8"
          );
          return {
            success: true,
            data: "",
          };
        }
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );

  // 获取通用设置
  ipcMain.handle("Setting_getDefaultSetting" as SettingApi, async () => {
    try {
      // 获取sortConfig的完整路径
      const configPath = path.resolve(appPath, sortConfigPath);
      // 读取当前配置文件内容
      const fileContent = await fs.promises.readFile(configPath, "utf-8");
      // 解析JSON内容
      const config: SortConfig = JSON.parse(fileContent);
      let clearList = config.clearList;

      // 获取picConfig的完整路径
      const configPathForPic = path.resolve(appPath, picConfigPath);
      // 读取当前配置文件内容
      const fileContentForPic = await fs.promises.readFile(
        configPathForPic,
        "utf-8"
      );
      // 解析JSON内容
      const configForPic: PicConfig = JSON.parse(fileContentForPic);
      let picLoadLimit = configForPic.picLoadLimit.toString();

      // 获取settingConfig
      // 读取重命名配置
      const settingPath = path.resolve(appPath, settingConfigPath);
      // 读取当前配置文件内容
      const settingContent = await fs.promises.readFile(settingPath, "utf-8");
      // 解析JSON内容
      const settingConfig: SettingConfig = JSON.parse(settingContent);
      let showStartup = settingConfig.showStartup;

      let configFilesPathVal = path.resolve(appPath, configFilesPath);

      return {
        success: true,
        data: {
          clearList,
          picLoadLimit,
          showStartup,
          configPath: configFilesPathVal,
        },
      };
    } catch (error) {
      // 编写错误报告
      let errorLog = generateErrorLog(error);
      return {
        success: false,
        data: errorLog,
      };
    }
  });

  // 设置通用设置
  ipcMain.handle(
    "Setting_setDefaultSetting" as SettingApi,
    async (
      _event,
      clearList: boolean,
      picLoadLimit: number,
      showStartup: boolean
    ) => {
      try {
        // 获取sortConfig的完整路径
        const configPath = path.resolve(appPath, sortConfigPath);
        // 读取当前配置文件内容
        const fileContent = await fs.promises.readFile(configPath, "utf-8");
        // 解析JSON内容
        const config: SortConfig = JSON.parse(fileContent);
        let cloneConfig = cloneDeep(config);
        cloneConfig.clearList = clearList;
        await fs.promises.writeFile(
          configPath,
          JSON.stringify(cloneConfig, null, 2),
          "utf-8"
        );

        // 获取picConfig的完整路径
        const configPathForPic = path.resolve(appPath, picConfigPath);
        // 读取当前配置文件内容
        const fileContentForPic = await fs.promises.readFile(
          configPathForPic,
          "utf-8"
        );
        // 解析JSON内容
        const configForPic: PicConfig = JSON.parse(fileContentForPic);
        let cloneConfigForPic = cloneDeep(configForPic);
        cloneConfigForPic.picLoadLimit = picLoadLimit;
        await fs.promises.writeFile(
          configPathForPic,
          JSON.stringify(cloneConfigForPic, null, 2),
          "utf-8"
        );

        // 获取settingConfig的完整路径
        const settingPath = path.resolve(appPath, settingConfigPath);
        // 读取当前配置文件内容
        const settingContent = await fs.promises.readFile(settingPath, "utf-8");
        // 解析JSON内容
        const settingConfig: SettingConfig = JSON.parse(settingContent);
        let cloneSettingConfig = cloneDeep(settingConfig);
        cloneSettingConfig.showStartup = showStartup;
        await fs.promises.writeFile(
          settingPath,
          JSON.stringify(cloneSettingConfig, null, 2),
          "utf-8"
        );

        return {
          success: true,
          data: "",
        };
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );

  // 打开配置文件目录
  ipcMain.handle("Setting_openConfigFolder" as SettingApi, async () => {
    try {
      let configFilesPathVal = path.resolve(appPath, configFilesPath);
      await shell.openPath(configFilesPathVal);
      return {
        success: true,
        data: "",
      };
    } catch (error) {
      // 编写错误报告
      let errorLog = generateErrorLog(error);
      return {
        success: false,
        data: errorLog,
      };
    }
  });

  // 获取置顶列表
  ipcMain.handle("Setting_getTopList" as SettingApi, async () => {
    try {
      // 获取sortConfig的完整路径
      const configPath = path.resolve(appPath, sortConfigPath);
      // 读取当前配置文件内容
      const fileContent = await fs.promises.readFile(configPath, "utf-8");
      // 解析JSON内容
      const config: SortConfig = JSON.parse(fileContent);
      let topList = config.topList;
      return {
        success: true,
        data: topList,
      };
    } catch (error) {
      // 编写错误报告
      let errorLog = generateErrorLog(error);
      return {
        success: false,
        data: errorLog,
      };
    }
  });

  // 设置置顶列表
  ipcMain.handle(
    "Setting_setTopList" as SettingApi,
    async (_event, topList: Array<string>) => {
      try {
        // 获取sortConfig的完整路径
        const configPath = path.resolve(appPath, sortConfigPath);
        // 读取当前配置文件内容
        const fileContent = await fs.promises.readFile(configPath, "utf-8");
        // 解析JSON内容
        const config: SortConfig = JSON.parse(fileContent);
        let cloneConfig = cloneDeep(config);
        cloneConfig.topList = topList;
        await fs.promises.writeFile(
          configPath,
          JSON.stringify(cloneConfig, null, 2),
          "utf-8"
        );
        return {
          success: true,
          data: "",
        };
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );

  // 获取自动重命名列表
  ipcMain.handle("Setting_getAutoConfigList" as SettingApi, async () => {
    try {
      // 读取重命名配置
      const settingPath = path.resolve(appPath, settingConfigPath);
      // 读取当前配置文件内容
      const settingContent = await fs.promises.readFile(settingPath, "utf-8");
      // 解析JSON内容
      const settingConfig: SettingConfig = JSON.parse(settingContent);
      // 自动重命名配置
      let autoRenameConfig = settingConfig.autoRename;
      let autoPathList = autoRenameConfig.map((item) => item.path);
      return {
        success: true,
        data: autoPathList,
      };
    } catch (error) {
      // 编写错误报告
      let errorLog = generateErrorLog(error);
      return {
        success: false,
        data: errorLog,
      };
    }
  });

  // 设置自动重命名列表
  ipcMain.handle(
    "Setting_setAutoConfigList" as SettingApi,
    async (_event, autoList: Array<string>) => {
      try {
        // 读取重命名配置
        const settingPath = path.resolve(appPath, settingConfigPath);
        // 读取当前配置文件内容
        const settingContent = await fs.promises.readFile(settingPath, "utf-8");
        // 解析JSON内容
        const settingConfig: SettingConfig = JSON.parse(settingContent);
        let cloneSettingConfig = cloneDeep(settingConfig);
        let filterAutoRenameConfig = cloneSettingConfig.autoRename.filter(
          (item) => autoList.includes(item.path)
        );
        cloneSettingConfig.autoRename = filterAutoRenameConfig;
        // 写回文件
        await fs.promises.writeFile(
          settingPath,
          JSON.stringify(cloneSettingConfig, null, 2),
          "utf-8"
        );
        return {
          success: true,
          data: "",
        };
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );

  // 打开指定文件夹
  ipcMain.handle(
    "Setting_openFolder" as SettingApi,
    async (_event, folderPath: string) => {
      try {
        // 检查对应文件夹存不存在
        const checkRes = await checkPathsExist("folder", [folderPath]);
        if (!checkRes.success) {
          return {
            success: false,
            data: "onlymessage指定的文件夹丢失",
          };
        }
        await shell.openPath(folderPath);
        return {
          success: true,
          data: "",
        };
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );

  // 获取图片处理数
  ipcMain.handle("Setting_getHandlePicCount" as SettingApi, async () => {
    try {
      // 读取重命名配置
      const settingPath = path.resolve(appPath, settingConfigPath);
      // 读取当前配置文件内容
      const settingContent = await fs.promises.readFile(settingPath, "utf-8");
      // 解析JSON内容
      const settingConfig: SettingConfig = JSON.parse(settingContent);
      let handlePicCount = settingConfig.handlePicCount.toString();
      return {
        success: true,
        data: handlePicCount,
      };
    } catch (error) {
      // 编写错误报告
      let errorLog = generateErrorLog(error);
      return {
        success: false,
        data: errorLog,
      };
    }
  });

  // 获取快捷键配置
  ipcMain.handle("Setting_getShortcut" as SettingApi, async () => {
    try {
      // 读取快捷键配置
      const settingPath = path.resolve(appPath, settingConfigPath);
      // 读取当前配置文件内容
      const settingContent = await fs.promises.readFile(settingPath, "utf-8");
      // 解析JSON内容
      const settingConfig: SettingConfig = JSON.parse(settingContent);
      let shortcuts = settingConfig.shortcuts;
      return {
        success: true,
        data: shortcuts,
      };
    } catch (error) {
      // 编写错误报告
      let errorLog = generateErrorLog(error);
      return {
        success: false,
        data: errorLog,
      };
    }
  });

  // 设置快捷键配置
  ipcMain.handle(
    "Setting_setShortcut" as SettingApi,
    async (_event, shortcuts: Array<boolean>) => {
      try {
        // 读取快捷键配置
        const settingPath = path.resolve(appPath, settingConfigPath);
        // 读取当前配置文件内容
        const settingContent = await fs.promises.readFile(settingPath, "utf-8");
        // 解析JSON内容
        const settingConfig: SettingConfig = JSON.parse(settingContent);
        let cloneSettingConfig = cloneDeep(settingConfig);
        cloneSettingConfig.shortcuts = shortcuts;
        // 写回文件
        await fs.promises.writeFile(
          settingPath,
          JSON.stringify(cloneSettingConfig, null, 2),
          "utf-8"
        );
        return {
          success: true,
          data: "",
        };
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );
};

export default settingHandler;

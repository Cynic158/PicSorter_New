import { ipcMain, app } from "electron";
import { generateErrorLog, checkPathsExist } from "../utils/index";
import pathManager from "../utils/path";
import fs from "fs";
import path from "path";
import { cloneDeep } from "lodash";

const settingHandler = () => {
  const appPath = app.getAppPath();
  const settingConfigPath = pathManager.settingConfigPath;
  const sortConfigPath = pathManager.sortConfigPath;
  const picConfigPath = pathManager.picConfigPath;

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

  // 设置通用设置
  ipcMain.handle(
    "Setting_setDefaultSetting" as SettingApi,
    async (_event, clearList: boolean, picLoadLimit: number) => {
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

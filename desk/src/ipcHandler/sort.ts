import { ipcMain, dialog, app, shell } from "electron";
import {
  generateErrorLog,
  checkPathsExist,
  getFolderInfo,
} from "../utils/index";
import fs from "fs";
import path from "path";
import pathManager from "../utils/path";
import { cloneDeep } from "lodash";

const sortHandler = (
  resetPicStatic: ResetPicStaticType,
  resetSortStatic: ResetSortStaticType,
  getPicListSave: GetPicListSaveType,
  setPicListSave: SetPicListSave
) => {
  const appPath = app.getAppPath();
  const sortConfigPath = pathManager.sortConfigPath;
  const settingConfigPath = pathManager.settingConfigPath;

  ipcMain.handle("Sort_getPicFolder" as SortApi, () => {});

  // 获取未分类文件夹路径
  ipcMain.handle(
    "Sort_getPicFolderPath" as SortApi,
    async (_event, folderPath: string) => {
      try {
        let defaultPath = app.getPath("desktop");
        if (folderPath) {
          const checkRes = await checkPathsExist("folder", [folderPath]);
          if (checkRes.success) {
            defaultPath = folderPath;
          }
        }

        const result = await dialog.showOpenDialog({
          defaultPath: defaultPath,
          title: "请选择未分类文件夹",
          properties: ["createDirectory", "openDirectory"], // 只允许选择文件夹
          buttonLabel: "确定",
          filters: [{ name: "Folders", extensions: [""] }],
        });

        if (result.canceled) {
          return {
            success: true,
            data: "",
          };
        } else {
          return {
            success: true,
            data: result.filePaths[0],
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

  // 设置未分类文件夹路径
  ipcMain.handle(
    "Sort_setPicFolderPath" as SortApi,
    async (_event, folderConfig: PicFolderConfigType) => {
      try {
        // 在sortconfig中设置未分类文件夹配置
        // 检查对应文件夹存不存在
        const checkRes = await checkPathsExist("folder", [
          folderConfig.folderPath,
        ]);
        if (!checkRes.success) {
          return {
            success: false,
            data: "onlymessage对应未分类文件夹不存在！",
          };
        }

        // 获取sortConfig的完整路径
        const configPath = path.resolve(appPath, sortConfigPath);
        // 读取当前配置文件内容
        const fileContent = await fs.promises.readFile(configPath, "utf-8");
        // 解析JSON内容
        const config: SortConfig = JSON.parse(fileContent);
        // 更新配置
        config.picFolderPath = folderConfig.folderPath;
        config.picFolderType = folderConfig.sortType;
        config.deep = folderConfig.deep;
        config.selectConfig = folderConfig.selectConfig;
        // 将更新后的配置内容写回文件
        await fs.promises.writeFile(
          configPath,
          JSON.stringify(config, null, 2),
          "utf-8"
        );

        let serverRes = await resetPicStatic(folderConfig.folderPath);
        if (serverRes) {
          // 设置完成
          return {
            success: true,
            data: "",
          };
        } else {
          // 设置失败
          return {
            success: false,
            data: "设置本地图片服务器时出错",
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

  // 获取未分类文件夹信息
  ipcMain.handle("Sort_getPicFolderInfo" as SortApi, async () => {
    try {
      // 获取sortConfig的完整路径
      const configPath = path.resolve(appPath, sortConfigPath);
      // 读取当前配置文件内容
      const fileContent = await fs.promises.readFile(configPath, "utf-8");
      // 解析JSON内容
      const config: SortConfig = JSON.parse(fileContent);
      // 未分类文件夹路径
      let picFolderPath = config.picFolderPath;
      // 是否穿透
      let deepRead = config.deep;
      if (picFolderPath == "") {
        return {
          success: false,
          data: "onlymessage未指定未分类存储文件夹",
        };
      }

      // 检查对应文件夹存不存在
      const checkRes = await checkPathsExist("folder", [picFolderPath]);
      if (!checkRes.success) {
        return {
          success: false,
          data: "onlymessage未分类存储文件夹丢失！",
        };
      }

      let infoRes = await getFolderInfo(picFolderPath, deepRead, "pic");
      return {
        success: true,
        data: infoRes,
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

  // 打开未分类文件夹
  ipcMain.handle("Sort_openPicFolder" as SortApi, async () => {
    try {
      // 获取sortConfig的完整路径
      const configPath = path.resolve(appPath, sortConfigPath);
      // 读取当前配置文件内容
      const fileContent = await fs.promises.readFile(configPath, "utf-8");
      // 解析JSON内容
      const config: SortConfig = JSON.parse(fileContent);
      // 未分类文件夹路径
      let picFolderPath = config.picFolderPath;
      await shell.openPath(picFolderPath);
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

  // 获取总分类文件夹
  ipcMain.handle("Sort_getSortFolder" as SortApi, async () => {
    try {
      // 读取配置文件当中的总分类文件夹路径
      // 获取sortConfig的完整路径
      const configPath = path.resolve(appPath, sortConfigPath);
      // 读取当前配置文件内容
      const fileContent = await fs.promises.readFile(configPath, "utf-8");
      // 解析JSON内容
      const config: SortConfig = JSON.parse(fileContent);
      // 总分类文件夹路径
      let sortFolderPath = config.sortFolderPath;
      // 排序方式
      let sortType = config.sortFolderType || "nameAsc";
      // 是否清除选择列表
      let clearList = config.clearList;
      // 置顶列表
      let topList = config.topList;
      if (sortFolderPath == "") {
        return {
          success: true,
          data: {
            folderPath: "",
            sortType: sortType,
            list: [],
            clearList: clearList,
          },
        };
      }

      // 检查对应文件夹存不存在
      const checkRes = await checkPathsExist("folder", [sortFolderPath]);
      if (!checkRes.success) {
        return {
          success: false,
          data: "onlymessage总分类文件夹丢失！",
        };
      }
      // 获取总分类文件夹下的文件夹列表
      const folders = await fs.promises.readdir(sortFolderPath);

      // 用于存储最终的文件夹信息
      const topFolders: Array<SortFolderListType> = [];
      const nonTopFolders: Array<SortFolderListType> = [];

      const validPicTypes: Array<picType> = ["png", "jpg", "gif", "webp"];

      const isImage = (file: string): boolean => {
        const ext = path.extname(file).toLowerCase().replace(".", "");
        return validPicTypes.includes(ext as picType);
      };

      // 获取文件夹信息
      for (const folder of folders) {
        const folderPath = path.join(sortFolderPath, folder);
        const stats = await fs.promises.stat(folderPath);

        // 仅处理文件夹，不处理文件
        if (stats.isDirectory()) {
          // 获取该文件夹内的文件数量和文件总大小
          const files = await fs.promises.readdir(folderPath, {
            withFileTypes: true,
          });
          let totalSize = 0;
          let fileCount = 0;

          for (const file of files) {
            const filePath = path.join(folderPath, file.name);
            const fileStats = await fs.promises.stat(filePath);

            // 仅计算文件，不计算子文件夹
            if (fileStats.isFile() && isImage(file.name)) {
              fileCount++;
              totalSize += fileStats.size;
            }
          }

          // 检查文件夹是否在 topList 中
          const isTop = topList.includes(folderPath);

          // 创建文件夹信息对象
          const folderInfo: SortFolderListType = {
            name: folder,
            count: fileCount,
            size: totalSize,
            top: isTop,
          };

          // 按照置顶与非置顶分开存储
          if (isTop) {
            topFolders.push(folderInfo);
          } else {
            nonTopFolders.push(folderInfo);
          }
        }
      }

      // 根据 sortType 对置顶和非置顶文件夹进行排序
      const compareFunctions: {
        [key in SortType]: (
          a: SortFolderListType,
          b: SortFolderListType
        ) => number;
      } = {
        nameAsc: (a, b) => {
          const isAEnglish = /^[A-Za-z]/.test(a.name); // 判断文件夹名称首字符是否为英文
          const isBEnglish = /^[A-Za-z]/.test(b.name);
          const isAChinese = /^[\u4e00-\u9fa5]/.test(a.name); // 判断文件夹名称首字符是否为中文
          const isBChinese = /^[\u4e00-\u9fa5]/.test(b.name);

          // 如果 a 是非英文非中文，排最前面
          if (!isAEnglish && !isAChinese && (isBEnglish || isBChinese))
            return -1;
          if ((isAEnglish || isAChinese) && !isBEnglish && !isBChinese)
            return 1;

          // 英文文件夹排在中文文件夹前面
          if (isAEnglish && !isBEnglish) return -1;
          if (!isAEnglish && isBEnglish) return 1;

          // 中文文件夹按正常字母顺序排序
          if (isAChinese && !isBChinese) return 1;
          if (!isAChinese && isBChinese) return -1;

          // 如果是同样类型的文件夹，按照字母顺序比较
          return a.name.localeCompare(b.name);
        },
        nameDesc: (a, b) => {
          const isAEnglish = /^[A-Za-z]/.test(a.name);
          const isBEnglish = /^[A-Za-z]/.test(b.name);
          const isAChinese = /^[\u4e00-\u9fa5]/.test(a.name);
          const isBChinese = /^[\u4e00-\u9fa5]/.test(b.name);

          // 如果 a 是非英文非中文，排最前面
          if (!isAEnglish && !isAChinese && (isBEnglish || isBChinese))
            return -1;
          if ((isAEnglish || isAChinese) && !isBEnglish && !isBChinese)
            return 1;

          // 英文文件夹排在中文文件夹前面
          if (isAEnglish && !isBEnglish) return 1;
          if (!isAEnglish && isBEnglish) return -1;

          // 中文文件夹按正常字母顺序排序
          if (isAChinese && !isBChinese) return -1;
          if (!isAChinese && isBChinese) return 1;

          // 如果是同样类型的文件夹，按照字母顺序反向比较
          return b.name.localeCompare(a.name);
        },
        sizeAsc: (a, b) => a.size - b.size,
        sizeDesc: (a, b) => b.size - a.size,
        countAsc: (a, b) => a.count - b.count,
        countDesc: (a, b) => b.count - a.count,
        createdAtAsc: (a, b) =>
          fs.statSync(path.join(sortFolderPath, a.name)).birthtimeMs -
          fs.statSync(path.join(sortFolderPath, b.name)).birthtimeMs,
        createdAtDesc: (a, b) =>
          fs.statSync(path.join(sortFolderPath, b.name)).birthtimeMs -
          fs.statSync(path.join(sortFolderPath, a.name)).birthtimeMs,
        modifiedAtAsc: (a, b) =>
          fs.statSync(path.join(sortFolderPath, a.name)).mtimeMs -
          fs.statSync(path.join(sortFolderPath, b.name)).mtimeMs,
        modifiedAtDesc: (a, b) =>
          fs.statSync(path.join(sortFolderPath, b.name)).mtimeMs -
          fs.statSync(path.join(sortFolderPath, a.name)).mtimeMs,
      };

      // 对置顶和非置顶文件夹分别进行排序
      const sortFunction = compareFunctions[sortType];
      topFolders.sort(sortFunction);
      nonTopFolders.sort(sortFunction);

      // 合并两个数组，确保置顶文件夹排在前面
      const result = [...topFolders, ...nonTopFolders];

      // 返回结果
      return {
        success: true,
        data: {
          folderPath: sortFolderPath,
          sortType: sortType,
          list: result,
          clearList: clearList,
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

  // 获取总分类文件夹路径
  ipcMain.handle(
    "Sort_getSortFolderPath" as SortApi,
    async (_event, folderPath: string) => {
      try {
        let defaultPath = app.getPath("desktop");
        if (folderPath) {
          const checkRes = await checkPathsExist("folder", [folderPath]);
          if (checkRes.success) {
            defaultPath = folderPath;
          }
        }

        const result = await dialog.showOpenDialog({
          defaultPath: defaultPath,
          title: "请选择总分类文件夹",
          properties: ["createDirectory", "openDirectory"], // 只允许选择文件夹
          buttonLabel: "确定",
          filters: [{ name: "Folders", extensions: [""] }],
        });

        if (result.canceled) {
          return {
            success: true,
            data: "",
          };
        } else {
          return {
            success: true,
            data: result.filePaths[0],
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

  // 设置总分类文件夹路径
  ipcMain.handle(
    "Sort_setSortFolderPath" as SortApi,
    async (_event, folderConfig: SortFolderConfigType) => {
      try {
        // 在sortconfig中设置总分类文件夹路径以及排序方式
        // 检查对应文件夹存不存在
        const checkRes = await checkPathsExist("folder", [
          folderConfig.folderPath,
        ]);
        if (!checkRes.success) {
          return {
            success: false,
            data: "onlymessage对应总分类文件夹不存在！",
          };
        }

        // 获取sortConfig的完整路径
        const configPath = path.resolve(appPath, sortConfigPath);
        // 读取当前配置文件内容
        const fileContent = await fs.promises.readFile(configPath, "utf-8");
        // 解析JSON内容
        const config: SortConfig = JSON.parse(fileContent);
        // 更新sortFolderPath
        config.sortFolderPath = folderConfig.folderPath;
        config.sortFolderType = folderConfig.sortType;
        // 将更新后的配置内容写回文件
        await fs.promises.writeFile(
          configPath,
          JSON.stringify(config, null, 2),
          "utf-8"
        );

        let serverRes = await resetSortStatic(folderConfig.folderPath);
        if (serverRes) {
          // 设置完成
          return {
            success: true,
            data: "",
          };
        } else {
          // 设置失败
          return {
            success: false,
            data: "设置本地图片服务器时出错",
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

  // 获取总分类文件夹信息
  ipcMain.handle("Sort_getSortFolderInfo" as SortApi, async () => {
    try {
      // 获取sortConfig的完整路径
      const configPath = path.resolve(appPath, sortConfigPath);
      // 读取当前配置文件内容
      const fileContent = await fs.promises.readFile(configPath, "utf-8");
      // 解析JSON内容
      const config: SortConfig = JSON.parse(fileContent);
      // 总分类文件夹路径
      let sortFolderPath = config.sortFolderPath;
      if (sortFolderPath == "") {
        return {
          success: false,
          data: "onlymessage未指定总分类存储文件夹",
        };
      }

      // 检查对应文件夹存不存在
      const checkRes = await checkPathsExist("folder", [sortFolderPath]);
      if (!checkRes.success) {
        return {
          success: false,
          data: "onlymessage总分类存储文件夹丢失！",
        };
      }

      let infoRes = await getFolderInfo(sortFolderPath, false, "sort");
      return {
        success: true,
        data: infoRes,
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

  // 打开总分类文件夹
  ipcMain.handle("Sort_openSortFolder" as SortApi, async () => {
    try {
      // 获取sortConfig的完整路径
      const configPath = path.resolve(appPath, sortConfigPath);
      // 读取当前配置文件内容
      const fileContent = await fs.promises.readFile(configPath, "utf-8");
      // 解析JSON内容
      const config: SortConfig = JSON.parse(fileContent);
      // 总分类文件夹路径
      let sortFolderPath = config.sortFolderPath;
      await shell.openPath(sortFolderPath);
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

  // 新增分类文件夹
  ipcMain.handle(
    "Sort_insertSortFolder" as SortApi,
    async (_event, name: string) => {
      try {
        // 获取sortConfig的完整路径
        const configPath = path.resolve(appPath, sortConfigPath);
        // 读取当前配置文件内容
        const fileContent = await fs.promises.readFile(configPath, "utf-8");
        // 解析JSON内容
        const config: SortConfig = JSON.parse(fileContent);
        // 总分类文件夹路径
        let sortFolderPath = config.sortFolderPath;
        if (sortFolderPath == "") {
          return {
            success: false,
            conflict: false,
            data: "onlymessage未指定总分类存储文件夹",
          };
        }

        // 检查对应文件夹存不存在
        const checkRes = await checkPathsExist("folder", [sortFolderPath]);
        if (!checkRes.success) {
          return {
            success: false,
            conflict: false,
            data: "onlymessage总分类存储文件夹丢失！",
          };
        }

        // 检查新名称有没有冲突
        let newSortFolderPath = path.resolve(sortFolderPath, name);
        const conflictCheckRes = await checkPathsExist("folder", [
          newSortFolderPath,
        ]);
        if (conflictCheckRes.success) {
          return {
            success: true,
            conflict: true,
            data: "",
          };
        }

        // 无冲突，允许新建
        await fs.promises.mkdir(newSortFolderPath);
        return {
          success: true,
          conflict: false,
          data: "",
        };
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          conflict: false,
          data: errorLog,
        };
      }
    }
  );

  // 删除分类文件夹
  ipcMain.handle(
    "Sort_deleteSortFolder" as SortApi,
    async (_event, targets: Array<string>) => {
      try {
        // 获取sortConfig的完整路径
        const configPath = path.resolve(appPath, sortConfigPath);
        // 读取当前配置文件内容
        const fileContent = await fs.promises.readFile(configPath, "utf-8");
        // 解析JSON内容
        const config: SortConfig = JSON.parse(fileContent);
        // 总分类文件夹路径
        let sortFolderPath = config.sortFolderPath;
        if (sortFolderPath == "") {
          return {
            success: false,
            data: "onlymessage未指定总分类存储文件夹",
          };
        }

        // 检查对应文件夹存不存在
        const checkRes = await checkPathsExist("folder", [sortFolderPath]);
        if (!checkRes.success) {
          return {
            success: false,
            data: "onlymessage总分类存储文件夹丢失！",
          };
        }

        // 检查需要删除的文件夹是否存在
        let mapTargets = targets.map((target) =>
          path.resolve(sortFolderPath, target)
        );
        const existRes = await checkPathsExist("folder", [...mapTargets]);
        // 过滤掉不存在的文件夹
        let filterTargets = mapTargets.filter(
          (target) => !existRes.result.includes(target)
        );
        // 余下文件夹都存在，可开始删除
        await Promise.all(
          filterTargets.map(async (target) => {
            await shell.trashItem(target);
          })
        );

        // 清理自动重命名配置
        const settingPath = path.resolve(appPath, settingConfigPath);
        // 读取当前配置文件内容
        const settingContent = await fs.promises.readFile(settingPath, "utf-8");
        // 解析JSON内容
        const settingConfig: SettingConfig = JSON.parse(settingContent);
        // 自动重命名配置
        const autoRenameConfig = settingConfig.autoRename;
        const filterConfig = autoRenameConfig.filter(
          (item) => !mapTargets.includes(item.path)
        );
        // 更新配置
        settingConfig.autoRename = filterConfig;
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

  // 删除图片
  ipcMain.handle(
    "Sort_deletePic" as SortApi,
    async (_event, picPath: string) => {
      try {
        // 检查在缓存列表中有没有这个图片
        let picList = getPicListSave();
        let findPicIndex = picList.findIndex((item) => item.path == picPath);
        if (findPicIndex == -1) {
          // 没找到
          return {
            success: true,
            data: "",
          };
        }

        // 获取到其路径
        let checkRes = await checkPathsExist("file", [
          picList[findPicIndex].path,
        ]);
        // 检查在文件夹中有没有这个图片
        if (!checkRes.success) {
          // 文件夹内不存在这个图片
          return {
            success: true,
            data: "",
          };
        }

        await shell.trashItem(picList[findPicIndex].path);
        // 更新缓存列表
        let cloneList = cloneDeep(picList);
        cloneList.splice(findPicIndex, 1);
        // 重新设置缓存列表
        setPicListSave(cloneList);
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

  // 删除图片组
  ipcMain.handle(
    "Sort_deletePicGroup" as SortApi,
    async (_event, picPathGroup: Array<string>) => {
      try {
        const resetList = () => {
          let picList = getPicListSave();
          let cloneList = cloneDeep(picList);
          let filterList = cloneList.filter(
            (item) => !picPathGroup.includes(item.path)
          );
          setPicListSave(filterList);
        };
        // 直接检查所有路径
        let checkRes = await checkPathsExist("file", picPathGroup);
        // 得到存在列表
        let filterList = picPathGroup.filter(
          (item) => !checkRes.result.includes(item)
        );
        if (filterList.length == 0) {
          resetList();
          return {
            success: true,
            data: "",
          };
        }

        await Promise.all(
          filterList.map(async (item) => {
            await shell.trashItem(item);
          })
        );
        resetList();
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

export default sortHandler;

import { ipcMain, app } from "electron";
import {
  checkPathsExist,
  generateErrorLog,
  filterImages,
} from "../utils/index";
import fs from "fs";
import path from "path";
import pathManager from "../utils/path";

const picHandler = (
  getPicListSave: () => Array<PicInfo>,
  setPicListSave: (list: Array<PicInfo>) => void
) => {
  const appPath = app.getAppPath();
  const picConfigPath = pathManager.picConfigPath;
  const sortConfigPath = pathManager.sortConfigPath;

  ipcMain.handle(
    "Pic_getPicList" as PicApi,
    async (_event, mode: viewType, refresh: boolean, currentPic?: string) => {
      try {
        let config: SortConfig | null = null;
        // 如果需要刷新，读取配置，重新获取一次列表并返回配置
        if (refresh) {
          // 获取sortConfig的完整路径
          const configPath = path.resolve(appPath, sortConfigPath);
          // 读取当前配置文件内容
          const fileContent = await fs.promises.readFile(configPath, "utf-8");
          // 解析JSON内容
          config = JSON.parse(fileContent);
          // 未分类文件夹路径
          let picFolderPath = config!.picFolderPath;
          // 排序方式
          let sortType = config!.picFolderType;
          // 是否穿透
          let deepRead = config!.deep;
          // 筛选配置
          let selectConfig = config!.selectConfig;

          if (picFolderPath == "") {
            setPicListSave([]);
            return {
              success: true,
              data: {
                config: {
                  folderPath: "",
                  sortType: sortType,
                  deep: deepRead,
                  selectConfig: selectConfig,
                },
                picList: [],
                total: 0,
              },
            };
          }

          // 检查对应文件夹存不存在
          const checkRes = await checkPathsExist("folder", [picFolderPath]);
          if (!checkRes.success) {
            setPicListSave([]);
            return {
              success: false,
              data: "onlymessage总分类文件夹丢失！",
            };
          }

          // 会得到一个完整文件路径数组
          let imageFiles: Array<string> = [];
          function readFolder(currentPath: string) {
            const entries = fs.readdirSync(currentPath, {
              withFileTypes: true,
            });

            for (const entry of entries) {
              const entryPath = path.join(currentPath, entry.name);

              if (entry.isDirectory() && deepRead) {
                // 递归读取子文件夹
                readFolder(entryPath);
              } else if (entry.isFile()) {
                // 检查文件后缀是否符合要求
                const ext = path.extname(entry.name).toLowerCase().slice(1); // 去掉"."并转为小写
                if (selectConfig.fileType.includes(ext as any)) {
                  imageFiles.push(entryPath);
                }
              }
            }
          }
          readFolder(picFolderPath);

          if (imageFiles.length == 0) {
            setPicListSave([]);
            return {
              success: true,
              data: {
                config: {
                  folderPath: picFolderPath,
                  sortType: sortType,
                  deep: deepRead,
                  selectConfig: selectConfig,
                },
                picList: [],
                total: 0,
              },
            };
          }

          // 开始进行过滤
          let filterList = await filterImages(selectConfig, imageFiles);
          if (filterList.length == 0) {
            setPicListSave([]);
            return {
              success: true,
              data: {
                config: {
                  folderPath: picFolderPath,
                  sortType: sortType,
                  deep: deepRead,
                  selectConfig: selectConfig,
                },
                picList: [],
                total: 0,
              },
            };
          }

          // 排序
          const compareFunctions: {
            [key in SortTypeForPic]: (a: PicInfo, b: PicInfo) => number;
          } = {
            nameAsc: (a, b) => {
              const isAEnglish = /^[A-Za-z]/.test(a.name); // 判断图片名称首字符是否为英文
              const isBEnglish = /^[A-Za-z]/.test(b.name);
              const isAChinese = /^[\u4e00-\u9fa5]/.test(a.name); // 判断图片名称首字符是否为中文
              const isBChinese = /^[\u4e00-\u9fa5]/.test(b.name);

              // 如果 a 是非英文非中文，排最前面
              if (!isAEnglish && !isAChinese && (isBEnglish || isBChinese))
                return -1;
              if ((isAEnglish || isAChinese) && !isBEnglish && !isBChinese)
                return 1;

              // 英文名称排在中文名称前面
              if (isAEnglish && !isBEnglish) return -1;
              if (!isAEnglish && isBEnglish) return 1;

              if (isAChinese && !isBChinese) return 1;
              if (!isAChinese && isBChinese) return -1;

              // 如果是同样类型的名称，按照字母顺序比较
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

              // 英文名称排在中文名称前面
              if (isAEnglish && !isBEnglish) return 1;
              if (!isAEnglish && isBEnglish) return -1;

              if (isAChinese && !isBChinese) return -1;
              if (!isAChinese && isBChinese) return 1;

              // 如果是同样类型的文件夹，按照字母顺序反向比较
              return b.name.localeCompare(a.name);
            },
            sizeAsc: (a, b) => a.size - b.size,
            sizeDesc: (a, b) => b.size - a.size,
            createdAtAsc: (a, b) => a.createdAt - b.createdAt,
            createdAtDesc: (a, b) => b.createdAt - a.createdAt,
            modifiedAtAsc: (a, b) => a.modifiedAt - b.modifiedAt,
            modifiedAtDesc: (a, b) => b.modifiedAt - a.modifiedAt,
          };

          const sortFunction = compareFunctions[sortType];
          filterList.sort(sortFunction);

          // 缓存
          setPicListSave(filterList);
        }

        let picList = getPicListSave();
        let returnConfig: any = null;
        if (refresh) {
          returnConfig = {
            folderPath: config!.picFolderPath,
            sortType: config!.picFolderType,
            deep: config!.deep,
            selectConfig: config!.selectConfig,
          };
        }
        if (mode == "view") {
          // 提供三张图片
          if (picList.length == 0) {
            return {
              success: true,
              data: {
                config: returnConfig,
                picList: [null, null, null],
                total: 0,
              },
            };
          }
          // 如果没有提供currentPic，直接提供前三个
          if (currentPic !== "" && !currentPic) {
            let prev = null;
            let now = picList[0];
            let next = picList[1] ? picList[1] : null;
            return {
              success: true,
              data: {
                config: returnConfig,
                picList: [prev, now, next],
                total: picList.length,
              },
            };
          } else {
            // 提供了currentPic，需要查找
            let findIndex = picList.findIndex(
              (item) => item.name == currentPic
            );
            if (findIndex == -1) {
              // 报错
              return {
                success: false,
                data: "找不到currentPic",
              };
            } else if (findIndex == 0) {
              let prev = null;
              let now = picList[0];
              let next = picList[1] ? picList[1] : null;
              return {
                success: true,
                data: {
                  config: returnConfig,
                  picList: [prev, now, next],
                  total: picList.length,
                },
              };
            } else if (findIndex == picList.length - 1) {
              let prev = picList[picList.length - 2]
                ? picList[picList.length - 2]
                : null;
              let now = picList[picList.length - 1];
              let next = null;
              return {
                success: true,
                data: {
                  config: returnConfig,
                  picList: [prev, now, next],
                  total: picList.length,
                },
              };
            } else {
              let prev = picList[findIndex - 1] ? picList[findIndex - 1] : null;
              let now = picList[findIndex];
              let next = picList[findIndex + 1] ? picList[findIndex + 1] : null;
              return {
                success: true,
                data: {
                  config: returnConfig,
                  picList: [prev, now, next],
                  total: picList.length,
                },
              };
            }
          }
        } else if (mode == "horizontal") {
          // 根据获取上限，提供横向图片列表
          if (picList.length == 0) {
            return {
              success: true,
              data: {
                config: returnConfig,
                picList: [],
                total: 0,
              },
            };
          } else {
            // 过滤出横向的
            let horList = picList.filter(
              (item) =>
                item.resolution.width &&
                item.resolution.height &&
                item.resolution.width >= item.resolution.height
            );
            if (horList.length == 0) {
              return {
                success: true,
                data: {
                  config: returnConfig,
                  picList: [],
                  total: 0,
                },
              };
            } else {
              // 获取picConfig的完整路径
              const configPath = path.resolve(appPath, picConfigPath);
              // 读取当前配置文件内容
              const fileContent = await fs.promises.readFile(
                configPath,
                "utf-8"
              );
              // 解析JSON内容
              const picConfig: PicConfig = JSON.parse(fileContent);
              // 限制值
              const limit = picConfig.picLoadLimit;
              return {
                success: true,
                data: {
                  config: returnConfig,
                  picList: horList.slice(0, limit),
                  total: horList.length,
                },
              };
            }
          }
        } else {
          // 根据获取上限，提供纵向图片列表
          if (picList.length == 0) {
            return {
              success: true,
              data: {
                config: returnConfig,
                picList: [],
                total: 0,
              },
            };
          } else {
            // 过滤出纵向的
            let verList = picList.filter(
              (item) =>
                item.resolution.width &&
                item.resolution.height &&
                item.resolution.width < item.resolution.height
            );
            if (verList.length == 0) {
              return {
                success: true,
                data: {
                  config: returnConfig,
                  picList: [],
                  total: 0,
                },
              };
            } else {
              // 获取picConfig的完整路径
              const configPath = path.resolve(appPath, picConfigPath);
              // 读取当前配置文件内容
              const fileContent = await fs.promises.readFile(
                configPath,
                "utf-8"
              );
              // 解析JSON内容
              const picConfig: PicConfig = JSON.parse(fileContent);
              // 限制值
              const limit = picConfig.picLoadLimit;
              return {
                success: true,
                data: {
                  config: returnConfig,
                  picList: verList.slice(0, limit),
                  total: verList.length,
                },
              };
            }
          }
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
};

export default picHandler;

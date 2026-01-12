import { observable, action, runInAction } from "mobx";
import SortApi from "../../api/sort";
import winStore from "./win";
import { generateErrorLog } from "../../utils";
import picStore from "./pic";
import { cloneDeep } from "lodash";

const sortStore = observable(
  {
    // 是否折叠分类控制器
    showControler: true,
    setShowControler(bool: boolean) {
      this.showControler = bool;
    },

    // 分类文件夹列表
    sortFolderList: [] as Array<SortFolderListType>,
    setSortFolderList(list: Array<SortFolderListType>) {
      this.sortFolderList = list;
    },
    // 获取分类文件夹列表
    sortFolderLoading: false,
    setSortFolderLoading(bool: boolean) {
      this.sortFolderLoading = bool;
    },
    async getSortFolderList(noClearList: boolean = false) {
      let funcAction = "获取分类文件夹列表";
      try {
        this.setSortFolderLoading(true);
        let res = await SortApi.getSortFolder();
        if (res.success) {
          runInAction(() => {
            this.setSortFolderConfig({
              folderPath: (res.data as GetSortFolderDataType).folderPath,
              sortType: (res.data as GetSortFolderDataType).sortType,
            });
            this.setSortFolderList((res.data as GetSortFolderDataType).list);

            if ((res.data as GetSortFolderDataType).clearList && !noClearList) {
              // 根据设置来决定是否清空当前选择分类列表
              this.clearSelectingSortList();
            }
          });
          return true;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setSortFolderLoading(false);
      }
    },

    // 未分类文件夹配置
    picFolderConfig: {
      folderPath: "",
      sortType: "nameAsc",
      deep: false,
      selectConfig: {
        name: {
          type: "all",
          value: "",
        },
        size: {
          type: "all",
          value: 0,
        },
        fileType: ["png", "jpg", "gif", "webp"],
        resolution: {
          width: {
            type: "all",
            value: 0,
          },
          height: {
            type: "all",
            value: 0,
          },
        },
        createdAt: {
          type: "all",
          value: 0,
        },
        modifiedAt: {
          type: "all",
          value: 0,
        },
      },
    } as PicFolderConfigType,
    setPicFolderConfig(config: PicFolderConfigType) {
      this.picFolderConfig = config;
    },
    // 总分类文件夹配置
    sortFolderConfig: {
      folderPath: "",
      sortType: "nameAsc",
    } as SortFolderConfigType,
    setSortFolderConfig(config: SortFolderConfigType) {
      this.sortFolderConfig = config;
    },

    // 正在选择的分类组
    selectingSortList: [] as Array<string>,
    setSelectingSortList(name: string) {
      let findIndex = this.selectingSortList.findIndex((item) => item == name);
      if (findIndex == -1) {
        this.selectingSortList.push(name);
      } else {
        this.selectingSortList.splice(findIndex, 1);
      }
    },
    // 全选或者取消全选分类组
    fullSelectingSortList() {
      if (this.selectingSortList.length != this.sortFolderList.length) {
        this.selectingSortList = cloneDeep(
          this.sortFolderList.map((item) => item.name)
        );
      } else {
        this.clearSelectingSortList();
      }
    },
    clearSelectingSortList() {
      this.selectingSortList = [];
    },
    // 上次选择的分类组
    selectedSortList: [] as Array<string>,
    setSelectedSortList(list: Array<string>) {
      this.selectedSortList = list;
    },
    clearSelectedSortList() {
      this.selectedSortList = [];
    },
    applySelected() {
      this.selectingSortList = cloneDeep(this.selectedSortList);
    },

    // 获取未分类文件夹路径
    async getPicFolderPath(defaultPath: string) {
      let funcAction = "获取未分类文件夹路径";
      try {
        let res = await SortApi.getPicFolderPath(defaultPath);
        if (res.success) {
          // 设置未分类文件夹目录
          if (res.data) {
            // 返回给对话框
            return res.data;
          } else {
            return "";
          }
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return "";
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return "";
      }
    },
    // 获取总分类文件夹路径
    async getSortFolderPath(defaultPath: string) {
      let funcAction = "获取总分类文件夹路径";
      try {
        let res = await SortApi.getSortFolderPath(defaultPath);
        if (res.success) {
          // 设置总分类文件夹目录
          if (res.data) {
            // 返回给对话框
            return res.data;
          } else {
            return "";
          }
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return "";
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return "";
      }
    },

    picFolderPathLoading: false,
    setPicFolderPathLoading(bool: boolean) {
      this.picFolderPathLoading = bool;
    },
    sortFolderPathLoading: false,
    setSortFolderPathLoading(bool: boolean) {
      this.sortFolderPathLoading = bool;
    },
    // 设置未分类文件夹路径
    async setPicFolderPath(config: PicFolderConfigType) {
      let funcAction = "设置未分类文件夹路径";
      try {
        this.setPicFolderPathLoading(true);
        let res = await SortApi.setPicFolderPath(config);
        if (res.success) {
          // 设置成功，获取一次图片列表
          let GetRes = await picStore.getPicList(true);
          // 清空当前选择图片列表
          picStore.clearSelectingPicList();
          return GetRes;
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setPicFolderPathLoading(false);
      }
    },
    // 设置总分类文件夹路径
    async setSortFolderPath(config: SortFolderConfigType) {
      let funcAction = "设置总分类文件夹路径";
      try {
        this.setSortFolderPathLoading(true);
        let res = await SortApi.setSortFolderPath(config);
        if (res.success) {
          // 设置成功，获取一次分类列表
          let GetRes = await this.getSortFolderList();
          // 清空当前选择分类列表
          this.clearSelectingSortList();
          this.clearSelectedSortList();
          return GetRes;
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setSortFolderPathLoading(false);
      }
    },

    // 获取文件夹信息
    picFolderInfoLoading: false,
    setPicFolderInfoLoading(bool: boolean) {
      this.picFolderInfoLoading = bool;
    },
    sortFolderInfoLoading: false,
    setSortFolderInfoLoading(bool: boolean) {
      this.sortFolderInfoLoading = bool;
    },
    async getPicFolderInfo() {
      let funcAction = "读取未分类存储文件夹信息";
      try {
        this.setPicFolderInfoLoading(true);
        let res = await SortApi.getPicFolderInfo();
        if (res.success) {
          return res.data as FolderInfoType;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setPicFolderInfoLoading(false);
      }
    },
    async getSortFolderInfo() {
      let funcAction = "读取总分类存储文件夹信息";
      try {
        this.setSortFolderInfoLoading(true);
        let res = await SortApi.getSortFolderInfo();
        if (res.success) {
          return res.data as FolderInfoType;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setSortFolderInfoLoading(false);
      }
    },

    // 打开未分类文件夹
    async openPicFolder() {
      let funcAction = "打开未分类文件夹";
      try {
        let res = await SortApi.openPicFolder();
        if (!res.success) {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
      }
    },
    // 打开总分类文件夹
    async openSortFolder() {
      let funcAction = "打开总分类文件夹";
      try {
        let res = await SortApi.openSortFolder();
        if (!res.success) {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
      }
    },

    // 新增分类文件夹
    insertSortFolderLoading: false,
    setInsertSortFolderLoading(bool: boolean) {
      this.insertSortFolderLoading = bool;
    },
    async insertSortFolder(name: string) {
      let funcAction = "新增分类文件夹";
      try {
        this.setHandleSortItemLoading(true);
        this.setInsertSortFolderLoading(true);
        let res = await SortApi.insertSortFolder(name);
        if (res.success) {
          if (res.conflict) {
            // 冲突
            return {
              success: true,
              conflict: true,
            };
          } else {
            // 无冲突，获取一次列表
            this.getSortFolderList(true);
            return {
              success: true,
              conflict: false,
            };
          }
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return {
            success: false,
            conflict: false,
          };
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          conflict: false,
        };
      } finally {
        this.setHandleSortItemLoading(false);
        this.setInsertSortFolderLoading(false);
      }
    },

    // 删除分类文件夹
    deleteSortFolderLoading: false,
    setDeleteSortFolderLoading(bool: boolean) {
      this.deleteSortFolderLoading = bool;
    },
    async deleteSortFolder(item: boolean = false) {
      let funcAction = "删除分类文件夹";
      try {
        this.setHandleSortItemLoading(true);
        this.setDeleteSortFolderLoading(true);
        let targets = cloneDeep(this.selectingSortList);
        let sortName = cloneDeep(this.currentSortItem);
        if (item) {
          targets = [sortName];
        }
        let res = await SortApi.deleteSortFolder(targets);
        if (res.success) {
          // 删除完成，获取一次列表
          // 清空当前选择分类列表
          runInAction(() => {
            if (item && this.selectingSortList.includes(sortName)) {
              this.setSelectingSortList(sortName);
            }
            if (item && this.selectedSortList.includes(sortName)) {
              let cloneSelectedList = cloneDeep(this.selectedSortList);
              let filterSelectedList = cloneSelectedList.filter(
                (item) => item != sortName
              );
              this.setSelectedSortList(filterSelectedList);
            }
            if (!item) {
              this.clearSelectingSortList();
              this.clearSelectedSortList();
            }
          });
          if (!item) {
            this.getSortFolderList();
          } else {
            this.getSortFolderList(true);
          }
          return true;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setHandleSortItemLoading(false);
        this.setDeleteSortFolderLoading(false);
      }
    },

    // 删除图片
    handlePicLoading: false,
    setHandlePicLoading(bool: boolean) {
      this.handlePicLoading = bool;
    },
    deletePicLoading: false,
    setDeletePicLoading(bool: boolean) {
      this.deletePicLoading = bool;
    },
    async deletePic(cut: boolean = false) {
      let funcAction = "删除图片";
      try {
        if (!cut) {
          this.setHandlePicLoading(true);
          this.setDeletePicLoading(true);
        }

        let res = await SortApi.deletePic(picStore.picList[1]!.path, cut);
        if (res.success) {
          // 看情况跳转下一张还是上一张
          // 默认先跳下一张
          if (picStore.picList[2] !== null) {
            // 可跳下一张
            picStore.getPicList(false, picStore.picList[2].path);
          } else if (picStore.picList[0] !== null) {
            // 可跳上一张
            picStore.getPicList(false, picStore.picList[0].path);
          } else {
            // 皆不可跳
            picStore.getPicList();
          }
          return true;
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        if (!cut) {
          this.setHandlePicLoading(false);
          this.setDeletePicLoading(false);
        }
      }
    },
    async deletePicGroup(
      cut: boolean = false,
      conflict?: boolean,
      cutGroup?: Array<string>
    ) {
      let funcAction = "删除图片组";
      try {
        if (!cut) {
          this.setHandlePicLoading(true);
          this.setDeletePicLoading(true);
        }

        let picPathGroup = picStore.selectingPicList.map(
          (index) => picStore.picList[index]!.path
        );
        if (conflict) {
          picPathGroup = cutGroup!;
        }

        let res = await SortApi.deletePicGroup(picPathGroup, cut);
        if (res.success) {
          // 清除选择列表
          picStore.clearSelectingPicList();
          // 重新获取列表
          picStore.getPicList();
          return true;
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        if (!cut) {
          this.setHandlePicLoading(false);
          this.setDeletePicLoading(false);
        }
      }
    },

    // 复制图片
    copyPicLoading: false,
    setCopyPicLoading(bool: boolean) {
      this.copyPicLoading = bool;
    },
    async copyPic() {
      let funcAction = "复制图片";
      try {
        this.setHandlePicLoading(true);
        this.setCopyPicLoading(true);
        let picPath = picStore.picList[1]!.path;
        let targets = cloneDeep(this.selectingSortList);
        let res = await SortApi.copyPic(picPath, targets, "copy", false);
        if (res.success) {
          this.setSelectedSortList(cloneDeep(this.selectingSortList));
          // 需要检查有没有冲突
          if (!res.conflict) {
            // 无冲突
            // 获取一次分类列表
            this.getSortFolderList();
            return {
              success: true,
              conflictData: [] as Array<CopyPicDataType>,
            };
          } else {
            // 有冲突
            return {
              success: true,
              conflictData: res.data as Array<CopyPicDataType>,
            };
          }
        } else {
          // 报错
          // 获取一次分类列表
          this.getSortFolderList();
          winStore.setErrorDialog(res.data as string, funcAction);
          return {
            success: false,
            conflictData: [] as Array<CopyPicDataType>,
          };
        }
      } catch (error) {
        // 报错
        // 获取一次分类列表
        this.getSortFolderList();
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          conflictData: [] as Array<CopyPicDataType>,
        };
      } finally {
        this.setHandlePicLoading(false);
        this.setCopyPicLoading(false);
      }
    },
    async copyPicGroup() {
      let funcAction = "复制图片组";
      try {
        this.setHandlePicLoading(true);
        this.setCopyPicLoading(true);
        let picPathGroup = picStore.selectingPicList.map(
          (index) => picStore.picList[index]!.path
        );
        let targets = cloneDeep(this.selectingSortList);
        let res = await SortApi.copyPicGroup(
          picPathGroup,
          targets,
          "copy",
          false
        );
        if (res.success) {
          this.setSelectedSortList(cloneDeep(this.selectingSortList));
          this.getSortFolderList();
          // 需要检查有没有冲突
          if (!res.conflict) {
            // 无冲突
            return {
              success: true,
              conflictData: [] as Array<CopyPicDataType>,
            };
          } else {
            // 有冲突
            return {
              success: true,
              conflictData: res.data as Array<CopyPicDataType>,
            };
          }
        } else {
          this.getSortFolderList();
          picStore.getPicList(true);
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return {
            success: false,
            conflictData: [] as Array<CopyPicDataType>,
          };
        }
      } catch (error) {
        // 报错
        this.getSortFolderList();
        picStore.getPicList(true);
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          conflictData: [] as Array<CopyPicDataType>,
        };
      } finally {
        this.setHandlePicLoading(false);
        this.setCopyPicLoading(false);
      }
    },
    cutPicLoading: false,
    setCutPicLoading(bool: boolean) {
      this.cutPicLoading = bool;
    },
    async cutPic() {
      let funcAction = "剪切图片";
      try {
        this.setHandlePicLoading(true);
        this.setCutPicLoading(true);
        let picPath = picStore.picList[1]!.path;
        let targets = cloneDeep(this.selectingSortList);
        let res = await SortApi.copyPic(picPath, targets, "cut", false);
        if (res.success) {
          this.setSelectedSortList(cloneDeep(this.selectingSortList));
          // 需要检查有没有冲突
          if (!res.conflict) {
            // 无冲突
            this.getSortFolderList();
            await this.deletePic(true);
            return {
              success: true,
              conflictData: [] as Array<CopyPicDataType>,
            };
          } else {
            // 有冲突
            return {
              success: true,
              conflictData: res.data as Array<CopyPicDataType>,
            };
          }
        } else {
          // 报错
          this.getSortFolderList();
          winStore.setErrorDialog(res.data as string, funcAction);
          return {
            success: false,
            conflictData: [] as Array<CopyPicDataType>,
          };
        }
      } catch (error) {
        // 报错
        this.getSortFolderList();
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          conflictData: [] as Array<CopyPicDataType>,
        };
      } finally {
        this.setHandlePicLoading(false);
        this.setCutPicLoading(false);
      }
    },
    async cutPicGroup() {
      let funcAction = "剪切图片组";
      try {
        this.setHandlePicLoading(true);
        this.setCutPicLoading(true);
        let picPathGroup = picStore.selectingPicList.map(
          (index) => picStore.picList[index]!.path
        );
        let targets = cloneDeep(this.selectingSortList);
        let res = await SortApi.copyPicGroup(
          picPathGroup,
          targets,
          "cut",
          false
        );
        if (res.success) {
          this.setSelectedSortList(cloneDeep(this.selectingSortList));
          this.getSortFolderList();
          // 需要检查有没有冲突
          if (!res.conflict) {
            // 无冲突
            await this.deletePicGroup(true);
            return {
              success: true,
              conflictData: [] as Array<CopyPicDataType>,
            };
          } else {
            // 有冲突
            // 过滤出需要删除的图片
            let mapConflictData = (res.data as Array<CopyPicDataType>).map(
              (item) => item.picPath
            );
            let filterGroup = picPathGroup.filter(
              (item) => !mapConflictData.includes(item)
            );
            await this.deletePicGroup(true, true, filterGroup);
            return {
              success: true,
              conflictData: res.data as Array<CopyPicDataType>,
            };
          }
        } else {
          this.getSortFolderList();
          picStore.getPicList(true);
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return {
            success: false,
            conflictData: [] as Array<CopyPicDataType>,
          };
        }
      } catch (error) {
        // 报错
        this.getSortFolderList();
        picStore.getPicList(true);
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          conflictData: [] as Array<CopyPicDataType>,
        };
      } finally {
        this.setHandlePicLoading(false);
        this.setCutPicLoading(false);
      }
    },
    async replacePic(target: CopyPicDataType) {
      let funcAction = "替换图片";
      try {
        this.setHandlePicLoading(true);
        let action = target.action;
        let picPath = target.picPath;
        let sortTarget = target.sortName;
        let res = await SortApi.copyPic(picPath, [sortTarget], action, true);
        if (res.success) {
          if (action == "cut") {
            if (picStore.viewMode == "view") {
              // 单个
              await this.deletePic(true);
            } else {
              await this.deletePicGroup(true, true, [picPath]);
            }
          }
          return true;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setHandlePicLoading(false);
      }
    },

    // 分类项设置
    sortItemSettingShow: false,
    currentSortItem: "",
    currentTop: false,
    showSortItemSetting(sortItem: SortFolderListType) {
      runInAction(() => {
        this.currentSortItem = sortItem.name;
        this.currentTop = sortItem.top;
        this.sortItemSettingShow = true;
      });
    },
    hideSortItemSetting() {
      this.sortItemSettingShow = false;
    },
    handleSortItemLoading: false,
    setHandleSortItemLoading(bool: boolean) {
      this.handleSortItemLoading = bool;
    },

    // 打开分类项所在目录
    async openSortItemFolder() {
      let funcAction = "打开分类项文件夹";
      try {
        let res = await SortApi.openSortItemFolder(this.currentSortItem);
        if (!res.success) {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
      }
    },

    // 获取分类项信息
    sortItemFolderInfoLoading: false,
    setSortItemFolderInfoLoading(bool: boolean) {
      this.sortItemFolderInfoLoading = bool;
    },
    async getSortItemFolderInfo() {
      let funcAction = "读取分类项文件夹信息";
      try {
        this.setSortItemFolderInfoLoading(true);
        let res = await SortApi.getSortItemFolderInfo(this.currentSortItem);
        if (res.success) {
          return res.data as FolderInfoType;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setSortItemFolderInfoLoading(false);
      }
    },

    // 设置分类项置顶
    topListLoading: false,
    setTopListLoading(bool: boolean) {
      this.topListLoading = bool;
    },
    async setTopList() {
      let funcAction = "设置分类项置顶";
      try {
        this.setHandleSortItemLoading(true);
        this.setTopListLoading(true);
        let setType: "insert" | "delete" = "insert";
        if (this.currentTop) {
          setType = "delete";
        }
        let res = await SortApi.setTopList(this.currentSortItem, setType);
        if (res.success) {
          // 设置成功，重新获取列表
          await this.getSortFolderList(true);
          winStore.setMessage({
            type: "success",
            msg: "设置成功",
          });
          return true;
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return false;
      } finally {
        this.setHandleSortItemLoading(false);
        this.setTopListLoading(false);
      }
    },

    // 重命名分类项
    renameSortItemLoading: false,
    setRenameSortItemLoading(bool: boolean) {
      this.renameSortItemLoading = bool;
    },
    async renameSortItem(newName: string) {
      let funcAction = "重命名分类文件夹";
      try {
        this.setHandleSortItemLoading(true);
        this.setRenameSortItemLoading(true);
        // 防止被修改指向
        let oldName = cloneDeep(this.currentSortItem);
        let res = await SortApi.renameSortItem(oldName, newName);
        if (res.success) {
          if (res.conflict) {
            return {
              success: true,
              conflict: true,
            };
          } else {
            // 修改当前选中列表以及上次选中列表
            runInAction(() => {
              if (this.selectingSortList.includes(oldName)) {
                this.setSelectingSortList(oldName);
                this.setSelectingSortList(newName);
              }
              let findIndex = this.selectedSortList.findIndex(
                (item) => item == oldName
              );
              if (findIndex != -1) {
                let cloneSelectedList = cloneDeep(this.selectedSortList);
                cloneSelectedList[findIndex] = newName;
                this.setSelectedSortList(cloneSelectedList);
              }
            });

            // 获取一次列表
            this.getSortFolderList(true);
            return {
              success: true,
              conflict: false,
            };
          }
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return {
            success: false,
            conflict: false,
          };
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          conflict: false,
        };
      } finally {
        this.setHandleSortItemLoading(false);
        this.setRenameSortItemLoading(false);
      }
    },
  },
  {
    setShowControler: action,
    setPicFolderConfig: action,
    setSortFolderList: action,
    setSortFolderLoading: action,
    getSortFolderList: action,
    setSortFolderConfig: action,
    setSelectingSortList: action,
    clearSelectingSortList: action,
    fullSelectingSortList: action,
    setSelectedSortList: action,
    clearSelectedSortList: action,
    applySelected: action,
    getPicFolderPath: action,
    getSortFolderPath: action,
    setPicFolderPathLoading: action,
    setSortFolderPathLoading: action,
    setPicFolderPath: action,
    setSortFolderPath: action,
    setPicFolderInfoLoading: action,
    setSortFolderInfoLoading: action,
    getPicFolderInfo: action,
    getSortFolderInfo: action,
    openPicFolder: action,
    openSortFolder: action,
    setInsertSortFolderLoading: action,
    insertSortFolder: action,
    setDeleteSortFolderLoading: action,
    deleteSortFolder: action,
    setHandlePicLoading: action,
    setDeletePicLoading: action,
    deletePic: action,
    deletePicGroup: action,
    setCopyPicLoading: action,
    copyPic: action,
    copyPicGroup: action,
    setCutPicLoading: action,
    cutPic: action,
    cutPicGroup: action,
    replacePic: action,
    showSortItemSetting: action,
    hideSortItemSetting: action,
    openSortItemFolder: action,
    setSortItemFolderInfoLoading: action,
    getSortItemFolderInfo: action,
    setTopListLoading: action,
    setTopList: action,
    setRenameSortItemLoading: action,
    renameSortItem: action,
    setHandleSortItemLoading: action,
  }
);

export default sortStore;

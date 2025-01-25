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
    async getSortFolderList() {
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

            if ((res.data as GetSortFolderDataType).clearList) {
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
            this.getSortFolderList();
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
        this.setInsertSortFolderLoading(false);
      }
    },

    // 删除分类文件夹
    deleteSortFolderLoading: false,
    setDeleteSortFolderLoading(bool: boolean) {
      this.deleteSortFolderLoading = bool;
    },
    async deleteSortFolder() {
      let funcAction = "删除分类文件夹";
      try {
        this.setDeleteSortFolderLoading(true);
        let res = await SortApi.deleteSortFolder(
          cloneDeep(this.selectingSortList)
        );
        if (res.success) {
          // 删除完成，获取一次列表
          // 清空当前选择分类列表
          this.clearSelectingSortList();
          this.clearSelectedSortList();
          this.getSortFolderList();
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
        this.setDeleteSortFolderLoading(false);
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
  }
);

export default sortStore;

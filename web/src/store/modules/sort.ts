import { observable, action, runInAction } from "mobx";
import SortApi from "../../api/sort";
import winStore from "./win";
import { generateErrorLog } from "../../utils";

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

    // 总分类文件夹配置
    sortFolderConfig: {
      folderPath: "",
      sortType: "nameAsc",
    } as SortConfigType,
    setSortFolderConfig(config: SortConfigType) {
      this.sortFolderConfig = config;
      // 获取一次总分类文件夹信息
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
    sortFolderPathLoading: false,
    setSortFolderPathLoading(bool: boolean) {
      this.sortFolderPathLoading = bool;
    },
    // 设置总分类文件夹路径
    async setSortFolderPath(config: SortConfigType) {
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
  },
  {
    setShowControler: action,
    setSortFolderList: action,
    setSortFolderLoading: action,
    getSortFolderList: action,
    setSortFolderConfig: action,
    setSelectingSortList: action,
    clearSelectingSortList: action,
    setSelectedSortList: action,
    clearSelectedSortList: action,
    getSortFolderPath: action,
    setSortFolderPathLoading: action,
    setSortFolderPath: action,
    openSortFolder: action,
  }
);

export default sortStore;

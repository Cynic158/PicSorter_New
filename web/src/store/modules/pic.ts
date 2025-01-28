import { observable, action, runInAction } from "mobx";
import winStore from "./win";
import { generateErrorLog } from "../../utils";
import PicApi from "../../api/pic";
import sortStore from "./sort";
import { cloneDeep } from "lodash";
import { picStaticPath, sortStaticPath } from "../../utils/config";

const picStore = observable(
  {
    getPicUrl(picPath: string, folder: "pic" | "sort") {
      let picUrl = "";
      if (folder == "pic") {
        let rootPath = sortStore.picFolderConfig.folderPath;
        picUrl = picStaticPath + picPath.replace(rootPath, "");
      } else {
        let rootPath = sortStore.sortFolderConfig.folderPath;
        picUrl = sortStaticPath + picPath.replace(rootPath, "");
      }
      picUrl = picUrl.replace(/\\/g, "/");
      return picUrl;
    },
    viewMode: "view" as viewType,
    setViewMode(mode: viewType) {
      this.viewMode = mode;
      this.clearSelectingPicList();
    },
    picTotal: 0,
    setPicTotal(total: number) {
      this.picTotal = total;
    },
    // 图片列表
    picList: [null, null, null] as Array<PicInfo>,
    setPicList(list: Array<PicInfo>) {
      this.picList = list;
    },
    // 获取图片列表
    picListLoading: false,
    setPicListLoading(bool: boolean) {
      this.picListLoading = bool;
    },
    async getPicList(
      refresh: boolean = false,
      currentPicPath?: string | null,
      preload?: viewType
    ) {
      let funcAction = "获取图片组";
      try {
        this.setPicListLoading(true);
        let mode = this.viewMode;
        if (preload) {
          mode = preload;
        }
        let res = await PicApi.getPicList(mode, refresh, currentPicPath);
        if (res.success) {
          runInAction(() => {
            if (preload) {
              this.setViewMode(preload);
            }
            this.setPicTotal((res.data as GetPicListDataType).total);
            this.setPicList((res.data as GetPicListDataType).picList);
            if (refresh) {
              sortStore.setPicFolderConfig(
                (res.data as GetPicListDataType).config
              );
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
        this.setPicListLoading(false);
      }
    },

    // 图片重命名
    renamePicLoading: false,
    setRenamePicLoading(bool: boolean) {
      this.renamePicLoading = bool;
    },
    async renamePic(newName: string) {
      let funcAction = "重命名图片";
      try {
        this.setRenamePicLoading(true);
        let res = await PicApi.renamePic(this.picList[1]!.path, newName);
        if (res.success) {
          // 看看有没有冲突
          if (res.conflict) {
            // 冲突了
            return {
              success: true,
              conflict: true,
              conflictData: res.data as ConflictDataType,
            };
          } else {
            // 无冲突，执行完成
            let cloneList = cloneDeep(this.picList);
            cloneList[1] = res.data as PicInfo;
            this.setPicList(cloneList);
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
        this.setRenamePicLoading(false);
      }
    },

    // 获取图片详细信息
    getPicInfoLoading: false,
    setGetPicInfoLoading(bool: boolean) {
      this.getPicInfoLoading = bool;
    },
    async getPicInfo(picIndex: number) {
      if (
        this.picList[picIndex]?.dpi === undefined ||
        this.picList[picIndex].dpi === null ||
        this.picList[picIndex].bitDepth === undefined ||
        this.picList[picIndex].bitDepth === null
      ) {
        let funcAction = "获取图片dpi和位深度";
        const resetList = (dpi: number, bitDepth: number) => {
          let cloneList = cloneDeep(this.picList);
          cloneList[picIndex]!.dpi = dpi;
          cloneList[picIndex]!.bitDepth = bitDepth;
          this.setPicList(cloneList);
        };
        try {
          this.setGetPicInfoLoading(true);
          let res = await PicApi.getPicInfo(this.picList[picIndex]!.path);
          if (res.success) {
            resetList(
              (res.data as PicInfoDataType).dpi,
              (res.data as PicInfoDataType).bitDepth
            );
            return true;
          } else {
            // 报错
            winStore.setErrorDialog(res.data as string, funcAction);
            resetList(-1, -1);
            return false;
          }
        } catch (error) {
          // 报错
          let log = generateErrorLog(error);
          winStore.setErrorDialog(log, funcAction);
          resetList(-1, -1);
          return false;
        } finally {
          this.setGetPicInfoLoading(false);
        }
      }
    },

    // 打开图片所在位置
    async showPic(picIndex: number) {
      let funcAction = "打开图片所在位置";
      try {
        let res = await PicApi.showPic(this.picList[picIndex]!.path);
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

    selectingPicList: [] as Array<number>,
    setSelectingPicList(index: number) {
      let findIndex = this.selectingPicList.findIndex((item) => item == index);
      if (findIndex == -1) {
        this.selectingPicList.push(index);
      } else {
        this.selectingPicList.splice(findIndex, 1);
      }
    },
    clearSelectingPicList() {
      this.selectingPicList = [];
    },
  },
  {
    getPicUrl: action,
    setViewMode: action,
    setPicTotal: action,
    setPicList: action,
    setPicListLoading: action,
    getPicList: action,
    setRenamePicLoading: action,
    renamePic: action,
    setGetPicInfoLoading: action,
    getPicInfo: action,
    showPic: action,
    setSelectingPicList: action,
    clearSelectingPicList: action,
  }
);

export default picStore;

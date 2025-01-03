import { observable, action, runInAction } from "mobx";
import winStore from "./win";
import { generateErrorLog } from "../../utils";
import PicApi from "../../api/pic";
import sortStore from "./sort";

const picStore = observable(
  {
    viewMode: "view" as viewType,
    setViewMode(mode: viewType) {
      this.viewMode = mode;
    },
    picTotal: 0,
    setPicTotal(total: number) {
      this.picTotal = total;
    },
    // 图片列表
    picList: [] as Array<PicInfo>,
    setPicList(list: Array<PicInfo>) {
      this.picList = list;
    },
    // 获取图片列表
    picListLoading: false,
    setPicListLoading(bool: boolean) {
      this.picListLoading = bool;
    },
    async getPicList(refresh: boolean = false, currentPic?: string) {
      let funcAction = "获取图片队列";
      try {
        this.setPicListLoading(true);
        let mode = this.viewMode;
        let res = await PicApi.getPicList(mode, refresh, currentPic);
        if (res.success) {
          runInAction(() => {
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

    selectingPicList: [],
    setSelectingPicList() {},
    clearSelectingPicList() {
      this.selectingPicList = [];
    },
  },
  {
    setViewMode: action,
    setPicTotal: action,
    setPicList: action,
    setPicListLoading: action,
    getPicList: action,
    setSelectingPicList: action,
    clearSelectingPicList: action,
  }
);

export default picStore;

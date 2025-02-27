import { observable, action } from "mobx";
import { generateErrorLog } from "../../utils";
import picStore from "./pic";
import sortStore from "./sort";
import winStore from "./win";
import ToolApi from "../../api/tool";

const toolStore = observable(
  {
    // 刷新图库和分类
    async refreshAll() {
      if (
        !picStore.picListLoading &&
        !sortStore.sortFolderLoading &&
        !sortStore.handleSortItemLoading &&
        !sortStore.handlePicLoading
      ) {
        let funcAction = "刷新图库和分类";
        try {
          sortStore.setHandlePicLoading(true);
          picStore.clearSelectingPicList();
          sortStore.clearSelectingSortList();
          sortStore.clearSelectedSortList();
          let res = await Promise.all([
            picStore.getPicList(true),
            sortStore.getSortFolderList(),
          ]);
          if (res[0] && res[1]) {
            winStore.setMessage({
              type: "success",
              msg: "刷新图库和分类成功",
            });
          }
        } catch (error) {
          // 报错
          let log = generateErrorLog(error);
          winStore.setErrorDialog(log, funcAction);
        } finally {
          sortStore.setHandlePicLoading(false);
        }
      }
    },

    // 使用系统自带预览器打开
    adjustPicLoading: false,
    setAdjustPicLoading(bool: boolean) {
      this.adjustPicLoading = bool;
    },
    async adjustPic(picPath: string) {
      let funcAction = "打开图片";
      try {
        this.setAdjustPicLoading(true);
        winStore.setMessage({
          type: "success",
          msg: "正在使用系统默认预览器打开图片",
        });
        let res = await ToolApi.adjustPic(picPath);
        if (!res.success) {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
      } finally {
        this.setAdjustPicLoading(false);
      }
    },
  },
  {
    refreshAll: action,
    setAdjustPicLoading: action,
    adjustPic: action,
  }
);

export default toolStore;

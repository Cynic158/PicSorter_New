import { observable, action } from "mobx";
import { generateErrorLog } from "../../utils";
import picStore from "./pic";
import sortStore from "./sort";
import winStore from "./win";

const toolStore = observable(
  {
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
  },
  {
    refreshAll: action,
  }
);

export default toolStore;

import { observable, action } from "mobx";
import { generateErrorLog } from "../../utils";
import SettingApi from "../../api/setting";
import winStore from "./win";
import { cloneDeep } from "lodash";
import sortStore from "./sort";

const settingStore = observable(
  {
    // 获取自动重命名配置
    getAutoConfigLoading: false,
    setGetAutoConfigLoading(bool: boolean) {
      this.getAutoConfigLoading = bool;
    },
    async getAutoConfig() {
      let funcAction = "获取指定自动重命名配置";
      try {
        this.setGetAutoConfigLoading(true);
        let sortName = cloneDeep(sortStore.currentSortItem);
        let res = await SettingApi.getAutoConfig(sortName);
        if (res.success) {
          if (res.data) {
            return {
              success: true,
              data: res.data as AutoRenameConfig,
            };
          } else {
            return {
              success: true,
              data: "",
            };
          }
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return {
            success: false,
            data: "",
          };
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          data: "",
        };
      } finally {
        this.setGetAutoConfigLoading(false);
      }
    },
    // 设置自动重命名配置
    setAutoConfigLoading: false,
    setSetAutoConfigLoading(bool: boolean) {
      this.setAutoConfigLoading = bool;
    },
    async setAutoConfig(autoConfig: AutoRenameConfig) {
      let funcAction = "设置指定自动重命名配置";
      try {
        this.setSetAutoConfigLoading(true);
        let cloneConfig = cloneDeep(autoConfig);
        let res = await SettingApi.setAutoConfig(cloneConfig);
        if (res.success) {
          // 重新获取一次列表
          sortStore.getSortFolderList(true);
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
        this.setSetAutoConfigLoading(false);
      }
    },
  },
  {
    setGetAutoConfigLoading: action,
    getAutoConfig: action,
    setSetAutoConfigLoading: action,
    setAutoConfig: action,
  }
);

export default settingStore;

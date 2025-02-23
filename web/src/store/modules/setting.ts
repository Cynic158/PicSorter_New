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

    // 处理设置加载
    handleSettingLoading: false,
    setHandleSettingLoading(bool: boolean) {
      this.handleSettingLoading = bool;
    },
    // 获取通用设置
    async getDefaultSetting() {
      let funcAction = "读取通用设置";
      try {
        this.setHandleSettingLoading(true);
        let res = await SettingApi.getDefaultSetting();
        if (res.success) {
          return res.data as GetDefaultSettingDataType;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return {
            clearList: true,
            picLoadLimit: "",
            configPath: "",
          };
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          clearList: true,
          picLoadLimit: "",
          configPath: "",
        };
      } finally {
        this.setHandleSettingLoading(false);
      }
    },
    // 设置通用设置
    async setDefaultSetting(clearList: boolean, picLoadLimit: string) {
      let picLoadLimitVal = picLoadLimit.trim();
      if (picLoadLimitVal == "") {
        winStore.setMessage({
          type: "error",
          msg: "加载图片上限不能为空",
        });
        return false;
      } else if (!/^[0-9]+$/.test(picLoadLimitVal)) {
        winStore.setMessage({
          type: "error",
          msg: "加载图片上限必须为数值",
        });
        return false;
      } else {
        let numVal = Number(picLoadLimitVal);
        if (numVal < 50 || numVal > 500) {
          winStore.setMessage({
            type: "error",
            msg: "加载图片上限应在50到500之间",
          });
          return false;
        }
      }
      let funcAction = "更新通用设置";
      try {
        this.setHandleSettingLoading(true);
        let res = await SettingApi.setDefaultSetting(
          clearList,
          Number(picLoadLimitVal)
        );
        if (res.success) {
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
        this.setHandleSettingLoading(false);
      }
    },

    // 打开配置文件目录
    async openConfigFolder() {
      let funcAction = "打开配置文件目录";
      try {
        let res = await SettingApi.openConfigFolder();
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

    // 获取置顶列表
    async getTopList() {
      let funcAction = "读取置顶列表";
      try {
        this.setHandleSettingLoading(true);
        let res = await SettingApi.getTopList();
        if (res.success) {
          return res.data as Array<string>;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return [] as Array<string>;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return [] as Array<string>;
      } finally {
        this.setHandleSettingLoading(false);
      }
    },

    // 设置置顶列表
    async setTopList(topList: Array<string>) {
      let funcAction = "设置置顶列表";
      try {
        this.setHandleSettingLoading(true);
        let res = await SettingApi.setTopList(topList);
        if (res.success) {
          let GetRes = await this.getTopList();
          return {
            success: true,
            topList: GetRes,
          };
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return {
            success: false,
            topList: [],
          };
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          topList: [],
        };
      } finally {
        this.setHandleSettingLoading(false);
      }
    },

    // 获取自动重命名配置列表
    async getAutoConfigList() {
      let funcAction = "读取自动重命名配置列表";
      try {
        this.setHandleSettingLoading(true);
        let res = await SettingApi.getAutoConfigList();
        if (res.success) {
          return res.data as Array<string>;
        } else {
          // 报错
          winStore.setErrorDialog(res.data as string, funcAction);
          return [] as Array<string>;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return [] as Array<string>;
      } finally {
        this.setHandleSettingLoading(false);
      }
    },

    // 设置自动重命名配置列表
    async setAutoConfigList(autoList: Array<string>) {
      let funcAction = "设置自动重命名配置列表";
      try {
        this.setHandleSettingLoading(true);
        let res = await SettingApi.setAutoConfigList(autoList);
        if (res.success) {
          let GetRes = await this.getAutoConfigList();
          return {
            success: true,
            autoList: GetRes,
          };
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          return {
            success: false,
            autoList: [],
          };
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        return {
          success: false,
          autoList: [],
        };
      } finally {
        this.setHandleSettingLoading(false);
      }
    },

    // 打开指定文件夹
    async openFolder(folderPath: string) {
      let funcAction = "打开指定文件夹";
      try {
        let res = await SettingApi.openFolder(folderPath);
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

    // 获取图片处理数
    async getHandlePicCount() {
      let funcAction = "读取已处理图片数记录";
      try {
        this.setHandleSettingLoading(true);
        let res = await SettingApi.getHandlePicCount();
        if (res.success) {
          return res.data;
        } else {
          // 报错
          winStore.setErrorDialog(res.data, funcAction);
          let count = "--";
          return count;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        winStore.setErrorDialog(log, funcAction);
        let count = "--";
        return count;
      } finally {
        this.setHandleSettingLoading(false);
      }
    },
  },
  {
    setGetAutoConfigLoading: action,
    getAutoConfig: action,
    setSetAutoConfigLoading: action,
    setAutoConfig: action,
    setHandleSettingLoading: action,
    getDefaultSetting: action,
    setDefaultSetting: action,
    openConfigFolder: action,
    getTopList: action,
    setTopList: action,
    getAutoConfigList: action,
    setAutoConfigList: action,
    openFolder: action,
    getHandlePicCount: action,
  }
);

export default settingStore;

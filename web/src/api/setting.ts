const SettingApi = {
  getAutoConfig: window.DeskApi?.Setting_getAutoConfig,
  setAutoConfig: window.DeskApi?.Setting_setAutoConfig,
  getDefaultSetting: window.DeskApi?.Setting_getDefaultSetting,
  setDefaultSetting: window.DeskApi?.Setting_setDefaultSetting,
  openConfigFolder: window.DeskApi?.Setting_openConfigFolder,
  getTopList: window.DeskApi?.Setting_getTopList,
  setTopList: window.DeskApi?.Setting_setTopList,
  getAutoConfigList: window.DeskApi?.Setting_getAutoConfigList,
  setAutoConfigList: window.DeskApi?.Setting_setAutoConfigList,
  openFolder: window.DeskApi?.Setting_openFolder,
  getHandlePicCount: window.DeskApi?.Setting_getHandlePicCount,
};

export default SettingApi;

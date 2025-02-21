const SettingApi = {
  getAutoConfig: window.DeskApi?.Setting_getAutoConfig,
  setAutoConfig: window.DeskApi?.Setting_setAutoConfig,
  getDefaultSetting: window.DeskApi?.Setting_getDefaultSetting,
  setDefaultSetting: window.DeskApi?.Setting_setDefaultSetting,
  openConfigFolder: window.DeskApi?.Setting_openConfigFolder,
  getHandlePicCount: window.DeskApi?.Setting_getHandlePicCount,
};

export default SettingApi;

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import SvgIcon from "../../components/SvgIcon";
import Switcher from "../../components/Switcher";
import Inputer from "../../components/Inputer";
import TextOverflow from "react-text-overflow";
import Loader from "../../components/Loader";
import "../../styles/dialog/settingdialog.scss";
import qq_0 from "../../assets/images/qq_0.jpg";
import qq_1 from "../../assets/images/qq_1.jpg";
import bilibili from "../../assets/images/bilibili.jpg";
import qrcode from "../../assets/images/qrcode.png";
import winStore from "../../store/modules/win";
import settingStore from "../../store/modules/setting";
import { cloneDeep } from "lodash";

interface SettingDialogProps {
  show: boolean;
  hide: () => void;
}

const SettingDialog: React.FC<SettingDialogProps> = ({ show, hide }) => {
  const closeDialog = () => {
    if (!settingStore.handleSettingLoading) {
      hide();
    }
  };
  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".settingdialog-container");
    if (event.target == el) {
      closeDialog();
    }
  };

  const [activeIndex, setActiveIndex] = useState(0);

  // 通用设置
  const [clearList, setClearList] = useState(true);
  const [picLoadLimit, setPicLoadLimit] = useState("100");
  const [showStartup, setShowStartup] = useState(false);
  const [configPath, setConfigPath] = useState("");
  // 置顶配置
  const [topList, setTopList] = useState<Array<string>>([]);
  // 自动重命名配置
  const [autoConfigList, setAutoConfigList] = useState<Array<string>>([]);

  const getDefaultSetting = async () => {
    let res = await settingStore.getDefaultSetting();
    setClearList(res.clearList);
    setPicLoadLimit(res.picLoadLimit);
    setConfigPath(res.configPath);
    setShowStartup(res.showStartup);
  };
  const setDefaultSetting = async () => {
    if (!settingStore.handleSettingLoading) {
      let res = await settingStore.setDefaultSetting(
        clearList,
        picLoadLimit,
        showStartup
      );
      if (res) {
        winStore.setMessage({
          type: "success",
          msg: "设置成功",
        });
      }
    }
  };
  useEffect(() => {
    if (show) {
      settingStore.setAllowShortcut(false);
      setActiveIndex(0);
      getDefaultSetting();
    } else {
      settingStore.setAllowShortcut(true);
    }

    return () => {};
  }, [show]);

  const getTopList = async () => {
    let res = await settingStore.getTopList();
    setTopList(res);
  };
  const deleteTopList = (sortPath: string) => {
    if (!settingStore.handleSettingLoading) {
      let filterList = topList.filter((item) => item != sortPath);
      setTopList(filterList);
    }
  };
  const clearTopList = () => {
    if (!settingStore.handleSettingLoading) {
      setTopList([]);
    }
  };
  const applyTopList = async () => {
    if (!settingStore.handleSettingLoading) {
      let res = await settingStore.setTopList(topList);
      if (res.success) {
        setTopList(res.topList);
        winStore.setMessage({
          type: "success",
          msg: "设置成功",
        });
      }
    }
  };

  const getAutoList = async () => {
    let res = await settingStore.getAutoConfigList();
    setAutoConfigList(res);
  };
  const deleteAutoList = (sortPath: string) => {
    if (!settingStore.handleSettingLoading) {
      let filterList = autoConfigList.filter((item) => item != sortPath);
      setAutoConfigList(filterList);
    }
  };
  const clearAutoList = () => {
    if (!settingStore.handleSettingLoading) {
      setAutoConfigList([]);
    }
  };
  const applyAutoList = async () => {
    if (!settingStore.handleSettingLoading) {
      let res = await settingStore.setAutoConfigList(autoConfigList);
      if (res.success) {
        setAutoConfigList(res.autoList);
        winStore.setMessage({
          type: "success",
          msg: "设置成功",
        });
      }
    }
  };

  const openFolder = (folderPath: string) => {
    if (!settingStore.handleSettingLoading) {
      settingStore.openFolder(folderPath);
    }
  };

  // 复制群号
  const copyContent = async (content: string) => {
    let res = await winStore.copyContent(content);
    if (res) {
      winStore.setMessage({
        type: "success",
        msg: "复制成功",
      });
    }
  };

  const [handlePicCount, setHandlePicCount] = useState("--");
  const [qrcodeShow, setQrcodeShow] = useState(false);
  const getHandlePicCount = async () => {
    let res = await settingStore.getHandlePicCount();
    setHandlePicCount(res);
  };

  // 快捷键部分
  interface keyType {
    value: string;
    enable: boolean;
  }
  const [shortcutKeys, setShortcutKeys] = useState<Array<keyType>>([
    {
      value: "X",
      enable: false,
    },
    {
      value: "C",
      enable: false,
    },
    {
      value: "D",
      enable: false,
    },
    {
      value: "Ctrl + A",
      enable: false,
    },
    {
      value: "Shift + A",
      enable: false,
    },
  ]);
  const switchShortcutKeysEnable = (index: number) => {
    let cloneShortcutKeys = cloneDeep(shortcutKeys);
    cloneShortcutKeys[index].enable = !cloneShortcutKeys[index].enable;
    setShortcutKeys(cloneShortcutKeys);
  };
  const [sortShortcutKeysAEnable, setSortShortcutKeysAEnable] = useState(false);
  const sortShortcutKeysA = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const [sortShortcutKeysBEnable, setSortShortcutKeysBEnable] = useState(false);
  const sortShortcutKeysB = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];

  const getShortcut = () => {
    let cloneShortcuts = cloneDeep(settingStore.shortcuts);
    setShortcutKeys([
      {
        value: "X",
        enable: cloneShortcuts[0],
      },
      {
        value: "C",
        enable: cloneShortcuts[1],
      },
      {
        value: "D",
        enable: cloneShortcuts[2],
      },
      {
        value: "Ctrl + A",
        enable: cloneShortcuts[3],
      },
      {
        value: "Shift + A",
        enable: cloneShortcuts[4],
      },
    ]);
    setSortShortcutKeysAEnable(cloneShortcuts[5]);
    setSortShortcutKeysBEnable(cloneShortcuts[6]);
  };

  const setShortcut = async () => {
    if (!settingStore.handleSettingLoading) {
      let mapBools = shortcutKeys.map((item) => item.enable);
      let shortcuts = [
        ...mapBools,
        sortShortcutKeysAEnable,
        sortShortcutKeysBEnable,
      ];
      let res = await settingStore.setShortcut(shortcuts);
      if (res) {
        winStore.setMessage({
          type: "success",
          msg: "设置成功",
        });
      }
    }
  };

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`settingdialog-container${show ? " show" : ""}`}
        >
          <div className="settingdialog-main">
            <p className="settingdialog-title">设置</p>
            <div className="settingdialog-form">
              <div className="settingdialog-nav-container">
                <div
                  onClick={() => {
                    if (
                      !settingStore.handleSettingLoading &&
                      activeIndex != 0
                    ) {
                      setActiveIndex(0);
                      getDefaultSetting();
                    }
                  }}
                  className={`settingdialog-nav-item${
                    activeIndex == 0 ? " active" : ""
                  }`}
                >
                  <SvgIcon
                    svgName="setting"
                    svgSize="20px"
                    color="var(--color-white2)"
                    clickable={true}
                  ></SvgIcon>
                  <span>通用设置</span>
                </div>
                <div
                  onClick={() => {
                    if (
                      !settingStore.handleSettingLoading &&
                      activeIndex != 1
                    ) {
                      setActiveIndex(1);
                      getTopList();
                    }
                  }}
                  className={`settingdialog-nav-item${
                    activeIndex == 1 ? " active" : ""
                  }`}
                >
                  <SvgIcon
                    svgName="top"
                    svgSize="20px"
                    color="var(--color-white2)"
                    clickable={true}
                  ></SvgIcon>
                  <span>置顶配置</span>
                </div>
                <div
                  onClick={() => {
                    if (
                      !settingStore.handleSettingLoading &&
                      activeIndex != 2
                    ) {
                      setActiveIndex(2);
                      getAutoList();
                    }
                  }}
                  className={`settingdialog-nav-item${
                    activeIndex == 2 ? " active" : ""
                  }`}
                >
                  <SvgIcon
                    svgName="auto"
                    svgSize="20px"
                    color="var(--color-white2)"
                    clickable={true}
                  ></SvgIcon>
                  <span>自动配置</span>
                </div>
                <div
                  onClick={() => {
                    if (
                      !settingStore.handleSettingLoading &&
                      activeIndex != 3
                    ) {
                      setActiveIndex(3);
                      getShortcut();
                    }
                  }}
                  className={`settingdialog-nav-item${
                    activeIndex == 3 ? " active" : ""
                  }`}
                >
                  <SvgIcon
                    svgName="shortcut"
                    svgSize="20px"
                    color="var(--color-white2)"
                    clickable={true}
                  ></SvgIcon>
                  <span>快捷键</span>
                </div>
                <div
                  onClick={() => {
                    if (
                      !settingStore.handleSettingLoading &&
                      activeIndex != 4
                    ) {
                      setActiveIndex(4);
                    }
                  }}
                  className={`settingdialog-nav-item${
                    activeIndex == 4 ? " active" : ""
                  }`}
                >
                  <SvgIcon
                    svgName="help"
                    svgSize="20px"
                    color="var(--color-white2)"
                    clickable={true}
                  ></SvgIcon>
                  <span>帮助</span>
                </div>
                <div
                  onClick={() => {
                    if (
                      !settingStore.handleSettingLoading &&
                      activeIndex != 5
                    ) {
                      setActiveIndex(5);
                      getHandlePicCount();
                    }
                  }}
                  className={`settingdialog-nav-item${
                    activeIndex == 5 ? " active" : ""
                  }`}
                >
                  <SvgIcon
                    svgName="support"
                    svgSize="20px"
                    color="var(--color-white2)"
                    clickable={true}
                  ></SvgIcon>
                  <span>支持</span>
                </div>
              </div>
              <div className="settingdialog-setting-container">
                {activeIndex == 0 ? (
                  <div className="settingdialog-setting">
                    <p className="settingdialog-setting-title">通用设置</p>
                    <div className="settingdialog-setting-main">
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          选择队列自动重置
                        </p>
                        <Switcher
                          value={clearList}
                          setValue={() => {
                            setClearList(!clearList);
                          }}
                        ></Switcher>
                        <div className="settingdialog-setting-item-tip">
                          在复制或者剪切图片到分类文件夹后，是否清空当前选中的分类文件夹列表，默认为是；修改后非立即生效
                        </div>
                      </div>
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          加载图片上限
                        </p>
                        <Inputer
                          placeholder="请输入数值"
                          value={picLoadLimit}
                          setValue={setPicLoadLimit}
                        ></Inputer>
                        <div className="settingdialog-setting-item-tip">
                          在横向或者纵向图片预览模式时，为了提高性能，降低渲染压力，并不会一次性加载显示所有待分类图片，而是根据加载图片上限，显示部分图片；最低50，最高500；修改后非立即生效
                        </div>
                      </div>
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          是否显示启动图
                        </p>
                        <Switcher
                          value={showStartup}
                          setValue={() => {
                            setShowStartup(!showStartup);
                          }}
                        ></Switcher>
                        <div className="settingdialog-setting-item-tip">
                          应用打开时是否显示启动加载图片，默认不显示，怕社死请勿开启
                        </div>
                      </div>
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          配置文件路径
                        </p>
                        <div
                          onClick={() => {
                            if (configPath) {
                              settingStore.openConfigFolder();
                            }
                          }}
                          className="settingdialog-setting-item-path"
                        >
                          <TextOverflow
                            truncatePosition="middle"
                            text={configPath}
                          ></TextOverflow>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          记录了各个方面的设置的配置文件所在位置，因为开发者没有做软件的自动更新，所以当有软件更新需求时，需自行备份配置文件，防止配置丢失。注：!!!请勿手动修改配置文件!!!
                        </div>
                      </div>
                      <div className="settingdialog-setting-apply">
                        <button
                          onClick={setDefaultSetting}
                          className={`settingdialog-setting-apply-btn${
                            settingStore.handleSettingLoading ? " loading" : ""
                          }`}
                        >
                          <span className="settingdialog-setting-apply-btn-text">
                            应用
                          </span>
                          <div className="settingdialog-setting-apply-btn-loading">
                            <Loader width="18px"></Loader>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {activeIndex == 1 ? (
                  <div className="settingdialog-setting">
                    <p className="settingdialog-setting-title">置顶分类配置</p>
                    <div className="settingdialog-setting-main">
                      <div className="settingdialog-setting-top-tip">
                        <span>
                          列出了所有被置顶的分类文件夹；修改后非立即生效
                        </span>
                        <span
                          onClick={clearTopList}
                          className="settingdialog-setting-top-tip-btn"
                        >
                          清空置顶
                        </span>
                      </div>
                      {topList.map((item) => (
                        <div
                          key={item}
                          className="settingdialog-setting-top-item"
                        >
                          <div
                            onClick={() => {
                              openFolder(item);
                            }}
                            className="settingdialog-setting-top-left"
                          >
                            <TextOverflow
                              truncatePosition="middle"
                              text={item}
                            ></TextOverflow>
                          </div>
                          <div
                            onClick={() => {
                              deleteTopList(item);
                            }}
                            className="settingdialog-setting-top-right"
                          >
                            <SvgIcon
                              svgName="delete"
                              svgSize="20px"
                              color="var(--color-white2)"
                              clickable={true}
                            ></SvgIcon>
                          </div>
                        </div>
                      ))}
                      <div className="settingdialog-setting-apply">
                        <button
                          onClick={applyTopList}
                          className={`settingdialog-setting-apply-btn${
                            settingStore.handleSettingLoading ? " loading" : ""
                          }`}
                        >
                          <span className="settingdialog-setting-apply-btn-text">
                            应用
                          </span>
                          <div className="settingdialog-setting-apply-btn-loading">
                            <Loader width="18px"></Loader>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {activeIndex == 2 ? (
                  <div className="settingdialog-setting">
                    <p className="settingdialog-setting-title">
                      自动重命名配置
                    </p>
                    <div className="settingdialog-setting-main">
                      <div className="settingdialog-setting-top-tip">
                        <div className="settingdialog-setting-top-tip-text">
                          <span>列出了所有拥有自动重命名配置的分类文件夹</span>
                          <span>修改后非立即生效</span>
                        </div>

                        <span
                          onClick={clearAutoList}
                          className="settingdialog-setting-top-tip-btn"
                        >
                          清空配置
                        </span>
                      </div>
                      {autoConfigList.map((item) => (
                        <div
                          key={item}
                          className="settingdialog-setting-top-item"
                        >
                          <div
                            onClick={() => {
                              openFolder(item);
                            }}
                            className="settingdialog-setting-top-left"
                          >
                            <TextOverflow
                              truncatePosition="middle"
                              text={item}
                            ></TextOverflow>
                          </div>
                          <div
                            onClick={() => {
                              deleteAutoList(item);
                            }}
                            className="settingdialog-setting-top-right"
                          >
                            <SvgIcon
                              svgName="delete"
                              svgSize="20px"
                              color="var(--color-white2)"
                              clickable={true}
                            ></SvgIcon>
                          </div>
                        </div>
                      ))}
                      <div className="settingdialog-setting-apply">
                        <button
                          onClick={applyAutoList}
                          className={`settingdialog-setting-apply-btn${
                            settingStore.handleSettingLoading ? " loading" : ""
                          }`}
                        >
                          <span className="settingdialog-setting-apply-btn-text">
                            应用
                          </span>
                          <div className="settingdialog-setting-apply-btn-loading">
                            <Loader width="18px"></Loader>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {activeIndex == 3 ? (
                  <div className="settingdialog-setting">
                    <p className="settingdialog-setting-title">快捷键配置</p>
                    <div className="settingdialog-setting-main">
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          剪切图片
                        </p>
                        <div className="settingdialog-setting-item-shortcut">
                          <div className="settingdialog-setting-item-shortcut-key">
                            {shortcutKeys[0].value}
                          </div>
                          <Switcher
                            value={shortcutKeys[0].enable}
                            setValue={() => {
                              switchShortcutKeysEnable(0);
                            }}
                          ></Switcher>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          将选中的图片剪切到选中的分类
                        </div>
                      </div>
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          复制图片
                        </p>
                        <div className="settingdialog-setting-item-shortcut">
                          <div className="settingdialog-setting-item-shortcut-key">
                            {shortcutKeys[1].value}
                          </div>
                          <Switcher
                            value={shortcutKeys[1].enable}
                            setValue={() => {
                              switchShortcutKeysEnable(1);
                            }}
                          ></Switcher>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          将选中的图片复制到选中的分类
                        </div>
                      </div>
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          删除图片
                        </p>
                        <div className="settingdialog-setting-item-shortcut">
                          <div className="settingdialog-setting-item-shortcut-key">
                            {shortcutKeys[2].value}
                          </div>
                          <Switcher
                            value={shortcutKeys[2].enable}
                            setValue={() => {
                              switchShortcutKeysEnable(2);
                            }}
                          ></Switcher>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          将选中的图片移动到回收站，快捷键所触发的删除图片不会弹出提示框
                        </div>
                      </div>
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          全选图片
                        </p>
                        <div className="settingdialog-setting-item-shortcut">
                          <div className="settingdialog-setting-item-shortcut-key">
                            {shortcutKeys[3].value}
                          </div>
                          <Switcher
                            value={shortcutKeys[3].enable}
                            setValue={() => {
                              switchShortcutKeysEnable(3);
                            }}
                          ></Switcher>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          选中全部图片，仅横图或者纵图模式生效
                        </div>
                      </div>
                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          全选分类
                        </p>
                        <div className="settingdialog-setting-item-shortcut">
                          <div className="settingdialog-setting-item-shortcut-key">
                            {shortcutKeys[4].value}
                          </div>
                          <Switcher
                            value={shortcutKeys[4].enable}
                            setValue={() => {
                              switchShortcutKeysEnable(4);
                            }}
                          ></Switcher>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          选中全部分类
                        </div>
                      </div>

                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          选中第1~10个分类
                        </p>
                        <div className="settingdialog-setting-item-shortcut">
                          <Switcher
                            value={sortShortcutKeysAEnable}
                            setValue={() => {
                              setSortShortcutKeysAEnable(
                                !sortShortcutKeysAEnable
                              );
                            }}
                          ></Switcher>
                        </div>
                        <div className="settingdialog-setting-item-shortcut-sort-title">
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              N
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              快捷键
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              N
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              快捷键
                            </div>
                          </div>
                        </div>
                        <div
                          className={`settingdialog-setting-item-shortcut-sort${
                            sortShortcutKeysAEnable ? "" : " disabled"
                          }`}
                        >
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              1
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[0]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              2
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[1]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              3
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[2]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              4
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[3]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              5
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[4]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              6
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[5]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              7
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[6]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              8
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[7]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              9
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[8]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              10
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysA[9]}
                            </div>
                          </div>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          {"选中第N个分类（如果存在），仅单键，默认为数字键"}
                        </div>
                      </div>

                      <div className="settingdialog-setting-item">
                        <p className="settingdialog-setting-item-title">
                          选中第11~20个分类
                        </p>
                        <div className="settingdialog-setting-item-shortcut">
                          <Switcher
                            value={sortShortcutKeysBEnable}
                            setValue={() => {
                              setSortShortcutKeysBEnable(
                                !sortShortcutKeysBEnable
                              );
                            }}
                          ></Switcher>
                        </div>
                        <div className="settingdialog-setting-item-shortcut-sort-title">
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              N
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              快捷键
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              N
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              快捷键
                            </div>
                          </div>
                        </div>
                        <div
                          className={`settingdialog-setting-item-shortcut-sort${
                            sortShortcutKeysBEnable ? "" : " disabled"
                          }`}
                        >
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              11
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[0]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              12
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[1]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              13
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[2]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              14
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[3]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              15
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[4]}
                            </div>
                          </div>

                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              16
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[5]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              17
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[6]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              18
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[7]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              19
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[8]}
                            </div>
                          </div>
                          <div className="settingdialog-setting-item-shortcut-sort-item">
                            <div className="settingdialog-setting-item-shortcut-sort-item-index">
                              20
                            </div>
                            <div className="settingdialog-setting-item-shortcut-sort-item-key">
                              {sortShortcutKeysB[9]}
                            </div>
                          </div>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          {"选中第N个分类（如果存在），仅单键，默认为Q-P"}
                        </div>
                      </div>

                      <div className="settingdialog-setting-apply">
                        <button
                          onClick={setShortcut}
                          className={`settingdialog-setting-apply-btn${
                            settingStore.handleSettingLoading ? " loading" : ""
                          }`}
                        >
                          <span className="settingdialog-setting-apply-btn-text">
                            应用
                          </span>
                          <div className="settingdialog-setting-apply-btn-loading">
                            <Loader width="18px"></Loader>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {activeIndex == 4 ? (
                  <div className="settingdialog-setting">
                    <p className="settingdialog-setting-title">帮助和信息</p>
                    <div className="settingdialog-setting-main">
                      <div className="settingdialog-setting-help-item">
                        <div className="settingdialog-setting-help-item-left">
                          <img src={qq_0} alt="qqimg" />
                        </div>
                        <div className="settingdialog-setting-help-item-right">
                          <div className="settingdialog-setting-help-item-right-name">
                            <span>千守阁²</span>
                            <span className="tip">{"(主群)"}</span>
                          </div>
                          <div className="settingdialog-setting-help-item-right-number">
                            <span>群号：</span>
                            <span
                              onClick={() => {
                                copyContent("933952145");
                              }}
                              className="number"
                            >
                              933952145
                            </span>
                          </div>
                          <div className="settingdialog-setting-help-item-right-desc">
                            交流主群，别问为什么是平方，问就是旧群爆金币了
                          </div>
                        </div>
                      </div>
                      <div className="settingdialog-setting-help-item">
                        <div className="settingdialog-setting-help-item-left">
                          <img src={qq_1} alt="qqimg" />
                        </div>
                        <div className="settingdialog-setting-help-item-right">
                          <div className="settingdialog-setting-help-item-right-name">
                            <span>千守阁の英灵殿²</span>
                            <span className="tip">{"(备用群)"}</span>
                          </div>
                          <div className="settingdialog-setting-help-item-right-number">
                            <span>群号：</span>
                            <span
                              onClick={() => {
                                copyContent("1028758853");
                              }}
                              className="number"
                            >
                              1028758853
                            </span>
                          </div>
                          <div className="settingdialog-setting-help-item-right-desc">
                            备用群，用于备份群员，默认全员禁言
                          </div>
                        </div>
                      </div>
                      <div className="settingdialog-setting-help-item">
                        <div className="settingdialog-setting-help-item-left">
                          <img src={bilibili} alt="qqimg" />
                        </div>
                        <div className="settingdialog-setting-help-item-right">
                          <div className="settingdialog-setting-help-item-right-name">
                            <span>千诺谦修</span>
                            <span className="tip">{"(B站账号)"}</span>
                          </div>
                          <div className="settingdialog-setting-help-item-right-number">
                            <span>主页：</span>
                            <span
                              onClick={() => {
                                winStore.openLink("https://b23.tv/ZQK3str");
                              }}
                              className="number"
                            >
                              {"https://b23.tv/ZQK3str"}
                            </span>
                          </div>
                          <div className="settingdialog-setting-help-item-right-desc">
                            可以查看相关使用教程等等
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                {activeIndex == 5 ? (
                  <div className="settingdialog-setting">
                    <p className="settingdialog-setting-title">支持开发者</p>
                    <div className="settingdialog-setting-main">
                      <div className="settingdialog-setting-support-item">
                        <SvgIcon
                          svgName="record"
                          svgSize="20px"
                          color="var(--color-white2)"
                        ></SvgIcon>
                        <div className="settingdialog-setting-support-item-text">
                          当前已处理<span>{handlePicCount}</span>张图片
                          <span className="tip">{"(非准确数据)"}</span>
                        </div>
                      </div>
                      <div className="settingdialog-setting-support-item block">
                        <span>
                          如果应用有帮助到你，你可以点左边“帮助”，去我的B站页面投俩币或点个赞都非常感谢，当然如果你有兴致，打赏支持我也非常感谢
                        </span>
                        <span
                          onClick={() => {
                            setQrcodeShow(!qrcodeShow);
                          }}
                          className="btn"
                        >
                          {qrcodeShow ? "点我隐藏收款码" : "点我显示收款码"}
                        </span>
                      </div>
                      <div
                        className={`settingdialog-setting-support-item qrcode${
                          qrcodeShow ? " show" : ""
                        }`}
                      >
                        <img src={qrcode} alt="qrcode" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
};

export default SettingDialog;

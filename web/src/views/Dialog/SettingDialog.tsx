import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import SvgIcon from "../../components/SvgIcon";
import Switcher from "../../components/Switcher";
import Inputer from "../../components/Inputer";
import TextOverflow from "react-text-overflow";
import "../../styles/dialog/settingdialog.scss";
import qq_0 from "../../assets/images/qq_0.jpg";
import qq_1 from "../../assets/images/qq_1.jpg";
import bilibili from "../../assets/images/bilibili.jpg";
import qrcode from "../../assets/images/qrcode.png";
import winStore from "../../store/modules/win";
import settingStore from "../../store/modules/setting";

interface SettingDialogProps {
  show: boolean;
  hide: () => void;
}

const SettingDialog: React.FC<SettingDialogProps> = ({ show, hide }) => {
  const closeDialog = () => {
    hide();
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
  const [configPath, setConfigPath] = useState("");
  // 置顶配置
  const [topList, setTopList] = useState<Array<string>>([]);
  // 自动重命名配置
  const [autoConfigList, setAutoConfigList] = useState<Array<AutoRenameConfig>>(
    []
  );
  // 壁纸配置
  const [desktopWallpaper, setDesktopWallpaper] = useState("");
  const [lockWallpaper, setLockWallpaper] = useState("");
  const [wallpaperPath, setWallpaperPath] = useState("");

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
                    setActiveIndex(0);
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
                    setActiveIndex(1);
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
                    setActiveIndex(2);
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
                    setActiveIndex(3);
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
                    setActiveIndex(4);
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
                    if (!settingStore.handleSettingLoading) {
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
                          配置文件路径
                        </p>
                        <div className="settingdialog-setting-item-path">
                          <TextOverflow
                            truncatePosition="middle"
                            text={configPath}
                          ></TextOverflow>
                        </div>
                        <div className="settingdialog-setting-item-tip">
                          记录了各个方面的设置的配置文件所在位置，因为开发者没有做软件的自动更新，所以当有软件更新需求时，需自行备份配置文件，防止配置丢失。!!!请勿手动修改配置文件!!!
                        </div>
                      </div>
                      <div className="settingdialog-setting-apply withtext">
                        <span className="settingdialog-setting-apply-text">
                          恢复所有配置文件为默认配置
                        </span>
                        <button className="settingdialog-setting-apply-btn">
                          应用
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
                        <span className="settingdialog-setting-top-tip-btn">
                          清空置顶
                        </span>
                      </div>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                        <div
                          key={item}
                          className="settingdialog-setting-top-item"
                        >
                          <div className="settingdialog-setting-top-left">
                            <TextOverflow
                              truncatePosition="middle"
                              text="非常非常长的某个置顶分类文件夹路径"
                            ></TextOverflow>
                          </div>
                          <div className="settingdialog-setting-top-right">
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
                        <button className="settingdialog-setting-apply-btn">
                          应用
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

                        <span className="settingdialog-setting-top-tip-btn">
                          清空配置
                        </span>
                      </div>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                        <div
                          key={item}
                          className="settingdialog-setting-top-item"
                        >
                          <div className="settingdialog-setting-top-left">
                            <TextOverflow
                              truncatePosition="middle"
                              text="非常非常长的某个置顶分类文件夹路径"
                            ></TextOverflow>
                          </div>
                          <div className="settingdialog-setting-top-right">
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
                        <button className="settingdialog-setting-apply-btn">
                          应用
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

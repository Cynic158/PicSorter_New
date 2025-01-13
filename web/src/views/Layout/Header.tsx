import "../../styles/layout/header.scss";
import SvgIcon from "../../components/SvgIcon";
import Loader from "../../components/Loader";
import TextOverflow from "react-text-overflow";
import WinApi from "../../api/win";
import picStore from "../../store/modules/pic";
import { Observer } from "mobx-react";
import { getFileSize, getFileTime } from "../../utils";
import InputDialog from "../Dialog/InputDialog";
import { useEffect, useState } from "react";
import winStore from "../../store/modules/win";

export default function Header() {
  const [inputDialogShow, setInputDialogShow] = useState(false);
  const showInputDialog = () => {
    setInputDialogShow(true);
  };
  const hideInputDialog = () => {
    setInputDialogShow(false);
  };

  const [infoShow, setInfoShow] = useState(false);
  const getPicInfo = () => {
    let timer = setTimeout(() => {
      if (!infoShow) {
        setInfoShow(true);
        if (!picStore.getPicInfoLoading) {
          picStore.getPicInfo();
        }
      }
      clearTimeout(timer);
    }, 200);
  };
  const resetInfoShow = () => {
    setInfoShow(false);
  };

  useEffect(() => {
    document.body.addEventListener("click", resetInfoShow);

    return () => {
      document.body.removeEventListener("click", resetInfoShow);
    };
  }, []);

  const showTip = () => {
    winStore.setMessage({
      type: "success",
      msg: "可以在设置中调整单次预览图片数量上限",
    });
  };

  return (
    <Observer>
      {() => (
        <div className="header-container">
          <div className="header-left">
            <div className="header-logo">
              <SvgIcon svgName="logo" svgSize="24px"></SvgIcon>
              <span>PicSorter</span>
            </div>
            <InputDialog
              type="renamePic"
              show={inputDialogShow}
              hide={hideInputDialog}
            ></InputDialog>
            <ul className="header-info">
              {picStore.viewMode == "view" &&
              picStore.picList.length > 0 &&
              picStore.picList[1] !== null ? (
                <>
                  {/* 名称 */}
                  <li className="header-info-item withicon">
                    <TextOverflow
                      truncatePosition="middle"
                      text={picStore.picList[1].name}
                    ></TextOverflow>
                  </li>
                  <li
                    onClick={showInputDialog}
                    className="header-info-item icon"
                  >
                    <SvgIcon
                      svgName="edit"
                      svgSize="22px"
                      hover={true}
                      hoverColor="var(--color-blue1)"
                      color="var(--color-black3)"
                      clickable={true}
                    ></SvgIcon>
                  </li>
                  {/* 大小 */}
                  <li className="header-info-item">
                    {getFileSize(picStore.picList[1].size)}
                  </li>
                  {/* 分辨率 */}
                  <li className="header-info-item">
                    {`${
                      picStore.picList[1].resolution.width
                        ? picStore.picList[1].resolution.width
                        : "--"
                    } x ${
                      picStore.picList[1].resolution.height
                        ? picStore.picList[1].resolution.height
                        : "--"
                    }`}
                  </li>
                  {/* 类型 */}
                  <li className="header-info-item">
                    {picStore.picList[1].type}
                  </li>
                  {/* 余数 */}
                  <li className="header-info-item withicon">{`余 ${picStore.picTotal} 张`}</li>
                  {/* dpi、位深度、创建时间、修改时间、了解参数意义 */}
                  <li
                    onClick={getPicInfo}
                    className="header-info-item icon info"
                  >
                    <SvgIcon
                      svgName="info"
                      svgSize="22px"
                      hover={true}
                      hoverColor="var(--color-blue1)"
                      color="var(--color-black3)"
                      clickable={true}
                    ></SvgIcon>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className={`info-container${infoShow ? " show" : ""}`}
                    >
                      <div className="info-item">
                        <span>dpi</span>
                        <div
                          className={`info-load${
                            picStore.getPicInfoLoading ? " loading" : ""
                          }`}
                        >
                          <span className="info-text">
                            {picStore.picList[1].dpi == -1
                              ? "无法读取"
                              : picStore.picList[1].dpi == 96
                              ? "96(默认值)"
                              : picStore.picList[1].dpi}
                          </span>
                          <div className="info-loading">
                            <Loader width="20px"></Loader>
                          </div>
                        </div>
                      </div>
                      <div className="info-item">
                        <span>位深度</span>
                        <div
                          className={`info-load${
                            picStore.getPicInfoLoading ? " loading" : ""
                          }`}
                        >
                          <span className="info-text">
                            {picStore.picList[1].bitDepth == -1
                              ? "无法读取"
                              : picStore.picList[1].bitDepth}
                          </span>
                          <div className="info-loading">
                            <Loader width="20px"></Loader>
                          </div>
                        </div>
                      </div>
                      <div className="info-item">
                        <span>创建时间</span>
                        <span>
                          {getFileTime(picStore.picList[1].createdAt)}
                        </span>
                      </div>
                      <div className="info-item">
                        <span>修改时间</span>
                        <span>
                          {getFileTime(picStore.picList[1].modifiedAt)}
                        </span>
                      </div>
                      <div className="info-item">
                        <span>图片路径</span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            picStore.showPic();
                          }}
                          className="path"
                        >
                          <TextOverflow
                            truncatePosition="middle"
                            text={picStore.picList[1].path}
                          ></TextOverflow>
                        </div>
                      </div>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  {(picStore.viewMode == "horizontal" ||
                    picStore.viewMode == "vertical") &&
                  picStore.picList.length > 0 ? (
                    <>
                      <li className="header-info-item">{`余 ${picStore.picTotal} 张`}</li>
                      <li className="header-info-item withicon">{`当前预览 ${picStore.picList.length} 张`}</li>
                      <li onClick={showTip} className="header-info-item icon">
                        <SvgIcon
                          svgName="info"
                          svgSize="22px"
                          hover={true}
                          hoverColor="var(--color-blue1)"
                          color="var(--color-black3)"
                          clickable={true}
                        ></SvgIcon>
                      </li>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </ul>
          </div>
          <ul className="header-right">
            <li className="header-btn">
              <SvgIcon
                svgName="setting"
                svgSize="18px"
                color="var(--color-white2)"
              ></SvgIcon>
            </li>
            <li
              onClick={() => {
                WinApi.HIDE();
              }}
              className="header-btn"
            >
              <SvgIcon
                svgName="minimize"
                svgSize="16px"
                color="var(--color-white2)"
              ></SvgIcon>
            </li>
            <li
              onClick={() => {
                WinApi.MAX();
              }}
              className="header-btn"
            >
              <SvgIcon
                svgName="maximize"
                svgSize="16px"
                color="var(--color-white2)"
              ></SvgIcon>
            </li>
            <li
              onClick={() => {
                WinApi.QUIT();
              }}
              className="header-btn exit"
            >
              <SvgIcon
                svgName="exit"
                svgSize="16px"
                color="var(--color-white2)"
              ></SvgIcon>
            </li>
          </ul>
        </div>
      )}
    </Observer>
  );
}

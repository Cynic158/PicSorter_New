import "../../styles/layout/header.scss";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import WinApi from "../../api/win";
import picStore from "../../store/modules/pic";
import { Observer } from "mobx-react";
import { getFileSize } from "../../utils";
import InputDialog from "../Dialog/InputDialog";
import PicInfoDialog from "../Dialog/PicInfoDialog";
import SettingDialog from "../Dialog/SettingDialog";
import { useState } from "react";
import winStore from "../../store/modules/win";
import sortStore from "../../store/modules/sort";

export default function Header() {
  const [inputDialogShow, setInputDialogShow] = useState(false);
  const showInputDialog = () => {
    setInputDialogShow(true);
  };
  const hideInputDialog = () => {
    setInputDialogShow(false);
  };
  const [picInfoDialogShow, setPicInfoDialogShow] = useState(false);
  const showPicInfoDialog = () => {
    setPicInfoDialogShow(true);
  };
  const hidePicInfoDialog = () => {
    setPicInfoDialogShow(false);
  };

  const getPicInfo = () => {
    if (!picStore.getPicInfoLoading && !sortStore.handlePicLoading) {
      picStore.getPicInfo(1);
      showPicInfoDialog();
    }
  };

  const showTip = () => {
    winStore.setMessage({
      type: "success",
      msg: "可以在设置中调整单次预览图片数量上限",
    });
  };

  const allSelect = () => {
    if (
      picStore.picList.length > 0 &&
      !picStore.picListLoading &&
      !sortStore.handlePicLoading
    ) {
      picStore.allSelectingPicList();
    }
  };

  const [settingDialogShow, setSettingDialogShow] = useState(false);
  const showSettingDialog = () => {
    setSettingDialogShow(true);
  };
  const hideSettingDialog = () => {
    setSettingDialogShow(false);
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
            <PicInfoDialog
              type="view"
              show={picInfoDialogShow}
              hide={hidePicInfoDialog}
              picIndex={1}
            ></PicInfoDialog>
            <SettingDialog
              show={settingDialogShow}
              hide={hideSettingDialog}
            ></SettingDialog>
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
                  <li className="header-info-item">
                    {Math.round(picStore.zoomPercent * 100)}%
                  </li>
                  {/* 余数 */}
                  <li className="header-info-item withicon">{`余 ${picStore.picTotal} 张`}</li>
                  {/* dpi、位深度、创建时间、修改时间、路径 */}
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
                      <li
                        onClick={allSelect}
                        className="header-info-item clickable"
                      >
                        {picStore.picList.length ==
                        picStore.selectingPicList.length
                          ? "取消全选"
                          : "双击全选"}
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
                clickable={true}
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
                clickable={true}
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
                clickable={true}
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
                clickable={true}
                color="var(--color-white2)"
              ></SvgIcon>
            </li>
          </ul>
        </div>
      )}
    </Observer>
  );
}

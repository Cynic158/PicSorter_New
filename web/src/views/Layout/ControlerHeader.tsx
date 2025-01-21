import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import MainFolderDialog from "../Dialog/MainFolderDialog";
import InputDialog from "../Dialog/InputDialog";
import { Observer } from "mobx-react";
import { useState } from "react";
import picStore from "../../store/modules/pic";
import sortStore from "../../store/modules/sort";

export default function ControlerHeader() {
  const [mainFolderDialogShow, setMainFolderDialogShow] = useState(false);
  const showMainFolderDialog = () => {
    setMainFolderDialogShow(true);
  };
  const hideMainFolderDialog = () => {
    setMainFolderDialogShow(false);
  };

  const switchMode = (mode: viewType) => {
    if (
      picStore.picTotal != 0 &&
      !picStore.picListLoading &&
      picStore.viewMode != mode
    ) {
      picStore.getPicList(false, null, mode);
    }
  };

  const [inputDialogShow, setInputDialogShow] = useState(false);
  const showInputDialog = () => {
    setInputDialogShow(true);
  };
  const hideInputDialog = () => {
    setInputDialogShow(false);
  };
  const insertSortFolder = () => {
    if (sortStore.sortFolderConfig.folderPath) {
      // 允许执行
      showInputDialog();
    }
  };

  return (
    <Observer>
      {() => (
        <div className="controler-header-container">
          <ul className="controler-header">
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="tool"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li
              onClick={() => {
                switchMode("view");
              }}
              className={`controler-header-item${
                picStore.picTotal == 0 ||
                picStore.viewMode == "view" ||
                picStore.picListLoading
                  ? " disabled"
                  : ""
              }`}
            >
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="viewmode"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li
              onClick={() => {
                switchMode("horizontal");
              }}
              className={`controler-header-item${
                picStore.picTotal == 0 ||
                picStore.viewMode == "horizontal" ||
                picStore.picListLoading
                  ? " disabled"
                  : ""
              }`}
            >
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="horizontalmode"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li
              onClick={() => {
                switchMode("vertical");
              }}
              className={`controler-header-item${
                picStore.picTotal == 0 ||
                picStore.viewMode == "vertical" ||
                picStore.picListLoading
                  ? " disabled"
                  : ""
              }`}
            >
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="verticalmode"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li
              onClick={insertSortFolder}
              className={`controler-header-item${
                !sortStore.sortFolderConfig.folderPath ? " disabled" : ""
              }`}
            >
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="newsort"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg delete"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="delete"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="fullselect"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li
              onClick={() => {
                showMainFolderDialog();
              }}
              className="controler-header-item"
            >
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="info"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <MainFolderDialog
              show={mainFolderDialogShow}
              hide={hideMainFolderDialog}
            ></MainFolderDialog>
            <InputDialog
              type="insertSortFolder"
              show={inputDialogShow}
              hide={hideInputDialog}
            ></InputDialog>
          </ul>
        </div>
      )}
    </Observer>
  );
}

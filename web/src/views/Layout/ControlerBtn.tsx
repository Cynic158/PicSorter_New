import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import Loader from "../../components/Loader";
import SortFolderDialog from "../Dialog/SortFolderDialog";
import PicFolderDialog from "../Dialog/PicFolderDialog";
import DeleteDialog from "../Dialog/DeleteDialog";
import ReplaceDialog from "../Dialog/ReplaceDialog";
import { useState } from "react";
import sortStore from "../../store/modules/sort";
import { Observer } from "mobx-react";
import picStore from "../../store/modules/pic";
import winStore from "../../store/modules/win";
import { cloneDeep } from "lodash";

export default function ControlerBtn() {
  const [sortFolderDialogShow, setSortFolderDialogShow] = useState(false);
  const showSortFolderDialog = () => {
    setSortFolderDialogShow(true);
  };
  const hideSortFolderDialog = () => {
    setSortFolderDialogShow(false);
  };
  const [picFolderDialogShow, setPicFolderDialogShow] = useState(false);
  const showPicFolderDialog = () => {
    setPicFolderDialogShow(true);
  };
  const hidePicFolderDialog = () => {
    setPicFolderDialogShow(false);
  };

  const [deleteDialogShow, setDeleteDialogShow] = useState(false);
  const showDeleteDialog = () => {
    setDeleteDialogShow(true);
  };
  const hideDeleteDialog = () => {
    setDeleteDialogShow(false);
  };
  const handleDeletePic = () => {
    if (
      (picStore.viewMode == "view" && picStore.picList[1] !== null) ||
      (picStore.viewMode != "view" &&
        picStore.picList.length != 0 &&
        picStore.selectingPicList.length != 0)
    ) {
      if (!sortStore.handlePicLoading && !picStore.picListLoading) {
        showDeleteDialog();
      }
    }
  };

  const [replaceDialogShow, setReplaceDialogShow] = useState(false);
  const showReplaceDialog = () => {
    setReplaceDialogShow(true);
  };
  const hideReplaceDialog = () => {
    setReplaceDialogShow(false);
  };
  const [replaceData, setReplaceData] = useState<Array<CopyPicDataType>>([]);
  const updateReplaceData = (count: number) => {
    let newData = cloneDeep(replaceData);
    newData.splice(0, count);
    if (newData.length == 0) {
      hideReplaceDialog();
    }
    setReplaceData(newData);
  };
  const handleCopyPic = async () => {
    if (!sortStore.handlePicLoading && !sortStore.copyPicLoading) {
      if (
        picStore.viewMode == "view" &&
        picStore.picList[1] !== null &&
        sortStore.selectingSortList.length > 0
      ) {
        let res = await sortStore.copyPic();
        if (res.success && res.conflictData.length > 0) {
          // 有冲突
          setReplaceData(res.conflictData);
          let timer = setTimeout(() => {
            showReplaceDialog();
            clearTimeout(timer);
          }, 100);
        } else if (res.success && res.conflictData.length == 0) {
          winStore.setMessage({
            msg: "复制成功",
            type: "success",
          });
        }
      } else if (
        picStore.viewMode != "view" &&
        picStore.picList.length > 0 &&
        picStore.selectingPicList.length > 0 &&
        sortStore.selectingSortList.length > 0
      ) {
        let res = await sortStore.copyPicGroup();
        if (res.success && res.conflictData.length > 0) {
          // 有冲突
          setReplaceData(res.conflictData);
          let timer = setTimeout(() => {
            showReplaceDialog();
            clearTimeout(timer);
          }, 100);
        } else if (res.success && res.conflictData.length == 0) {
          winStore.setMessage({
            msg: "复制成功",
            type: "success",
          });
        }
      }
    }
  };
  const handleCutPic = async () => {
    if (!sortStore.handlePicLoading && !sortStore.cutPicLoading) {
      if (
        picStore.viewMode == "view" &&
        picStore.picList[1] !== null &&
        sortStore.selectingSortList.length > 0
      ) {
        let res = await sortStore.cutPic();
        if (res.success && res.conflictData.length > 0) {
          // 有冲突
          setReplaceData(res.conflictData);
          let timer = setTimeout(() => {
            showReplaceDialog();
            clearTimeout(timer);
          }, 100);
        } else if (res.success && res.conflictData.length == 0) {
          winStore.setMessage({
            msg: "剪切成功",
            type: "success",
          });
        }
      } else if (
        picStore.viewMode != "view" &&
        picStore.picList.length > 0 &&
        picStore.selectingPicList.length > 0 &&
        sortStore.selectingSortList.length > 0
      ) {
        let res = await sortStore.cutPicGroup();
        if (res.success && res.conflictData.length > 0) {
          // 有冲突
          setReplaceData(res.conflictData);
          let timer = setTimeout(() => {
            showReplaceDialog();
            clearTimeout(timer);
          }, 100);
        } else if (res.success && res.conflictData.length == 0) {
          winStore.setMessage({
            msg: "剪切成功",
            type: "success",
          });
        }
      }
    }
  };

  return (
    <Observer>
      {() => (
        <div className="controler-btn-container">
          <PicFolderDialog
            show={picFolderDialogShow}
            hide={hidePicFolderDialog}
          ></PicFolderDialog>
          <SortFolderDialog
            show={sortFolderDialogShow}
            hide={hideSortFolderDialog}
          ></SortFolderDialog>
          <DeleteDialog
            type="deletePic"
            show={deleteDialogShow}
            hide={hideDeleteDialog}
          ></DeleteDialog>
          <ReplaceDialog
            show={replaceDialogShow}
            replaceData={replaceData}
            updateReplaceData={updateReplaceData}
          ></ReplaceDialog>
          <div className="controler-btn">
            <div className="controler-btn-left">
              <button
                id="cutbtn"
                onClick={handleCutPic}
                className={`controler-btn-left-item${
                  (picStore.viewMode == "view" &&
                    picStore.picList[1] !== null &&
                    sortStore.selectingSortList.length > 0) ||
                  (picStore.viewMode != "view" &&
                    picStore.picList.length > 0 &&
                    picStore.selectingPicList.length > 0 &&
                    sortStore.selectingSortList.length > 0)
                    ? ""
                    : " disabled"
                }${sortStore.cutPicLoading ? " loading" : ""}`}
              >
                <div className="controler-btn-icon-loading">
                  <Loader></Loader>
                </div>
                <div className="controler-btn-icon">
                  <SvgIcon
                    svgName="cut"
                    svgSize="24px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                </div>
              </button>
              <button
                id="copybtn"
                onClick={handleCopyPic}
                className={`controler-btn-left-item${
                  (picStore.viewMode == "view" &&
                    picStore.picList[1] !== null &&
                    sortStore.selectingSortList.length > 0) ||
                  (picStore.viewMode != "view" &&
                    picStore.picList.length > 0 &&
                    picStore.selectingPicList.length > 0 &&
                    sortStore.selectingSortList.length > 0)
                    ? ""
                    : " disabled"
                }${sortStore.copyPicLoading ? " loading" : ""}`}
              >
                <div className="controler-btn-icon-loading">
                  <Loader></Loader>
                </div>
                <div className="controler-btn-icon">
                  <SvgIcon
                    svgName="copy"
                    svgSize="24px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                </div>
              </button>
            </div>
            <div className="controler-btn-right">
              <div className="controler-btn-right-item">
                <button
                  onClick={() => {
                    showPicFolderDialog();
                  }}
                  className="controler-btn-right-item-left"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "3px",
                    }}
                  >
                    <div className="controler-btn-icon">
                      <SvgIcon
                        svgName="images"
                        svgSize="22px"
                        clickable={true}
                        color="var(--color-white2)"
                      ></SvgIcon>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (sortStore.picFolderConfig.folderPath) {
                      sortStore.openPicFolder();
                    }
                  }}
                  className={`controler-btn-right-item-right${
                    !sortStore.picFolderConfig.folderPath ? " disabled" : ""
                  }`}
                >
                  <div className="controler-btn-icon">
                    <SvgIcon
                      svgName="folder"
                      svgSize="22px"
                      clickable={true}
                      color="var(--color-white2)"
                    ></SvgIcon>
                  </div>
                </button>
              </div>
              <div className="controler-btn-right-item">
                <button
                  onClick={() => {
                    showSortFolderDialog();
                  }}
                  className="controler-btn-right-item-left"
                >
                  <div className="controler-btn-icon">
                    <SvgIcon
                      svgName="sort"
                      svgSize="22px"
                      clickable={true}
                      color="var(--color-white2)"
                    ></SvgIcon>
                  </div>
                </button>
                <button
                  onClick={() => {
                    if (sortStore.sortFolderConfig.folderPath) {
                      sortStore.openSortFolder();
                    }
                  }}
                  className={`controler-btn-right-item-right${
                    !sortStore.sortFolderConfig.folderPath ? " disabled" : ""
                  }`}
                >
                  <div className="controler-btn-icon">
                    <SvgIcon
                      svgName="folder"
                      svgSize="22px"
                      clickable={true}
                      color="var(--color-white2)"
                    ></SvgIcon>
                  </div>
                </button>
              </div>
              <div className="controler-btn-right-item">
                <button
                  id="deletebtn"
                  onClick={handleDeletePic}
                  className={`controler-btn-right-item-delete${
                    (picStore.viewMode == "view" &&
                      picStore.picList[1] !== null) ||
                    (picStore.viewMode != "view" &&
                      picStore.picList.length != 0 &&
                      picStore.selectingPicList.length != 0)
                      ? ""
                      : " disabled"
                  }${sortStore.deletePicLoading ? " loading" : ""}`}
                >
                  <div className="controler-btn-icon-loading">
                    <Loader></Loader>
                  </div>
                  <div className="controler-btn-icon">
                    <SvgIcon
                      svgName="delete"
                      svgSize="22px"
                      clickable={true}
                      color="var(--color-white2)"
                    ></SvgIcon>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
}

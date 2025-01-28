import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import Loader from "../../components/Loader";
import SortFolderDialog from "../Dialog/SortFolderDialog";
import PicFolderDialog from "../Dialog/PicFolderDialog";
import DeleteDialog from "../Dialog/DeleteDialog";
import { useState } from "react";
import sortStore from "../../store/modules/sort";
import { Observer } from "mobx-react";
import picStore from "../../store/modules/pic";

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
          <div className="controler-btn">
            <div className="controler-btn-left">
              <button className="controler-btn-left-item">
                <div className="controler-btn-icon">
                  <SvgIcon
                    svgName="cut"
                    svgSize="24px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                </div>
              </button>
              <button className="controler-btn-left-item">
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

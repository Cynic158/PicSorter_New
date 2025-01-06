import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import SortFolderDialog from "../Dialog/SortFolderDialog";
import PicFolderDialog from "../Dialog/PicFolderDialog";
import { useState } from "react";
import sortStore from "../../store/modules/sort";
import { Observer } from "mobx-react";

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

  return (
    <Observer>
      {() => (
        <div className="controler-btn-container">
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
                <PicFolderDialog
                  show={picFolderDialogShow}
                  hide={hidePicFolderDialog}
                ></PicFolderDialog>
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
                <SortFolderDialog
                  show={sortFolderDialogShow}
                  hide={hideSortFolderDialog}
                ></SortFolderDialog>
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
                <button className="controler-btn-right-item-delete">
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

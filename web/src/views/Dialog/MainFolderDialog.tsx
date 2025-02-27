import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import winStore from "../../store/modules/win";
import Folder from "../../components/Folder";
import Loader from "../../components/Loader";
import TextOverflow from "react-text-overflow";
import "../../styles/dialog/mainfolderdialog.scss";
import sortStore from "../../store/modules/sort";
import { cloneDeep } from "lodash";
import { getFileSize } from "../../utils";
import settingStore from "../../store/modules/setting";

interface MainFolderDialogProps {
  show: boolean;
  hide: () => void;
}

const MainFolderDialog: React.FC<MainFolderDialogProps> = ({ show, hide }) => {
  const [picFolderInfo, setPicFolderInfo] = useState<FolderInfoType>({
    name: "无",
    path: "无",
    deep: false,
    sortTotal: 0,
    picTotal: 0,
    sizeTotal: "0 KB",
    sizeRange: "无",
    resolution: "无",
    picType: [],
    createdAt: "无",
    modifiedAt: "无",
  });
  const [sortFolderInfo, setSortFolderInfo] = useState<FolderInfoType>({
    name: "无",
    path: "无",
    deep: false,
    sortTotal: 0,
    picTotal: 0,
    sizeTotal: "0 KB",
    sizeRange: "无",
    resolution: "无",
    picType: [],
    createdAt: "无",
    modifiedAt: "无",
  });
  const [picError, setPicError] = useState(false);
  const [sortError, setSortError] = useState(false);
  const closeDialog = () => {
    if (sortStore.picFolderInfoLoading || sortStore.sortFolderInfoLoading) {
      winStore.setMessage({
        msg: "请等待信息读取完成",
        type: "error",
      });
    } else {
      hide();
    }
  };

  const getMainFolderInfo = () => {
    if (sortStore.picFolderConfig.folderPath) {
      sortStore.getPicFolderInfo().then((res) => {
        if (res) {
          let cloneRes = cloneDeep(res);
          cloneRes.sizeTotal = getFileSize(cloneRes.sizeTotal as number);
          if (cloneRes.sizeRange.length == 0) {
            cloneRes.sizeRange = "无";
          } else if (cloneRes.sizeRange[0] == cloneRes.sizeRange[1]) {
            cloneRes.sizeRange =
              "皆为 " + getFileSize(cloneRes.sizeRange[0] as number);
          } else {
            cloneRes.sizeRange =
              getFileSize(cloneRes.sizeRange[0] as number) +
              " - " +
              getFileSize(cloneRes.sizeRange[1] as number);
          }
          if (
            !cloneRes.resolution.includes("-") &&
            cloneRes.resolution != "无"
          ) {
            cloneRes.resolution = "皆为 " + cloneRes.resolution;
          }
          if (cloneRes.picType.length) {
            cloneRes.picType = (cloneRes.picType as Array<picType>)
              .map((item) => item.toLocaleUpperCase())
              .join(" / ");
          } else {
            cloneRes.picType = "无";
          }
          if (!cloneRes.createdAt.includes("-") && cloneRes.createdAt != "无") {
            cloneRes.createdAt = "皆为 " + cloneRes.createdAt;
          }
          if (
            !cloneRes.modifiedAt.includes("-") &&
            cloneRes.modifiedAt != "无"
          ) {
            cloneRes.modifiedAt = "皆为 " + cloneRes.modifiedAt;
          }
          setPicFolderInfo(cloneRes);
        } else {
          setPicError(true);
        }
      });
    }
    if (sortStore.sortFolderConfig.folderPath) {
      sortStore.getSortFolderInfo().then((res) => {
        if (res) {
          let cloneRes = cloneDeep(res);
          cloneRes.sizeTotal = getFileSize(cloneRes.sizeTotal as number);
          if (cloneRes.sizeRange.length == 0) {
            cloneRes.sizeRange = "无";
          } else if (cloneRes.sizeRange[0] == cloneRes.sizeRange[1]) {
            cloneRes.sizeRange =
              "皆为 " + getFileSize(cloneRes.sizeRange[0] as number);
          } else {
            cloneRes.sizeRange =
              getFileSize(cloneRes.sizeRange[0] as number) +
              " - " +
              getFileSize(cloneRes.sizeRange[1] as number);
          }
          if (
            !cloneRes.resolution.includes("-") &&
            cloneRes.resolution != "无"
          ) {
            cloneRes.resolution = "皆为 " + cloneRes.resolution;
          }
          if (cloneRes.picType.length) {
            cloneRes.picType = (cloneRes.picType as Array<picType>)
              .map((item) => item.toLocaleUpperCase())
              .join(" / ");
          } else {
            cloneRes.picType = "无";
          }
          if (!cloneRes.createdAt.includes("-") && cloneRes.createdAt != "无") {
            cloneRes.createdAt = "皆为 " + cloneRes.createdAt;
          }
          if (
            !cloneRes.modifiedAt.includes("-") &&
            cloneRes.modifiedAt != "无"
          ) {
            cloneRes.modifiedAt = "皆为 " + cloneRes.modifiedAt;
          }
          setSortFolderInfo(cloneRes);
        } else {
          setSortError(true);
        }
      });
    }
  };

  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".mainfolderdialog-container");
    if (event.target == el) {
      closeDialog();
    }
  };

  const openPicFolder = () => {
    if (sortStore.picFolderConfig.folderPath) {
      sortStore.openPicFolder();
    }
  };
  const openSortFolder = () => {
    if (sortStore.sortFolderConfig.folderPath) {
      sortStore.openSortFolder();
    }
  };

  useEffect(() => {
    if (show) {
      settingStore.setAllowShortcut(false);
      setPicError(false);
      setSortError(false);
      getMainFolderInfo();
    } else {
      settingStore.setAllowShortcut(true);
    }

    return () => {};
  }, [show]);

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`mainfolderdialog-container${show ? " show" : ""}`}
        >
          <div className="mainfolderdialog-main">
            <p className="mainfolderdialog-title">查看存储文件夹信息</p>
            <div className="mainfolderdialog-form">
              <div
                className={`mainfolderdialog-form-item${
                  sortStore.picFolderInfoLoading ? " loading" : ""
                }`}
              >
                <div className="mainfolderdialog-form-item-folder">
                  <Folder
                    hover={sortStore.picFolderConfig.folderPath ? true : false}
                    openFolder={openPicFolder}
                    name="未分类存储文件夹"
                  ></Folder>
                </div>
                <div className="mainfolderdialog-form-item-load">
                  {!picError ? <Loader width="24px"></Loader> : <></>}
                  <span>{!picError ? "读取中..." : "读取失败"}</span>
                </div>
                {sortStore.picFolderConfig.folderPath ? (
                  <div className="mainfolderdialog-form-item-info">
                    <div className="mainfolderdialog-form-item-info-row half">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>名称</span>
                        <div className="mainfolderdialog-form-item-info-overflow">
                          <TextOverflow
                            text={picFolderInfo.name}
                          ></TextOverflow>
                        </div>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row half">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>路径</span>
                        <div className="mainfolderdialog-form-item-info-overflow">
                          <TextOverflow
                            truncatePosition="middle"
                            text={picFolderInfo.path}
                          ></TextOverflow>
                        </div>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row half">
                      <div className="mainfolderdialog-form-item-info-item half">
                        <span>图片数</span>
                        <span>{picFolderInfo.picTotal} 张</span>
                      </div>
                      <div className="mainfolderdialog-form-item-info-item half">
                        <span>穿透读取</span>
                        <span>{picFolderInfo.deep ? "是" : "否"}</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item full">
                        <span>{"分辨率跨度(宽 x 高)"}</span>
                        <span>{picFolderInfo.resolution}</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item full">
                        <span>图片类型汇总</span>
                        <span>{picFolderInfo.picType}</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>总大小</span>
                        <span>{picFolderInfo.sizeTotal}</span>
                      </div>
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>大小跨度</span>
                        <span>{picFolderInfo.sizeRange}</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>创建时间跨度</span>
                        <span>{picFolderInfo.createdAt}</span>
                      </div>
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>修改时间跨度</span>
                        <span>{picFolderInfo.modifiedAt}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mainfolderdialog-form-item-null">
                    未指定未分类存储文件夹
                  </div>
                )}
              </div>
              <div
                className={`mainfolderdialog-form-item${
                  sortStore.sortFolderInfoLoading ? " loading" : ""
                }`}
              >
                <div className="mainfolderdialog-form-item-folder">
                  <Folder
                    hover={sortStore.sortFolderConfig.folderPath ? true : false}
                    openFolder={openSortFolder}
                    name="总分类存储文件夹"
                  ></Folder>
                </div>
                <div className="mainfolderdialog-form-item-load">
                  {!sortError ? <Loader width="24px"></Loader> : <></>}
                  <span>{!sortError ? "读取中..." : "读取失败"}</span>
                </div>
                {sortStore.sortFolderConfig.folderPath ? (
                  <div className="mainfolderdialog-form-item-info">
                    <div className="mainfolderdialog-form-item-info-row half">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>名称</span>
                        <div className="mainfolderdialog-form-item-info-overflow">
                          <TextOverflow
                            text={sortFolderInfo.name}
                          ></TextOverflow>
                        </div>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row half">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>路径</span>
                        <div className="mainfolderdialog-form-item-info-overflow">
                          <TextOverflow
                            truncatePosition="middle"
                            text={sortFolderInfo.path}
                          ></TextOverflow>
                        </div>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row half">
                      <div className="mainfolderdialog-form-item-info-item half">
                        <span>图片数</span>
                        <span>{sortFolderInfo.picTotal} 张</span>
                      </div>
                      <div className="mainfolderdialog-form-item-info-item half">
                        <span>分类数</span>
                        <span>{sortFolderInfo.sortTotal} 个</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item full">
                        <span>{"分辨率跨度(宽 x 高)"}</span>
                        <span>{sortFolderInfo.resolution}</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item full">
                        <span>图片类型汇总</span>
                        <span>{sortFolderInfo.picType}</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>总大小</span>
                        <span>{sortFolderInfo.sizeTotal}</span>
                      </div>
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>大小跨度</span>
                        <span>{sortFolderInfo.sizeRange}</span>
                      </div>
                    </div>
                    <div className="mainfolderdialog-form-item-info-row">
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>创建时间跨度</span>
                        <span>{sortFolderInfo.createdAt}</span>
                      </div>
                      <div className="mainfolderdialog-form-item-info-item">
                        <span>修改时间跨度</span>
                        <span>{sortFolderInfo.modifiedAt}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mainfolderdialog-form-item-null">
                    未指定总分类存储文件夹
                  </div>
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

export default MainFolderDialog;

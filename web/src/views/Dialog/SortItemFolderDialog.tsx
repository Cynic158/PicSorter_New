import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import winStore from "../../store/modules/win";
import Folder from "../../components/Folder";
import Loader from "../../components/Loader";
import TextOverflow from "react-text-overflow";
import "../../styles/dialog/sortitemfolderdialog.scss";
import sortStore from "../../store/modules/sort";
import { cloneDeep } from "lodash";
import { getFileSize } from "../../utils";

interface SortItemFolderDialogProps {
  show: boolean;
  hide: () => void;
}

const SortItemFolderDialog: React.FC<SortItemFolderDialogProps> = ({
  show,
  hide,
}) => {
  const [sortItemFolderInfo, setSortItemFolderInfo] = useState<FolderInfoType>({
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
  const [sortItemError, setSortItemError] = useState(false);
  const closeDialog = () => {
    if (sortStore.sortItemFolderInfoLoading) {
      winStore.setMessage({
        msg: "请等待信息读取完成",
        type: "error",
      });
    } else {
      hide();
    }
  };

  const getSortItemFolderInfo = () => {
    sortStore.getSortItemFolderInfo().then((res) => {
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
        if (!cloneRes.resolution.includes("-") && cloneRes.resolution != "无") {
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
        if (!cloneRes.modifiedAt.includes("-") && cloneRes.modifiedAt != "无") {
          cloneRes.modifiedAt = "皆为 " + cloneRes.modifiedAt;
        }
        setSortItemFolderInfo(cloneRes);
      } else {
        setSortItemError(true);
      }
    });
  };

  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".sortitemfolderdialog-container");
    if (event.target == el) {
      closeDialog();
    }
  };

  const openSortItemFolder = () => {
    sortStore.openSortItemFolder();
  };

  useEffect(() => {
    if (show) {
      setSortItemError(false);
      getSortItemFolderInfo();
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
          className={`sortitemfolderdialog-container${show ? " show" : ""}`}
        >
          <div className="sortitemfolderdialog-main">
            <p className="sortitemfolderdialog-title">查看分类项文件夹信息</p>
            <div className="sortitemfolderdialog-form">
              <div
                className={`sortitemfolderdialog-form-item${
                  sortStore.sortItemFolderInfoLoading ? " loading" : ""
                }`}
              >
                <div className="sortitemfolderdialog-form-item-folder">
                  <Folder
                    hover={true}
                    openFolder={openSortItemFolder}
                    name="打开文件夹"
                  ></Folder>
                </div>
                <div className="sortitemfolderdialog-form-item-load">
                  {!sortItemError ? <Loader width="24px"></Loader> : <></>}
                  <span>{!sortItemError ? "读取中..." : "读取失败"}</span>
                </div>
                <div className="sortitemfolderdialog-form-item-info">
                  <div className="sortitemfolderdialog-form-item-info-row half">
                    <div className="sortitemfolderdialog-form-item-info-item">
                      <span>名称</span>
                      <div className="sortitemfolderdialog-form-item-info-overflow">
                        <TextOverflow
                          text={sortItemFolderInfo.name}
                        ></TextOverflow>
                      </div>
                    </div>
                  </div>
                  <div className="sortitemfolderdialog-form-item-info-row half">
                    <div className="sortitemfolderdialog-form-item-info-item">
                      <span>路径</span>
                      <div className="sortitemfolderdialog-form-item-info-overflow">
                        <TextOverflow
                          truncatePosition="middle"
                          text={sortItemFolderInfo.path}
                        ></TextOverflow>
                      </div>
                    </div>
                  </div>
                  <div className="sortitemfolderdialog-form-item-info-row half">
                    <div className="sortitemfolderdialog-form-item-info-item">
                      <span>图片数</span>
                      <span>{sortItemFolderInfo.picTotal} 张</span>
                    </div>
                  </div>
                  <div className="sortitemfolderdialog-form-item-info-row">
                    <div className="sortitemfolderdialog-form-item-info-item full">
                      <span>{"分辨率跨度(宽 x 高)"}</span>
                      <span>{sortItemFolderInfo.resolution}</span>
                    </div>
                  </div>
                  <div className="sortitemfolderdialog-form-item-info-row">
                    <div className="sortitemfolderdialog-form-item-info-item full">
                      <span>图片类型汇总</span>
                      <span>{sortItemFolderInfo.picType}</span>
                    </div>
                  </div>
                  <div className="sortitemfolderdialog-form-item-info-row">
                    <div className="sortitemfolderdialog-form-item-info-item">
                      <span>总大小</span>
                      <span>{sortItemFolderInfo.sizeTotal}</span>
                    </div>
                    <div className="sortitemfolderdialog-form-item-info-item">
                      <span>大小跨度</span>
                      <span>{sortItemFolderInfo.sizeRange}</span>
                    </div>
                  </div>
                  <div className="sortitemfolderdialog-form-item-info-row">
                    <div className="sortitemfolderdialog-form-item-info-item">
                      <span>创建时间跨度</span>
                      <span>{sortItemFolderInfo.createdAt}</span>
                    </div>
                    <div className="sortitemfolderdialog-form-item-info-item">
                      <span>修改时间跨度</span>
                      <span>{sortItemFolderInfo.modifiedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
};

export default SortItemFolderDialog;

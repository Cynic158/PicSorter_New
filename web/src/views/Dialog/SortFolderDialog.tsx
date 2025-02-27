import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import { sortType } from "../../utils/config";
import sortStore from "../../store/modules/sort";
import winStore from "../../store/modules/win";
import { Observer } from "mobx-react";
import "../../styles/dialog/sortfolderdialog.scss";
import { cloneDeep } from "lodash";
import Loader from "../../components/Loader";
import settingStore from "../../store/modules/setting";

interface SortFolderDialogProps {
  show: boolean;
  hide: () => void;
}

const SortFolderDialog: React.FC<SortFolderDialogProps> = ({ show, hide }) => {
  const [sortTypeSelect, setSortTypeSelect] = useState(false);
  const [editingSortFolderConfig, setEditingSortFolderConfig] =
    useState<SortFolderConfigType>({
      folderPath: "",
      sortType: "nameAsc",
    });
  const [gettingPath, setGettingPath] = useState(false);
  const closeDialog = () => {
    if (!sortStore.sortFolderPathLoading && !sortStore.sortFolderLoading) {
      if (gettingPath) {
        winStore.setMessage({
          msg: "请完成总分类文件夹路径选择",
          type: "error",
        });
      } else {
        hide();
      }
    }
  };
  const setFolderPath = async () => {
    if (!gettingPath) {
      setGettingPath(true);
      let res = await sortStore.getSortFolderPath(
        editingSortFolderConfig.folderPath
      );
      if (res) {
        let config = {
          folderPath: res,
          sortType: editingSortFolderConfig.sortType,
        };
        setEditingSortFolderConfig(config);
      }
      setGettingPath(false);
    }
  };
  const setSortType = (type: SortType) => {
    let config = {
      folderPath: editingSortFolderConfig.folderPath,
      sortType: type,
    };
    setEditingSortFolderConfig(config);
  };
  const setSortConfig = async () => {
    if (!sortStore.sortFolderPathLoading && !sortStore.sortFolderLoading) {
      if (editingSortFolderConfig.folderPath == "") {
        winStore.setMessage({
          msg: "请选择总分类文件夹路径",
          type: "error",
        });
      } else {
        let res = await sortStore.setSortFolderPath(editingSortFolderConfig);
        if (res) {
          winStore.setMessage({
            msg: "设置成功",
            type: "success",
          });
          closeDialog();
        }
      }
    }
  };

  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (sortTypeSelect) {
      setSortTypeSelect(false);
    } else {
      // 点击对话框外容器关闭对话框
      const el = document.querySelector(".sortfolderdialog-container");
      if (event.target == el) {
        closeDialog();
      }
    }
  };

  useEffect(() => {
    if (!show) {
      settingStore.setAllowShortcut(true);
      setSortTypeSelect(false);
    } else {
      settingStore.setAllowShortcut(false);
      // 克隆一份
      let cloneRes = cloneDeep(sortStore.sortFolderConfig);
      setEditingSortFolderConfig(cloneRes);
    }

    return () => {
      setSortTypeSelect(false);
    };
  }, [show]);

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`sortfolderdialog-container${show ? " show" : ""}${
            sortStore.sortFolderPathLoading || sortStore.sortFolderLoading
              ? " loading"
              : ""
          }`}
        >
          <div className="sortfolderdialog-main">
            <p className="sortfolderdialog-title">设置总分类存储</p>
            <div className="sortfolderdialog-form">
              <div className="sortfolderdialog-form-item">
                <span className="sortfolderdialog-form-item-label">
                  总分类文件夹路径
                </span>
                <div
                  onClick={() => {
                    if (
                      !sortStore.sortFolderPathLoading &&
                      !sortStore.sortFolderLoading
                    ) {
                      setFolderPath();
                    }
                  }}
                  className="sortfolderdialog-form-item-main"
                >
                  <SvgIcon
                    svgName="folder"
                    svgSize="26px"
                    clickable={true}
                  ></SvgIcon>
                  <div className="sortfolderdialog-form-item-main-path">
                    <TextOverflow
                      truncatePosition="middle"
                      text={
                        editingSortFolderConfig.folderPath
                          ? editingSortFolderConfig.folderPath
                          : "点我来选择路径"
                      }
                    ></TextOverflow>
                  </div>
                </div>
                <span className="sortfolderdialog-form-item-tip">
                  假设有文件夹“壁纸”，内有文件夹“电脑壁纸”、“手机壁纸”、“其他”，那么总分类文件夹应为“壁纸”。
                </span>
              </div>
              <div className="sortfolderdialog-form-item">
                <span className="sortfolderdialog-form-item-label">
                  分类文件夹排序方式
                </span>
                <div
                  onClick={() => {
                    if (
                      !sortStore.sortFolderPathLoading &&
                      !sortStore.sortFolderLoading
                    ) {
                      setSortTypeSelect(!sortTypeSelect);
                    }
                  }}
                  className="sortfolderdialog-form-item-main padding"
                >
                  <SvgIcon
                    svgName="sorttype"
                    svgSize="20px"
                    clickable={true}
                    color="var(--color-white6)"
                  ></SvgIcon>
                  <div className="sortfolderdialog-form-item-main-path">
                    <TextOverflow
                      text={
                        Object.keys(sortType).find(
                          (key) =>
                            sortType[key as SortNameType].value ==
                            editingSortFolderConfig.sortType
                        )!
                      }
                    ></TextOverflow>
                  </div>
                </div>
                <span className="sortfolderdialog-form-item-tip">
                  {
                    sortType[
                      Object.keys(sortType).find(
                        (key) =>
                          sortType[key as SortNameType].value ==
                          editingSortFolderConfig.sortType
                      ) as SortNameType
                    ].desc
                  }
                </span>
              </div>
              <button
                onClick={setSortConfig}
                className={`sortfolderdialog-btn${
                  sortStore.sortFolderPathLoading || sortStore.sortFolderLoading
                    ? " loading"
                    : ""
                }`}
              >
                <span className="sortfolderdialog-btn-text">设置完成</span>
                <div className="sortfolderdialog-btn-loading">
                  <Loader></Loader>
                </div>
              </button>
            </div>
            <ul
              className={`sortfolderdialog-form-item-select${
                sortTypeSelect ? " show" : ""
              }`}
            >
              {Object.keys(sortType).map((key) => (
                <li
                  onClick={() => {
                    setSortType(sortType[key as SortNameType].value);
                  }}
                  key={sortType[key as SortNameType].value}
                  className={`sortfolderdialog-form-item-select-item${
                    sortType[key as SortNameType].value ==
                    editingSortFolderConfig.sortType
                      ? " active"
                      : ""
                  }`}
                >
                  {key}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
};

export default SortFolderDialog;

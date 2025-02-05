import React from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import sortStore from "../../store/modules/sort";
import picStore from "../../store/modules/pic";
import Loader from "../../components/Loader";
import winStore from "../../store/modules/win";
import "../../styles/dialog/deletedialog.scss";

interface DeleteDialogProps {
  type: "deletePic" | "deleteSortFolder";
  show: boolean;
  hide: () => void;
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ type, show, hide }) => {
  const handleDelete = async () => {
    if (type == "deleteSortFolder" && !sortStore.deleteSortFolderLoading) {
      let res = await sortStore.deleteSortFolder();
      if (res) {
        winStore.setMessage({
          type: "success",
          msg: "删除成功",
        });
        closeDialog();
      }
    } else if (
      type == "deletePic" &&
      !sortStore.handlePicLoading &&
      !picStore.picListLoading
    ) {
      // 先判断是单图还是多图
      if (picStore.viewMode == "view") {
        // 单图
        let res = await sortStore.deletePic();
        if (res) {
          winStore.setMessage({
            type: "success",
            msg: "删除成功",
          });
          closeDialog();
        }
      } else {
        // 多图
        let res = await sortStore.deletePicGroup();
        if (res) {
          winStore.setMessage({
            type: "success",
            msg: "删除成功",
          });
          closeDialog();
        }
      }
    }
  };

  const closeDialog = () => {
    if (!sortStore.deleteSortFolderLoading && !sortStore.handlePicLoading) {
      hide();
    }
  };
  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".deletedialog-container." + type);
    if (event.target == el) {
      closeDialog();
    }
  };

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`deletedialog-container${" " + type}${
            show ? " show" : ""
          }`}
        >
          <div className="deletedialog-main">
            <p className="deletedialog-title">删除</p>
            <div className="deletedialog-form">
              <div className="deletedialog-form-item">
                <span className="deletedialog-form-item-label">
                  {type == "deleteSortFolder"
                    ? "确定要删除" +
                      (sortStore.selectingSortList.length == 1
                        ? " " + sortStore.selectingSortList[0]
                        : "指定的 " +
                          sortStore.selectingSortList.length +
                          "个") +
                      " 分类文件夹吗？"
                    : ""}
                  {type == "deletePic"
                    ? "确定要删除" +
                      (picStore.viewMode == "view"
                        ? " " + picStore.picList[1]?.name + " 吗？"
                        : "指定的 " +
                          picStore.selectingPicList.length +
                          "张 图片吗？")
                    : ""}
                </span>
                <span className="deletedialog-form-item-tip">
                  {type == "deleteSortFolder"
                    ? "将对应分类文件夹以及其内容移动到回收站"
                    : ""}
                  {type == "deletePic" ? "将对应图片移动到回收站" : ""}
                </span>
              </div>
              <button
                onClick={handleDelete}
                className={`deletedialog-btn${
                  sortStore.deleteSortFolderLoading ||
                  sortStore.handlePicLoading
                    ? " loading"
                    : ""
                }`}
              >
                <span className="deletedialog-btn-text">确定</span>
                <div className="deletedialog-btn-loading">
                  <Loader></Loader>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
};

export default DeleteDialog;

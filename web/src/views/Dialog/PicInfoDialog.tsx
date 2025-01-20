import React from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import picStore from "../../store/modules/pic";
import "../../styles/dialog/picinfodialog.scss";
import TextOverflow from "react-text-overflow";
import Loader from "../../components/Loader";
import SvgIcon from "../../components/SvgIcon";
import { getFileTime } from "../../utils";

interface PicInfoDialogProps {
  show: boolean;
  hide: () => void;
  picIndex: number;
  type: viewType;
}

const PicInfoDialog: React.FC<PicInfoDialogProps> = ({
  show,
  hide,
  picIndex,
  type,
}) => {
  const showPicInFolder = () => {
    if (picStore.picList[picIndex]) {
      picStore.showPic(picIndex);
    }
  };

  const closeDialog = () => {
    if (!picStore.getPicInfoLoading) {
      hide();
    }
  };

  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".picinfodialog-container." + type);
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
          className={`picinfodialog-container${" " + type}${
            show ? " show" : ""
          }`}
        >
          <div className="picinfodialog-main">
            <p className="picinfodialog-title">图片额外信息</p>
            <div className="picinfodialog-form">
              <div className="picinfodialog-form-item">
                <span>dpi</span>
                <div
                  className={`picinfodialog-form-item-info${
                    picStore.getPicInfoLoading ? " loading" : ""
                  }`}
                >
                  <span className="picinfodialog-form-item-info-text">
                    {picStore.picList[picIndex]
                      ? picStore.picList[picIndex].dpi == -1
                        ? "无法读取"
                        : picStore.picList[picIndex].dpi == 96
                        ? "96(默认值)"
                        : picStore.picList[picIndex].dpi
                      : ""}
                  </span>
                  <div className="picinfodialog-form-item-info-loading">
                    <Loader width="20px"></Loader>
                  </div>
                </div>
              </div>
              <div className="picinfodialog-form-item">
                <span>位深度</span>
                <div
                  className={`picinfodialog-form-item-info${
                    picStore.getPicInfoLoading ? " loading" : ""
                  }`}
                >
                  <span className="picinfodialog-form-item-info-text">
                    {picStore.picList[picIndex]
                      ? picStore.picList[picIndex].bitDepth == -1
                        ? "无法读取"
                        : picStore.picList[picIndex].bitDepth
                      : ""}
                  </span>
                  <div className="picinfodialog-form-item-info-loading">
                    <Loader width="20px"></Loader>
                  </div>
                </div>
              </div>
              <div className="picinfodialog-form-item">
                <span>创建时间</span>
                <div className="picinfodialog-form-item-info">
                  <span>
                    {picStore.picList[picIndex]
                      ? getFileTime(picStore.picList[picIndex].createdAt)
                      : ""}
                  </span>
                </div>
              </div>
              <div className="picinfodialog-form-item">
                <span>修改时间</span>
                <div className="picinfodialog-form-item-info">
                  <span>
                    {picStore.picList[picIndex]
                      ? getFileTime(picStore.picList[picIndex].modifiedAt)
                      : ""}
                  </span>
                </div>
              </div>
              <div className="picinfodialog-form-item">
                <span>图片路径</span>
                <div className="picinfodialog-form-item-info">
                  <div className="picinfodialog-form-item-info-path">
                    <TextOverflow
                      truncatePosition="middle"
                      text={
                        picStore.picList[picIndex]
                          ? picStore.picList[picIndex].path
                          : ""
                      }
                    ></TextOverflow>
                  </div>
                  <div
                    onClick={showPicInFolder}
                    className="picinfodialog-form-item-info-folder"
                  >
                    <SvgIcon
                      svgName="folder"
                      svgSize="24px"
                      clickable={true}
                    ></SvgIcon>
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

export default PicInfoDialog;

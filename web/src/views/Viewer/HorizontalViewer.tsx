import { Observer } from "mobx-react";
import picStore from "../../store/modules/pic";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import Pic from "../../components/Pic";
import "../../styles/viewer/horizontalviewer.scss";
import { getFileSize } from "../../utils";
import { useState } from "react";
import PicInfoDialog from "../Dialog/PicInfoDialog";
import sortStore from "../../store/modules/sort";

export default function HorizontalViewer() {
  const [currentPicIndex, setCurrentPicIndex] = useState(0);
  const [picInfoDialogShow, setPicInfoDialogShow] = useState(false);
  const showPicInfoDialog = () => {
    setPicInfoDialogShow(true);
  };
  const hidePicInfoDialog = () => {
    setPicInfoDialogShow(false);
  };
  const getPicInfo = (picIndex: number) => {
    if (!picStore.getPicInfoLoading && !sortStore.handlePicLoading) {
      setCurrentPicIndex(picIndex);
      picStore.getPicInfo(picIndex);
      showPicInfoDialog();
    }
  };

  const selectPic = (index: number) => {
    picStore.setSelectingPicList(index);
  };

  const zoomPic = (picPath: string) => {
    if (!picStore.picListLoading && !sortStore.handlePicLoading) {
      picStore.getPicList(false, picPath, "view");
    }
  };

  return (
    <Observer>
      {() => (
        <div className="horizontalviewer-container">
          <PicInfoDialog
            show={picInfoDialogShow}
            hide={hidePicInfoDialog}
            picIndex={currentPicIndex}
            type="horizontal"
          ></PicInfoDialog>
          <div className="horizontalviewer-main">
            <div className="horizontalviewer-left">
              {picStore.picList.map((pic, index) => {
                if (index % 2 == 0) {
                  return (
                    <div
                      onClick={() => {
                        selectPic(index);
                      }}
                      className={`horizontalviewer-item${
                        picStore.selectingPicList.includes(index)
                          ? " active"
                          : ""
                      }`}
                    >
                      <div
                        className={`horizontalviewer-item-select${
                          picStore.selectingPicList.includes(index)
                            ? " active"
                            : ""
                        }`}
                      >
                        <SvgIcon
                          svgName="apply"
                          svgSize="120px"
                          color="var(--color-blue2)"
                        ></SvgIcon>
                      </div>
                      <div className="horizontalviewer-item-info">
                        <div className="horizontalviewer-item-info-item padding">
                          <TextOverflow
                            truncatePosition="middle"
                            text={pic!.name}
                          ></TextOverflow>
                        </div>
                        <div className="horizontalviewer-item-info-item">
                          <span className="item">{getFileSize(pic!.size)}</span>
                          <span className="item">{`${
                            pic!.resolution.width ? pic!.resolution.width : "--"
                          } x ${
                            pic!.resolution.height
                              ? pic!.resolution.height
                              : "--"
                          }`}</span>
                          <span className="item">{pic!.type}</span>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            getPicInfo(index);
                          }}
                          className="horizontalviewer-item-detail"
                        >
                          <SvgIcon
                            svgName="info"
                            svgSize="24px"
                            color="var(--color-white2)"
                            clickable={true}
                          ></SvgIcon>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            zoomPic(pic!.path);
                          }}
                          className="horizontalviewer-item-zoom"
                        >
                          <SvgIcon
                            svgName="zoom"
                            svgSize="22px"
                            color="var(--color-white2)"
                            clickable={true}
                          ></SvgIcon>
                        </div>
                      </div>
                      <div className="horizontalviewer-item-pic">
                        <Pic
                          type="horizontal"
                          url={picStore.getPicUrl(pic!.path, "pic")}
                        ></Pic>
                      </div>
                    </div>
                  );
                } else {
                  return <></>;
                }
              })}
            </div>
            <div className="horizontalviewer-right">
              {picStore.picList.map((pic, index) => {
                if (index % 2 != 0) {
                  return (
                    <div
                      onClick={() => {
                        selectPic(index);
                      }}
                      className={`horizontalviewer-item${
                        picStore.selectingPicList.includes(index)
                          ? " active"
                          : ""
                      }`}
                    >
                      <div
                        className={`horizontalviewer-item-select${
                          picStore.selectingPicList.includes(index)
                            ? " active"
                            : ""
                        }`}
                      >
                        <SvgIcon
                          svgName="apply"
                          svgSize="120px"
                          color="var(--color-blue2)"
                        ></SvgIcon>
                      </div>
                      <div className="horizontalviewer-item-info">
                        <div className="horizontalviewer-item-info-item padding">
                          <TextOverflow
                            truncatePosition="middle"
                            text={pic!.name}
                          ></TextOverflow>
                        </div>
                        <div className="horizontalviewer-item-info-item">
                          <span className="item">{getFileSize(pic!.size)}</span>
                          <span className="item">{`${
                            pic!.resolution.width ? pic!.resolution.width : "--"
                          } x ${
                            pic!.resolution.height
                              ? pic!.resolution.height
                              : "--"
                          }`}</span>
                          <span className="item">{pic!.type}</span>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            getPicInfo(index);
                          }}
                          className="horizontalviewer-item-detail"
                        >
                          <SvgIcon
                            svgName="info"
                            svgSize="24px"
                            color="var(--color-white2)"
                            clickable={true}
                          ></SvgIcon>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            zoomPic(pic!.path);
                          }}
                          className="horizontalviewer-item-zoom"
                        >
                          <SvgIcon
                            svgName="zoom"
                            svgSize="22px"
                            color="var(--color-white2)"
                            clickable={true}
                          ></SvgIcon>
                        </div>
                      </div>
                      <div className="horizontalviewer-item-pic">
                        <Pic
                          type="horizontal"
                          url={picStore.getPicUrl(pic!.path, "pic")}
                        ></Pic>
                      </div>
                    </div>
                  );
                } else {
                  return <></>;
                }
              })}
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
}

import { Observer } from "mobx-react";
import picStore from "../../store/modules/pic";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import Pic from "../../components/Pic";
import "../../styles/viewer/verticalviewer.scss";
import { getFileSize } from "../../utils";
import { useState } from "react";
import PicInfoDialog from "../Dialog/PicInfoDialog";

export default function VerticalViewer() {
  const [currentPicIndex, setCurrentPicIndex] = useState(0);
  const [picInfoDialogShow, setPicInfoDialogShow] = useState(false);
  const showPicInfoDialog = () => {
    setPicInfoDialogShow(true);
  };
  const hidePicInfoDialog = () => {
    setPicInfoDialogShow(false);
  };
  const getPicInfo = (picIndex: number) => {
    if (!picStore.getPicInfoLoading) {
      setCurrentPicIndex(picIndex);
      picStore.getPicInfo(picIndex);
      showPicInfoDialog();
    }
  };

  const selectPic = (index: number) => {
    picStore.setSelectingPicList(index);
  };

  const zoomPic = (picPath: string) => {
    if (!picStore.picListLoading) {
      picStore.getPicList(false, picPath, "view");
    }
  };

  return (
    <Observer>
      {() => (
        <div className="verticalviewer-container">
          <PicInfoDialog
            show={picInfoDialogShow}
            hide={hidePicInfoDialog}
            picIndex={currentPicIndex}
            type="vertical"
          ></PicInfoDialog>
          <div className="verticalviewer-main">
            <div className="verticalviewer-scroll">
              {picStore.picList.map((pic, index) => (
                <div
                  onClick={() => {
                    selectPic(index);
                  }}
                  className={`verticalviewer-item${
                    picStore.selectingPicList.includes(index) ? " active" : ""
                  }`}
                >
                  <div
                    className={`verticalviewer-item-select${
                      picStore.selectingPicList.includes(index) ? " active" : ""
                    }`}
                  >
                    <SvgIcon
                      svgName="apply"
                      svgSize="120px"
                      color="var(--color-blue2)"
                    ></SvgIcon>
                  </div>
                  <div className="verticalviewer-item-info">
                    <div className="verticalviewer-item-info-item padding">
                      <TextOverflow
                        truncatePosition="middle"
                        text={pic!.name}
                      ></TextOverflow>
                    </div>
                    <div className="verticalviewer-item-info-item">
                      <span className="item">{getFileSize(pic!.size)}</span>
                      <span className="item">{`${
                        pic!.resolution.width ? pic!.resolution.width : "--"
                      } x ${
                        pic!.resolution.height ? pic!.resolution.height : "--"
                      }`}</span>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        getPicInfo(index);
                      }}
                      className="verticalviewer-item-detail"
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
                      className="verticalviewer-item-zoom"
                    >
                      <SvgIcon
                        svgName="zoom"
                        svgSize="22px"
                        color="var(--color-white2)"
                        clickable={true}
                      ></SvgIcon>
                    </div>
                  </div>
                  <div className="verticalviewer-item-pic">
                    <Pic
                      type="vertical"
                      url={picStore.getPicUrl(pic!.path, "pic")}
                    ></Pic>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
}

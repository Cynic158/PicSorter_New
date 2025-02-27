import { Observer } from "mobx-react";
import picStore from "../../store/modules/pic";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import Pic from "../../components/Pic";
import "../../styles/viewer/horizontalviewer.scss";
import { getFileSize } from "../../utils";
import { useEffect, useState } from "react";
import PicInfoDialog from "../Dialog/PicInfoDialog";
import sortStore from "../../store/modules/sort";
import PreviewPic from "../../components/PreviewPic";

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

  // 总预览列表
  const [previewShow, setPreviewShow] = useState(false);
  const [previewMark, setPreviewMark] = useState("");
  const scrollToMark = async () => {
    const container = document.querySelector<HTMLElement>(
      ".horizontalviewer-preview-main"
    );
    const itemContainer = document.querySelector<HTMLElement>(
      ".horizontalviewer-preview-item-container"
    );
    const target = document.getElementById(previewMark);

    if (!container || !itemContainer || !target) return;

    // await new Promise((resolve) => requestAnimationFrame(resolve));

    const containerWidth = container.clientWidth; // 可视区域宽度
    const targetRect = target.getBoundingClientRect();
    const itemContainerRect = itemContainer.getBoundingClientRect();

    // 计算目标图片相对于 defaultviewer-preview-item-container 的偏移量
    const targetOffset =
      targetRect.left - itemContainerRect.left + targetRect.width / 2;

    // 计算滚动距离，使目标图片居中
    const scrollLeft = targetOffset - containerWidth / 2;

    const scrollLength = Math.max(
      0,
      Math.min(scrollLeft, container.scrollWidth - container.clientWidth)
    );

    container.scrollTo({
      left: scrollLength, // 限制滚动范围
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (previewShow && previewMark && picStore.selectingPicList.length > 0) {
      // 滚动到mark指定的图片
      let timer = setTimeout(() => {
        scrollToMark();
        clearTimeout(timer);
      }, 500);
    }

    return () => {};
  }, [previewShow]);
  useEffect(() => {
    if (previewShow && previewMark && picStore.selectingPicList.length > 0) {
      // 滚动到mark指定的图片
      scrollToMark();
    }

    return () => {};
  }, [previewMark]);

  const selectPic = (index: number, scroll: boolean = true) => {
    picStore.setSelectingPicList(index);
    if (scroll) {
      setPreviewMark(index.toString());
    }
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
          <div
            className={`horizontalviewer-preview-container${
              previewShow ? " show" : ""
            }`}
          >
            <div className="horizontalviewer-preview-main">
              <div className="horizontalviewer-preview-item-container">
                {picStore.picList.map((item, index) => (
                  <PreviewPic
                    click={() => {
                      selectPic(index, false);
                    }}
                    key={index}
                    active={picStore.selectingPicList.includes(index)}
                    url={picStore.getPicUrl(item!.path, "pic")}
                    id={index.toString()}
                  ></PreviewPic>
                ))}
              </div>
            </div>
            <div className="horizontalviewer-preview-fold-container">
              <div className="horizontalviewer-preview-fold-main">
                <div
                  onClick={() => {
                    setPreviewShow(false);
                  }}
                  className="horizontalviewer-preview-fold"
                >
                  <SvgIcon
                    svgName="arrowprev"
                    svgSize="24px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                </div>
                <div
                  onClick={() => {
                    setPreviewShow(true);
                  }}
                  className="horizontalviewer-preview-fold"
                >
                  <SvgIcon
                    svgName="arrownext"
                    svgSize="24px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                </div>
              </div>
            </div>
          </div>
          <div className="horizontalviewer-main-container">
            <div className="horizontalviewer-main">
              <div className="horizontalviewer-left">
                {picStore.picList.map((pic, index) => {
                  if (index % 2 == 0) {
                    return (
                      <div
                        key={index}
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
                            <span className="item">
                              {getFileSize(pic!.size)}
                            </span>
                            <span className="item">{`${
                              pic!.resolution.width
                                ? pic!.resolution.width
                                : "--"
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
                        key={index}
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
                            <span className="item">
                              {getFileSize(pic!.size)}
                            </span>
                            <span className="item">{`${
                              pic!.resolution.width
                                ? pic!.resolution.width
                                : "--"
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
        </div>
      )}
    </Observer>
  );
}

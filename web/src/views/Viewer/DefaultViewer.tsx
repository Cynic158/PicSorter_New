import { Observer } from "mobx-react";
import picStore from "../../store/modules/pic";
import IconLoader from "../../components/IconLoader";
import SvgIcon from "../../components/SvgIcon";
import errorpic from "../../assets/images/errorpic.jpg";
import "../../styles/viewer/defaultviewer.scss";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useEffect, useRef, useState } from "react";
import sortStore from "../../store/modules/sort";
import PreviewPic from "../../components/PreviewPic";

export default function DefaultViewer() {
  const [picUrl, setPicUrl] = useState("");
  const [loadingShow, setLoadingShow] = useState(true);
  const [errorShow, setErrorShow] = useState(false);
  const [picShow, setPicShow] = useState(false);
  const handleLoad = () => {
    // 图片加载中
    setLoadingShow(true);
    setErrorShow(false);
    setPicShow(false);
  };
  const handleError = () => {
    // 图片加载失败
    setLoadingShow(false);
    setErrorShow(true);
    setPicShow(false);
  };
  const handleSuccess = () => {
    // 图片加载成功
    setLoadingShow(false);
    setErrorShow(false);
    setPicShow(true);
  };

  const switchPrev = () => {
    if (
      picStore.picList[0] !== null &&
      !picStore.picListLoading &&
      !sortStore.handlePicLoading
    ) {
      picStore.getPicList(false, picStore.picList[0].path);
    }
  };
  const switchNext = () => {
    if (
      picStore.picList[2] !== null &&
      !picStore.picListLoading &&
      !sortStore.handlePicLoading
    ) {
      picStore.getPicList(false, picStore.picList[2].path);
    }
  };

  // 总预览列表
  const [previewShow, setPreviewShow] = useState(false);
  const [previewMark, setPreviewMark] = useState("");
  const switchPreview = (path: string) => {
    if (
      !picStore.picListLoading &&
      !sortStore.handlePicLoading &&
      path != picStore.picList[1]!.path
    ) {
      picStore.getPicList(false, path);
    }
  };
  const scrollToMark = async () => {
    const container = document.querySelector<HTMLElement>(
      ".defaultviewer-preview-main"
    );
    const itemContainer = document.querySelector<HTMLElement>(
      ".defaultviewer-preview-item-container"
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

    if (Math.abs(scrollLength - container.scrollLeft) < 3000) {
      container.scrollTo({
        left: scrollLength, // 限制滚动范围
        behavior: "smooth",
      });
    } else {
      container.scrollLeft = scrollLength;
    }
  };

  useEffect(() => {
    if (previewShow && previewMark) {
      // 滚动到mark指定的图片
      let timer = setTimeout(() => {
        scrollToMark();
        clearTimeout(timer);
      }, 500);
    }

    return () => {};
  }, [previewShow]);
  useEffect(() => {
    if (previewShow && previewMark) {
      // 滚动到mark指定的图片
      scrollToMark();
    }

    return () => {};
  }, [previewMark]);

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  useEffect(() => {
    if (picStore.picList[1] && picStore.picList[1].path) {
      let url = picStore.getPicUrl(picStore.picList[1].path, "pic");

      if (url != picUrl) {
        transformComponentRef.current?.resetTransform();
        handleLoad();
        setPicUrl(url);
      }

      if (picStore.previewList.length > 0) {
        let findIndex = picStore.previewList.findIndex(
          (item) => item!.path == picStore.picList[1]!.path
        );
        if (findIndex != -1) {
          setPreviewMark(findIndex.toString());
        }
      }
    }

    return () => {};
  }, [picStore.picList[1]]);

  return (
    <Observer>
      {() => (
        <div className="defaultviewer-container">
          <img
            src={picUrl}
            onLoad={handleSuccess}
            onError={handleError}
            style={{ display: "none" }}
          />
          <div className={`defaultviewer-loading${loadingShow ? " show" : ""}`}>
            <IconLoader></IconLoader>
          </div>
          <div className={`defaultviewer-error${errorShow ? " show" : ""}`}>
            <img src={errorpic} alt="errorpic" />
          </div>
          <div
            className={`defaultviewer-prev-container${
              picStore.picList[0] === null ? " disabled" : ""
            }`}
          >
            <div className="prev">
              <button onClick={switchPrev}>
                <SvgIcon
                  svgName="arrowprev"
                  svgSize="36px"
                  clickable={true}
                  color={
                    picStore.picList[0] === null
                      ? "var(--color-blue2)"
                      : "var(--color-blue1)"
                  }
                ></SvgIcon>
              </button>
            </div>
          </div>
          <div
            className={`defaultviewer-next-container${
              picStore.picList[2] === null ? " disabled" : ""
            }`}
          >
            <div className="next">
              <button onClick={switchNext}>
                <SvgIcon
                  svgName="arrownext"
                  svgSize="36px"
                  clickable={true}
                  color={
                    picStore.picList[2] === null
                      ? "var(--color-blue2)"
                      : "var(--color-blue1)"
                  }
                ></SvgIcon>
              </button>
            </div>
          </div>
          <div
            className={`defaultviewer-preview-container${
              previewShow ? " show" : ""
            }`}
          >
            <div className="defaultviewer-preview-main">
              <div className="defaultviewer-preview-item-container">
                {picStore.previewList.map((item, index) => (
                  <PreviewPic
                    click={() => {
                      switchPreview(item!.path);
                    }}
                    key={item!.path}
                    active={previewMark == index.toString()}
                    url={picStore.getPicUrl(item!.path, "pic")}
                    id={index.toString()}
                  ></PreviewPic>
                ))}
              </div>
            </div>
            <div className="defaultviewer-preview-fold-container">
              <div className="defaultviewer-preview-fold-main">
                <div
                  onClick={() => {
                    setPreviewShow(false);
                  }}
                  className="defaultviewer-preview-fold"
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
                  className="defaultviewer-preview-fold"
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
          <div className={`defaultviewer-main${picShow ? " show" : ""}`}>
            <TransformWrapper
              doubleClick={{ mode: "reset" }}
              centerOnInit={true}
              maxScale={10}
              ref={transformComponentRef}
            >
              <TransformComponent
                wrapperClass="defaultviewer-zoom-container"
                contentClass="defaultviewer-zoom"
              >
                <img className="defaultviewer-zoom-pic" src={picUrl} />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      )}
    </Observer>
  );
}

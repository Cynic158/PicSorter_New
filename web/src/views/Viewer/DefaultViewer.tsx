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

export default function DefaultViewer() {
  const [picUrl, setPicUrl] = useState("");
  const [loadingShow, setLoadingShow] = useState(false);
  const [errorShow, setErrorShow] = useState(false);
  const [picShow, setPicShow] = useState(true);
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
    if (picStore.picList[0] !== null && !picStore.picListLoading) {
      picStore.getPicList(false, picStore.picList[0].path);
    }
  };
  const switchNext = () => {
    if (picStore.picList[2] !== null && !picStore.picListLoading) {
      picStore.getPicList(false, picStore.picList[2].path);
    }
  };

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);
  useEffect(() => {
    if (picStore.picList[1] && picStore.picList[1].path) {
      let url = picStore.getPicUrl(picStore.picList[1].path, "pic");

      if (url != picUrl) {
        transformComponentRef.current?.resetTransform();
        handleLoad();
        setPicUrl(url);
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

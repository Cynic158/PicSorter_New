import React, { useState } from "react";
import IconLoader from "./IconLoader";
import ErrorPic from "../assets/images/errorpic.jpg";
import "../styles/components/pic.scss";

// 非图片预览使用时
// type为other
// 需要传入宽高
// 此时图片object-fit为contain

// 横图预览使用时
// type为horizontal
// 不需要传入宽高
// 此时图片object-fit为cover

// 竖图预览使用时
// type为vertical
// 不需要传入宽高
// 此时图片object-fit为cover
interface PicProps {
  type: "other" | "horizontal" | "vertical";
  width?: string;
  height?: string;
  url: string;
}

const Pic: React.FC<PicProps> = ({ type, width = "", height = "", url }) => {
  const [loadingShow, setLoadingShow] = useState(true);
  const [errorShow, setErrorShow] = useState(false);
  const [picShow, setPicShow] = useState(false);
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

  return (
    <div className={`pic-container ${type}`}>
      <div className={`pic-loading${loadingShow ? " show" : ""}`}>
        <IconLoader></IconLoader>
      </div>
      <img
        className={`pic-error${errorShow ? " show" : ""}`}
        src={ErrorPic}
        alt="errorpic"
      ></img>
      <img
        style={{
          width:
            type == "other" ? width : type == "horizontal" ? "100%" : "auto",
          height:
            type == "other" ? height : type == "horizontal" ? "auto" : "100%",
        }}
        className={`pic${picShow ? " show" : ""}`}
        src={url}
        alt="pic"
        onLoad={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};

export default Pic;

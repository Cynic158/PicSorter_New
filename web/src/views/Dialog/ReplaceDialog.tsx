import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/dialog/replacedialog.scss";
import sortStore from "../../store/modules/sort";
import picStore from "../../store/modules/pic";
import SvgIcon from "../../components/SvgIcon";
import Pic from "../../components/Pic";
import Loader from "../../components/Loader";

interface ReplaceDialogProps {
  show: boolean;
  replaceData: Array<CopyPicDataType>;
  updateReplaceData: (count: number) => void;
}

const ReplaceDialog: React.FC<ReplaceDialogProps> = ({
  show,
  replaceData,
  updateReplaceData,
}) => {
  const [applyAll, setApplyAll] = useState(false);
  const [replaceLoading, setReplaceLoading] = useState(false);
  const handleConflict = async (type: "ignore" | "replace") => {
    if (!replaceLoading && replaceData.length > 0) {
      setReplaceLoading(true);
      if (type == "ignore") {
        if (!applyAll) {
          updateReplaceData(1);
        } else {
          updateReplaceData(replaceData.length);
        }
      } else {
        if (!applyAll) {
          let res = await sortStore.replacePic(replaceData[0]);
          if (res) {
            updateReplaceData(1);
          }
        } else {
          // 循环replaceData，成功几个就更新几个
          let successCount = 0;
          for (const item of replaceData) {
            let res = await sortStore.replacePic(item);
            if (res) {
              successCount++;
            }
          }
          // 更新已成功处理的项数
          updateReplaceData(successCount);
        }
      }
      let timer = setTimeout(() => {
        setReplaceLoading(false);
        clearTimeout(timer);
      }, 100);
    }
  };

  useEffect(() => {
    if (show) {
      setApplyAll(false);
    }

    return () => {};
  }, [show]);

  const [currentPic, setCurrentPic] = useState("");
  const [conflictPic, setConflictPic] = useState("");
  useEffect(() => {
    if (replaceData.length == 0) {
      setCurrentPic("");
      setConflictPic("");
    } else {
      let currentUrl = picStore.getPicUrl(replaceData[0].picPath, "pic");
      let conflictUrl = picStore.getPicUrl(
        replaceData[0].sortPath + "/" + replaceData[0].picName,
        "sort"
      );
      setCurrentPic(currentUrl);
      setConflictPic(conflictUrl);
    }

    return () => {};
  }, [replaceData]);

  return ReactDOM.createPortal(
    <div className={`replacedialog-container${show ? " show" : ""}`}>
      <div className="replacedialog-main">
        <p className="replacedialog-title">
          {replaceData.length > 0
            ? replaceData[0].action == "copy"
              ? "复制冲突"
              : "剪切冲突"
            : "冲突"}
        </p>
        <div className="replacedialog-form">
          <div className="replacedialog-pic-container">
            <div
              className={`replacedialog-pic${currentPic != "" ? "" : " hide"}`}
            >
              <Pic
                type="other"
                url={currentPic}
                width="250px"
                height="250px"
              ></Pic>
            </div>
            <div
              className={`replacedialog-pic-icon${
                currentPic != "" && conflictPic != "" ? "" : " hide"
              }`}
            >
              <SvgIcon svgName="arrownext" svgSize="30px"></SvgIcon>
            </div>
            <div
              className={`replacedialog-pic${conflictPic != "" ? "" : " hide"}`}
            >
              <Pic
                type="other"
                url={conflictPic}
                width="250px"
                height="250px"
              ></Pic>
            </div>
          </div>
          <div className="replacedialog-tip">
            {replaceData.length > 0 ? (
              <>
                <p className="replacedialog-tip-item">
                  复制图片 “{replaceData[0].picName}” 到分类《
                  {replaceData[0].sortName}》时产生冲突
                </p>
                <p className="replacedialog-tip-item">
                  分类《{replaceData[0].sortName}》内已存在同名图片
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
          <div className="replacedialog-btn-container">
            <div className="replacedialog-btn-main">
              <button
                onClick={() => {
                  handleConflict("ignore");
                }}
                className={`replacedialog-btn${
                  replaceLoading ? " loading" : ""
                }`}
              >
                <span className="replacedialog-btn-text">跳过</span>
                <div className="replacedialog-btn-loading">
                  <Loader width="18px"></Loader>
                </div>
              </button>
              <button
                onClick={() => {
                  handleConflict("replace");
                }}
                className={`replacedialog-btn${
                  replaceLoading ? " loading" : ""
                }`}
              >
                <span className="replacedialog-btn-text">替换</span>
                <div className="replacedialog-btn-loading">
                  <Loader width="18px"></Loader>
                </div>
              </button>
            </div>
            <div
              className={`replacedialog-btn-apply${
                replaceLoading ? " disabled" : ""
              }`}
            >
              <span
                onClick={() => {
                  if (!replaceLoading) {
                    setApplyAll(!applyAll);
                  }
                }}
                className="replacedialog-btn-apply-text"
              >
                采用相同的方式处理此轮后续冲突
              </span>
              <div
                onClick={() => {
                  if (!replaceLoading) {
                    setApplyAll(!applyAll);
                  }
                }}
                className={`replacedialog-btn-apply-icon${
                  applyAll ? "" : " active"
                }`}
              >
                <SvgIcon
                  svgName="unselect"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
              <div
                onClick={() => {
                  if (!replaceLoading) {
                    setApplyAll(!applyAll);
                  }
                }}
                className={`replacedialog-btn-apply-icon select${
                  applyAll ? " active" : ""
                }`}
              >
                <SvgIcon
                  svgName="select"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-green1)"
                ></SvgIcon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("root")!
  );
};

export default ReplaceDialog;

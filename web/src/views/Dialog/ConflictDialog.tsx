import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "../../styles/dialog/conflictdialog.scss";
import picStore from "../../store/modules/pic";
import Pic from "../../components/Pic";

interface ConflictDialogProps {
  conflictWidth: string;
  conflictHeight: string;
  conflictPath: string;
  show: boolean;
  hide: () => void;
}

const ConflictDialog: React.FC<ConflictDialogProps> = ({
  conflictWidth,
  conflictHeight,
  conflictPath,
  show,
  hide,
}) => {
  const [url, setUrl] = useState("");
  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".conflictdialog-container");
    if (event.target == el) {
      hide();
    }
  };

  useEffect(() => {
    let conflictUrl = picStore.getPicUrl(conflictPath, "pic");
    setUrl(conflictUrl);

    return () => {};
  }, [conflictPath]);

  return ReactDOM.createPortal(
    <div
      onClick={(event) => {
        maskClick(event);
      }}
      className={`conflictdialog-container${show ? " show" : ""}`}
    >
      <div className="conflictdialog-main">
        <p className="conflictdialog-title">重命名冲突</p>
        <div className="conflictdialog-form">
          <div
            style={{ width: conflictWidth, height: conflictHeight }}
            className="conflictdialog-pic-container"
          >
            <Pic
              type="other"
              url={url}
              width={conflictWidth}
              height={conflictHeight}
            ></Pic>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("root")!
  );
};

export default ConflictDialog;

import ReactDOM from "react-dom";
import winStore from "../store/modules/win";
import SvgIcon from "./SvgIcon";
import { Observer } from "mobx-react";
import "../styles/components/errordialog.scss";
import { useEffect } from "react";
import settingStore from "../store/modules/setting";

export default function ErrorDialog() {
  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".errordialog-container");
    if (event.target == el) {
      winStore.hideErrorDialog();
    }
  };
  const copyLog = async () => {
    let res = await winStore.copyContent();
    if (res) {
      winStore.setMessage({
        type: "success",
        msg: "复制成功",
      });
    }
  };

  useEffect(() => {
    if (winStore.showErrorDialog) {
      settingStore.setAllowShortcut(false);
    } else {
      settingStore.setAllowShortcut(true);
    }

    return () => {};
  }, [winStore.showErrorDialog]);

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`errordialog-container${
            winStore.showErrorDialog ? " show" : ""
          }`}
        >
          <div className="errordialog-main">
            <p className="errordialog-title">错误</p>
            <div className="errordialog-form">
              <div className="errordialog-form-item-container">
                <SvgIcon
                  svgName="error"
                  svgSize="110px"
                  color="var(--color-red4)"
                ></SvgIcon>
                <div className="errordialog-form-item">
                  <p className="errordialog-form-item-label">
                    {"在 " + winStore.errorAction + " 时出错"}
                  </p>
                  <span
                    onClick={copyLog}
                    className="errordialog-form-item-copy"
                  >
                    点我复制错误报告
                  </span>
                  <span className="errordialog-form-item-tip">
                    您可复制错误报告给软件源作者寻求帮助
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  winStore.hideErrorDialog();
                }}
                className="errordialog-btn"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
}

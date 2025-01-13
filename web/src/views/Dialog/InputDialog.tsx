import React, { ChangeEvent, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import SvgIcon from "../../components/SvgIcon";
import Loader from "../../components/Loader";
import ConflictDialog from "./ConflictDialog";
import "../../styles/dialog/inputdialog.scss";
import winStore from "../../store/modules/win";
import picStore from "../../store/modules/pic";
import { getAdaptiveResolution } from "../../utils";

interface InputDialogProps {
  type: "renamePic" | "insertSortFolder" | "renameSortFolder";
  show: boolean;
  hide: () => void;
}

const InputDialog: React.FC<InputDialogProps> = ({ type, show, hide }) => {
  const [inputTitle, setInputTitle] = useState("");
  const [inputActive, setIputActive] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState("");
  const [inputVal, setInputVal] = useState("");
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInputVal(e.target.value);
  };

  const [conflictDialogShow, setConflictDialogShow] = useState(false);
  const [conflictPath, setConflictPath] = useState("");
  const [conflictWidth, setConflictWidth] = useState("");
  const [conflictHeight, setConflictHeight] = useState("");
  const showConflictDialog = () => {
    setConflictDialogShow(true);
  };
  const hideConflictDialog = () => {
    setConflictDialogShow(false);
  };

  const validateVal = () => {
    if (type == "renamePic") {
      if (inputVal.trim() == "") {
        winStore.setMessage({
          type: "error",
          msg: "图片名称不能为空",
        });
        return false;
      } else if (
        inputVal.trim() ==
        picStore.picList[1]?.name.substring(
          0,
          picStore.picList[1].name.lastIndexOf(".")
        )
      ) {
        winStore.setMessage({
          type: "error",
          msg: "图片名称不能重复",
        });
        return false;
      } else if (/[/\\:*?"<>|]/.test(inputVal.trim())) {
        winStore.setMessage({
          type: "error",
          msg: '文件名不能包含字符\\/:*?"<>|',
        });
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  const applyVal = async () => {
    if (!picStore.renamePicLoading) {
      let validateRes = validateVal();
      if (validateRes) {
        if (type == "renamePic") {
          let res = await picStore.renamePic(inputVal.trim());
          if (res.success && !res.conflict) {
            // 重命名成功
            winStore.setMessage({
              type: "success",
              msg: "重命名成功",
            });
            closeDialog();
          } else if (res.conflict) {
            // 有冲突
            let resolution = getAdaptiveResolution(
              [300, 600],
              [300, 600],
              res.conflictData!.width,
              res.conflictData!.height
            );
            setConflictWidth(resolution[0]);
            setConflictHeight(resolution[1]);
            setConflictPath(res.conflictData!.path);
            let timer = setTimeout(() => {
              showConflictDialog();
              winStore.setMessage({
                type: "error",
                msg:
                  "未分类存储文件夹下已存在名为 " +
                  inputVal.trim() +
                  " 的图片，请使用其他名称",
              });
              clearTimeout(timer);
            }, 100);
          }
        }
      }
    }
  };

  const closeDialog = () => {
    if (!picStore.renamePicLoading) {
      hide();
    }
  };
  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // 点击对话框外容器关闭对话框
    const el = document.querySelector(".inputdialog-container");
    if (event.target == el) {
      closeDialog();
    }
  };

  useEffect(() => {
    const setActive = () => {
      setIputActive(true);
    };
    const setInActive = () => {
      setIputActive(false);
    };
    let textareaEl: HTMLTextAreaElement = document.querySelector(
      ".inputdialog-textarea"
    )!;
    if (show) {
      if (type == "renamePic") {
        setInputPlaceholder("请输入新的图片名称(不带文件后缀)");
        setInputTitle("重命名图片");
      }
      setInputVal("");
      textareaEl.addEventListener("focus", setActive);
      textareaEl.addEventListener("blur", setInActive);
    } else {
      textareaEl.removeEventListener("focus", setActive);
      textareaEl.removeEventListener("blur", setInActive);
    }

    return () => {
      textareaEl.removeEventListener("focus", setActive);
      textareaEl.removeEventListener("blur", setInActive);
    };
  }, [show]);

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`inputdialog-container${show ? " show" : ""}`}
        >
          <ConflictDialog
            conflictWidth={conflictWidth}
            conflictHeight={conflictHeight}
            conflictPath={conflictPath}
            show={conflictDialogShow}
            hide={hideConflictDialog}
          ></ConflictDialog>
          <div className="inputdialog-main">
            <p className="inputdialog-title">{inputTitle}</p>
            <div className={`inputdialog-form${inputActive ? " active" : ""}`}>
              <textarea
                spellCheck={false}
                autoComplete="off"
                value={inputVal}
                onChange={(e) => {
                  handleChange(e);
                }}
                className="inputdialog-textarea"
                placeholder={inputPlaceholder}
              ></textarea>
              <button
                onClick={applyVal}
                className={`inputdialog-btn${
                  picStore.renamePicLoading ? " loading" : ""
                }`}
              >
                <div className="inputdialog-btn-icon">
                  <SvgIcon
                    svgName="apply"
                    svgSize="22px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                </div>
                <div className="inputdialog-btn-loading">
                  <Loader width="20px"></Loader>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
};

export default InputDialog;

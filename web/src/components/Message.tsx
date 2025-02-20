import winStore from "../store/modules/win";
import { Observer } from "mobx-react";
import ReactDOM from "react-dom";
import "../styles/components/message.scss";

export default function Message() {
  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          className={`message-container${
            winStore.showMessage && winStore.messageList[0] ? " show" : ""
          }${
            winStore.messageList[0]
              ? " " + winStore.messageList[0].type
              : " success"
          }`}
        >
          {winStore.messageList[0] ? winStore.messageList[0].msg : ""}
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
}

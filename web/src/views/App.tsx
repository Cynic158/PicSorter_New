import { Observer } from "mobx-react";
import "../styles/app.scss";
import Header from "./Layout/Header";
import Viewer from "./Layout/Viewer";
import Controler from "./Layout/Controler";
import Message from "../components/Message";
import ErrorDialog from "../components/ErrorDialog";
import sortStore from "../store/modules/sort";
import picStore from "../store/modules/pic";
import { useEffect } from "react";
import settingStore from "../store/modules/setting";
import { useHotkeys } from "react-hotkeys-hook";

const UI = {
  Header,
  Viewer,
  Controler,
  Message,
  ErrorDialog,
};

export default function App() {
  const initDesk = () => {
    sortStore.getSortFolderList();
    picStore.getPicList(true);
    settingStore.getShortcut();
    picStore.setBaseStaticPath();
  };
  useEffect(() => {
    initDesk();

    return () => {};
  }, []);

  // 绑定快捷键
  useHotkeys("x", () => {
    settingStore.cutPics();
  });
  useHotkeys("c", () => {
    settingStore.copyPics();
  });
  useHotkeys("d", () => {
    settingStore.deletePics();
  });
  useHotkeys("ctrl+a", () => {
    settingStore.selectAllPics();
  });
  useHotkeys("shift+a", () => {
    settingStore.selectAllSorts();
  });

  // 处理 0-9
  useHotkeys(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], (event) => {
    settingStore.selectSortA(Number(event.key));
  });

  // 处理 q-p（对应 11-20）
  useHotkeys(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"], (event) => {
    const keyMap: any = {
      q: 11,
      w: 12,
      e: 13,
      r: 14,
      t: 15,
      y: 16,
      u: 17,
      i: 18,
      o: 19,
      p: 20,
    };
    settingStore.selectSortB(keyMap[event.key]);
  });

  return (
    <Observer>
      {() => (
        <div className="app-container">
          <UI.ErrorDialog></UI.ErrorDialog>
          <UI.Message></UI.Message>
          <UI.Header></UI.Header>
          <div className="app-main">
            <UI.Viewer></UI.Viewer>
            <UI.Controler></UI.Controler>
          </div>
        </div>
      )}
    </Observer>
  );
}

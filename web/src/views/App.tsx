import { Observer } from "mobx-react";
import "../styles/app.scss";
import Header from "./Layout/Header";
import Viewer from "./Layout/Viewer";
import Controler from "./Layout/Controler";
import Message from "../components/Message";
import ErrorDialog from "../components/ErrorDialog";
import sortStore from "../store/modules/sort";
import { useEffect } from "react";

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
  };
  useEffect(() => {
    initDesk();

    return () => {};
  }, []);

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

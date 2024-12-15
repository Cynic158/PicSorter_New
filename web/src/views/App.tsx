import { useObserver } from "mobx-react";
import "../styles/app.scss";
import Header from "./Layout/Header";
import Viewer from "./Layout/Viewer";
import Controler from "./Layout/Controler";

const UI = {
  Header,
  Viewer,
  Controler,
};

export default function App() {
  return useObserver(() => (
    <div className="app-container">
      <UI.Header></UI.Header>
      <div className="app-main">
        <UI.Viewer></UI.Viewer>
        <UI.Controler></UI.Controler>
      </div>
    </div>
  ));
}

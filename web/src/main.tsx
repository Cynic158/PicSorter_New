import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "./views/App";
import store from "./store";
import { Provider } from "mobx-react";
// svg配置
import "virtual:svg-icons-register";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider {...store}>
      <App />
    </Provider>
  </StrictMode>
);

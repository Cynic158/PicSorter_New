import "../../styles/layout/controler.scss";
import ControlerHeader from "./ControlerHeader";
import ControlerSort from "./ControlerSort";
import ControlerBtn from "./ControlerBtn";
import { Observer } from "mobx-react";
import sortStore from "../../store/modules/sort";
import SvgIcon from "../../components/SvgIcon";

const UI = {
  ControlerHeader,
  ControlerSort,
  ControlerBtn,
};

export default function Controler() {
  return (
    <Observer>
      {() => (
        <div
          className={`controler-container${
            !sortStore.showControler ? " hide" : ""
          }`}
        >
          <div
            className={`controler-fold-container${
              !sortStore.showControler ? " hide" : ""
            }`}
          >
            <div
              onClick={() => {
                sortStore.setShowControler(false);
              }}
              className="controler-fold"
            >
              <SvgIcon
                svgName="next"
                svgSize="20px"
                clickable={true}
                color="var(--color-white2)"
              ></SvgIcon>
            </div>
          </div>
          <UI.ControlerHeader></UI.ControlerHeader>
          <UI.ControlerSort></UI.ControlerSort>
          <UI.ControlerBtn></UI.ControlerBtn>
        </div>
      )}
    </Observer>
  );
}

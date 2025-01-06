import "../../styles/layout/viewer.scss";
import { Observer } from "mobx-react";
import sortStore from "../../store/modules/sort";
import SvgIcon from "../../components/SvgIcon";

export default function Viewer() {
  return (
    <Observer>
      {() => (
        <div
          className={`viewer-container${
            !sortStore.showControler ? " expend" : ""
          }`}
        >
          <div
            className={`viewer-controler-unfold-container${
              !sortStore.showControler ? " show" : ""
            }`}
          >
            <div
              onClick={() => {
                sortStore.setShowControler(true);
              }}
              className="viewer-controler-unfold"
            >
              <SvgIcon
                svgName="prev"
                svgSize="20px"
                clickable={true}
                color="var(--color-white2)"
              ></SvgIcon>
            </div>
          </div>
        </div>
      )}
    </Observer>
  );
}

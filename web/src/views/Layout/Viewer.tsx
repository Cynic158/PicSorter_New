import "../../styles/layout/viewer.scss";
import { Observer } from "mobx-react";
import sortStore from "../../store/modules/sort";
import SvgIcon from "../../components/SvgIcon";
import EmptyViewer from "../Viewer/EmptyViewer";
import DefaultViewer from "../Viewer/DefaultViewer";
import HorizontalViewer from "../Viewer/HorizontalViewer";
import VerticalViewer from "../Viewer/VerticalViewer";
import picStore from "../../store/modules/pic";

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
          {picStore.picList.length == 0 || picStore.picList[1] === null ? (
            <EmptyViewer></EmptyViewer>
          ) : (
            <>
              {picStore.viewMode == "view" ? (
                <DefaultViewer></DefaultViewer>
              ) : (
                <></>
              )}
              {picStore.viewMode == "horizontal" ? (
                <HorizontalViewer></HorizontalViewer>
              ) : (
                <></>
              )}
              {picStore.viewMode == "vertical" ? (
                <VerticalViewer></VerticalViewer>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      )}
    </Observer>
  );
}

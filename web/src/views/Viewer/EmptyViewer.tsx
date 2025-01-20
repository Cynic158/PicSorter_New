import SvgIcon from "../../components/SvgIcon";
import { Observer } from "mobx-react";
import "../../styles/viewer/emptyviewer.scss";
import picStore from "../../store/modules/pic";
import sortStore from "../../store/modules/sort";

export default function EmptyViewer() {
  return (
    <Observer>
      {() => (
        <div className="emptyviewer-container">
          <div className="emptyviewer-main">
            <div className="emptyviewer-icon">
              <SvgIcon svgName="logo" svgSize="240px"></SvgIcon>
            </div>
            {!sortStore.picFolderConfig.folderPath ? (
              // 没指定未分类存储时
              <div className="emptyviewer-desc">
                <span className="emptyviewer-title">
                  未指定未分类存储文件夹
                </span>
                <div className="emptyviewer-tip">
                  <span style={{ marginRight: "4px" }}>点击</span>
                  <SvgIcon
                    svgName="images"
                    svgSize="36px"
                    color="var(--color-white6)"
                  ></SvgIcon>
                  <span style={{ marginLeft: "4px" }}>
                    来指定存放了需要分类的图片的文件夹
                  </span>
                </div>
              </div>
            ) : (
              // 指定了存储，但是已经没有图片了
              <div className="emptyviewer-desc">
                {picStore.viewMode == "view" ? (
                  <span className="emptyviewer-title">
                    当前文件夹内已无需要分类的图片
                  </span>
                ) : (
                  <></>
                )}
                {picStore.viewMode == "horizontal" ? (
                  <span className="emptyviewer-title">
                    当前文件夹内已无需要分类的横向图片
                  </span>
                ) : (
                  <></>
                )}
                {picStore.viewMode == "vertical" ? (
                  <span className="emptyviewer-title">
                    当前文件夹内已无需要分类的纵向图片
                  </span>
                ) : (
                  <></>
                )}
                <div className="emptyviewer-tip">
                  <span style={{ marginRight: "4px" }}>点击</span>
                  <SvgIcon
                    svgName="images"
                    svgSize="36px"
                    color="var(--color-white6)"
                  ></SvgIcon>
                  <span style={{ marginLeft: "4px" }}>
                    来更换未分类存储文件夹
                  </span>
                  {picStore.viewMode == "horizontal" ? (
                    <>
                      <span style={{ marginRight: "4px" }}>或点击</span>
                      <SvgIcon
                        svgName="viewmode"
                        svgSize="36px"
                        color="var(--color-white6)"
                      ></SvgIcon>
                      <SvgIcon
                        svgName="verticalmode"
                        svgSize="36px"
                        color="var(--color-white6)"
                      ></SvgIcon>
                      <span>来切换预览模式</span>
                    </>
                  ) : (
                    <></>
                  )}
                  {picStore.viewMode == "vertical" ? (
                    <>
                      <span style={{ marginRight: "4px" }}>或点击</span>
                      <SvgIcon
                        svgName="viewmode"
                        svgSize="36px"
                        color="var(--color-white6)"
                      ></SvgIcon>
                      <SvgIcon
                        svgName="horizontalmode"
                        svgSize="36px"
                        color="var(--color-white6)"
                      ></SvgIcon>
                      <span>来切换预览模式</span>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Observer>
  );
}

import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import MainFolderDialog from "../Dialog/MainFolderDialog";
import { Observer } from "mobx-react";
import { useState } from "react";

export default function ControlerHeader() {
  const [mainFolderDialogShow, setMainFolderDialogShow] = useState(false);
  const showMainFolderDialog = () => {
    setMainFolderDialogShow(true);
  };
  const hideMainFolderDialog = () => {
    setMainFolderDialogShow(false);
  };

  return (
    <Observer>
      {() => (
        <div className="controler-header-container">
          <ul className="controler-header">
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="tool"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="viewmode"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="horizontalmode"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="verticalmode"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="newsort"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg delete"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="delete"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li className="controler-header-item">
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="fullselect"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <li
              onClick={() => {
                showMainFolderDialog();
              }}
              className="controler-header-item"
            >
              <div className="controler-header-item-bg"></div>
              <div className="controler-header-item-icon">
                <SvgIcon
                  svgName="info"
                  svgSize="20px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </li>
            <MainFolderDialog
              show={mainFolderDialogShow}
              hide={hideMainFolderDialog}
            ></MainFolderDialog>
          </ul>
        </div>
      )}
    </Observer>
  );
}

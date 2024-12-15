import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";

export default function ControlerHeader() {
  return (
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
          <div className="controler-header-item-bg"></div>
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
        <li className="controler-header-item">
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
      </ul>
    </div>
  );
}

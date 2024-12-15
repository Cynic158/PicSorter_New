import "../../styles/layout/header.scss";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import WinApi from "../../api/win";

export default function Header() {
  return (
    <div className="header-container">
      <div className="header-left">
        <div className="header-logo">
          <SvgIcon svgName="logo" svgSize="24px"></SvgIcon>
          <span>PicSorter</span>
        </div>
        <ul className="header-info">
          {/* 名称 */}
          <li className="header-info-item withicon">
            <TextOverflow
              truncatePosition="middle"
              text="20230610_013455.png"
            ></TextOverflow>
          </li>
          <li className="header-info-item icon">
            <SvgIcon
              svgName="edit"
              svgSize="22px"
              hover={true}
              hoverColor="var(--color-blue1)"
              color="var(--color-black3)"
              clickable={true}
            ></SvgIcon>
          </li>
          {/* 大小 */}
          <li className="header-info-item">1022KB</li>
          {/* 分辨率 */}
          <li className="header-info-item">45789 x 10234</li>
          {/* 类型 */}
          <li className="header-info-item">PNG</li>
          {/* 余数 */}
          <li className="header-info-item withicon">余 1245 张</li>
          {/* dpi、位深度、创建时间、修改时间、了解参数意义 */}
          <li className="header-info-item icon">
            <SvgIcon
              svgName="info"
              svgSize="22px"
              hover={true}
              hoverColor="var(--color-blue1)"
              color="var(--color-black3)"
              clickable={true}
            ></SvgIcon>
          </li>
        </ul>
      </div>
      <ul className="header-right">
        <li className="header-btn">
          <SvgIcon
            svgName="setting"
            svgSize="18px"
            color="var(--color-white2)"
          ></SvgIcon>
        </li>
        <li
          onClick={() => {
            WinApi.HIDE();
          }}
          className="header-btn"
        >
          <SvgIcon
            svgName="minimize"
            svgSize="16px"
            color="var(--color-white2)"
          ></SvgIcon>
        </li>
        <li
          onClick={() => {
            WinApi.MAX();
          }}
          className="header-btn"
        >
          <SvgIcon
            svgName="maximize"
            svgSize="16px"
            color="var(--color-white2)"
          ></SvgIcon>
        </li>
        <li
          onClick={() => {
            WinApi.QUIT();
          }}
          className="header-btn exit"
        >
          <SvgIcon
            svgName="exit"
            svgSize="16px"
            color="var(--color-white2)"
          ></SvgIcon>
        </li>
      </ul>
    </div>
  );
}

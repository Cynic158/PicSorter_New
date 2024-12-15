import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";

export default function ControlerBtn() {
  return (
    <div className="controler-btn-container">
      <div className="controler-btn">
        <div className="controler-btn-left">
          <button className="controler-btn-left-item">
            <SvgIcon
              svgName="cut"
              svgSize="24px"
              clickable={true}
              color="var(--color-white2)"
            ></SvgIcon>
          </button>
          <button className="controler-btn-left-item">
            <SvgIcon
              svgName="copy"
              svgSize="24px"
              clickable={true}
              color="var(--color-white2)"
            ></SvgIcon>
          </button>
        </div>
        <div className="controler-btn-right">
          <div className="controler-btn-right-item">
            <button className="controler-btn-right-item-left">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "3px",
                }}
              >
                <SvgIcon
                  svgName="images"
                  svgSize="22px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </button>
            <button className="controler-btn-right-item-right">
              <SvgIcon
                svgName="folder"
                svgSize="22px"
                clickable={true}
                color="var(--color-white2)"
              ></SvgIcon>
            </button>
          </div>
          <div className="controler-btn-right-item">
            <button className="controler-btn-right-item-left">
              <SvgIcon
                svgName="sort"
                svgSize="22px"
                clickable={true}
                color="var(--color-white2)"
              ></SvgIcon>
            </button>
            <button className="controler-btn-right-item-right">
              <SvgIcon
                svgName="folder"
                svgSize="22px"
                clickable={true}
                color="var(--color-white2)"
              ></SvgIcon>
            </button>
          </div>
          <div className="controler-btn-right-item">
            <button className="controler-btn-right-item-delete">
              <SvgIcon
                svgName="delete"
                svgSize="22px"
                clickable={true}
                color="var(--color-white2)"
              ></SvgIcon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

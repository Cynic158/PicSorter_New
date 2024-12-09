import { MouseEventHandler } from "react";

interface SvgIconProps {
  svgName: string;
  svgSize?: string;
  color?: string;
  onClick?: MouseEventHandler;
}

// svg组件
const SvgIcon: React.FC<SvgIconProps> = ({
  svgName,
  svgSize = "16px",
  color = "#fff",
  onClick = () => {},
}) => {
  const svgPrefixName = `#icon-${svgName}`;

  return (
    <div
      style={{
        width: svgSize,
        height: svgSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      {/* svg */}
      <svg
        style={{
          width: svgSize,
          height: svgSize,
        }}
      >
        <use xlinkHref={svgPrefixName} fill={color}></use>
      </svg>
    </div>
  );
};

export default SvgIcon;

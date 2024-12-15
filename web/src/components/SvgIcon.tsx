import { MouseEventHandler, useState } from "react";

interface SvgIconProps {
  svgName: string;
  svgSize?: string;
  color?: string;
  hover?: boolean;
  hoverColor?: string;
  clickable?: boolean;
  onClick?: MouseEventHandler;
}

// svg组件
const SvgIcon: React.FC<SvgIconProps> = ({
  svgName,
  svgSize = "16px",
  color = "#fff",
  hover = false,
  hoverColor = "#ccc",
  clickable = false,
  onClick = () => {},
}) => {
  const svgPrefixName = `#icon-${svgName}`;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    if (hover) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hover) setIsHovered(false);
  };

  return (
    <div
      style={{
        width: svgSize,
        height: svgSize,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: clickable ? "pointer" : "default",
      }}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* svg */}
      <svg
        style={{
          width: svgSize,
          height: svgSize,
        }}
      >
        <use
          style={{ transition: "all 0.3s ease" }}
          xlinkHref={svgPrefixName}
          fill={isHovered && hover ? hoverColor : color}
        ></use>
      </svg>
    </div>
  );
};

export default SvgIcon;

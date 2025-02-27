import "../styles/components/iconloader.scss";
import leftPart from "../assets/images/left.png";
import centerPart from "../assets/images/center.png";
import rightPart from "../assets/images/right.png";

export default function IconLoader() {
  return (
    <div className="iconloader-container">
      <img className="iconloader-icon left" src={leftPart} />
      <img className="iconloader-icon center" src={centerPart} />
      <img className="iconloader-icon right" src={rightPart} />
      <span>图片载入中</span>
    </div>
  );
}

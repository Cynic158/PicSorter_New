import "../../styles/layout/controler.scss";
import ControlerHeader from "./ControlerHeader";
import ControlerSort from "./ControlerSort";
import ControlerBtn from "./ControlerBtn";

const UI = {
  ControlerHeader,
  ControlerSort,
  ControlerBtn,
};

export default function Controler() {
  return (
    <div className="controler-container">
      <UI.ControlerHeader></UI.ControlerHeader>
      <UI.ControlerSort></UI.ControlerSort>
      <UI.ControlerBtn></UI.ControlerBtn>
    </div>
  );
}

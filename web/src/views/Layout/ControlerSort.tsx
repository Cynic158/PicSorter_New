import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import { useState } from "react";

export default function ControlerSort() {
  const temparr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [first, setfirst] = useState<Array<number>>([]);
  const tempclick = (index: number) => {
    let indexindex = first.indexOf(index);
    let arr = [...first];
    if (indexindex != -1) {
      arr.splice(indexindex, 1);
    } else {
      arr.push(index);
    }
    console.log(arr);

    setfirst(arr);
  };
  return (
    <div className="controler-sort-container">
      <div className="controler-sort-fold-container">
        <div className="controler-sort-fold">
          <SvgIcon
            svgName="next"
            svgSize="20px"
            clickable={true}
            color="var(--color-white2)"
          ></SvgIcon>
        </div>
      </div>
      <ul className="controler-sort">
        {temparr.map((item, index) => (
          <li
            onClick={() => {
              tempclick(index);
            }}
            className={`controler-sort-item-container${
              first.includes(index) ? " active" : ""
            }`}
          >
            <div className="controler-sort-item-bg"></div>
            <div className="controler-sort-item">
              <div className="controler-sort-item-top">
                <div className="controler-sort-item-top-left">
                  <SvgIcon
                    svgName="unselect"
                    svgSize="20px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                  <div className="name">
                    <TextOverflow text="分类文件夹"></TextOverflow>
                  </div>
                </div>
                <div className="controler-sort-item-top-right">
                  {/* <div className="top">
                    <SvgIcon
                      svgName="top"
                      svgSize="20px"
                      clickable={true}
                      color="var(--color-white2)"
                    ></SvgIcon>
                  </div> */}
                  <SvgIcon
                    svgName="setting"
                    svgSize="20px"
                    clickable={true}
                    color="var(--color-white2)"
                  ></SvgIcon>
                </div>
              </div>
              <div className="controler-sort-item-bottom">
                <span>1045 张</span>
                <span>1022 MB</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

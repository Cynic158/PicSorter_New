import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import sortStore from "../../store/modules/sort";
import { Observer } from "mobx-react";
import { getFileSize } from "../../utils";

export default function ControlerSort() {
  const applySelected = () => {
    sortStore.applySelected();
  };

  return (
    <Observer>
      {() => (
        <div className="controler-sort-container">
          <ul className="controler-sort">
            {sortStore.sortFolderList.map((item) => (
              <li
                key={item.name}
                onClick={() => {
                  sortStore.setSelectingSortList(item.name);
                }}
                className={`controler-sort-item-container${
                  sortStore.selectingSortList.includes(item.name)
                    ? " active"
                    : ""
                }`}
              >
                <div className="controler-sort-item-bg"></div>
                <div className="controler-sort-item">
                  <div className="controler-sort-item-top">
                    <div className="controler-sort-item-top-left">
                      <div
                        className={`icon unselect${
                          !sortStore.selectingSortList.includes(item.name) &&
                          !sortStore.selectedSortList.includes(item.name)
                            ? " active"
                            : ""
                        }`}
                      >
                        <SvgIcon
                          svgName="unselect"
                          svgSize="20px"
                          clickable={true}
                          color="var(--color-white2)"
                        ></SvgIcon>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          applySelected();
                        }}
                        className={`icon selected${
                          !sortStore.selectingSortList.includes(item.name) &&
                          sortStore.selectedSortList.includes(item.name)
                            ? " active"
                            : ""
                        }`}
                      >
                        <SvgIcon
                          svgName="selected"
                          svgSize="20px"
                          clickable={true}
                          color="var(--color-blue5)"
                        ></SvgIcon>
                      </div>
                      <div
                        className={`icon select${
                          sortStore.selectingSortList.includes(item.name)
                            ? " active"
                            : ""
                        }`}
                      >
                        <SvgIcon
                          svgName="select"
                          svgSize="20px"
                          clickable={true}
                          color="var(--color-white2)"
                        ></SvgIcon>
                      </div>

                      <div className="name">
                        <TextOverflow text={item.name}></TextOverflow>
                      </div>
                    </div>
                    <div className="controler-sort-item-top-right">
                      {item.top ? (
                        <div className="top">
                          <SvgIcon
                            svgName="top"
                            svgSize="20px"
                            clickable={true}
                            color="var(--color-white2)"
                          ></SvgIcon>
                        </div>
                      ) : (
                        <></>
                      )}
                      <SvgIcon
                        svgName="setting"
                        svgSize="20px"
                        clickable={true}
                        color="var(--color-white2)"
                      ></SvgIcon>
                    </div>
                  </div>
                  <div className="controler-sort-item-bottom">
                    <span>{item.count ? String(item.count) + " 张" : "-"}</span>
                    <span>{item.size ? getFileSize(item.size) : "-"}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Observer>
  );
}

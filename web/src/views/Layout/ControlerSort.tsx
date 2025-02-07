import "../../styles/layout/controler.scss";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import SortItemFolderDialog from "../Dialog/SortItemFolderDialog";
import sortStore from "../../store/modules/sort";
import { Observer } from "mobx-react";
import { getFileSize } from "../../utils";
import { useState } from "react";

export default function ControlerSort() {
  const applySelected = () => {
    sortStore.applySelected();
  };

  const [sortItemFolderDialogShow, setSortItemFolderDialogShow] =
    useState(false);
  const showSortItemFolderDialog = () => {
    setSortItemFolderDialogShow(true);
  };
  const hideSortItemFolderDialog = () => {
    setSortItemFolderDialogShow(false);
  };

  return (
    <Observer>
      {() => (
        <div className="controler-sort-container">
          <SortItemFolderDialog
            show={sortItemFolderDialogShow}
            hide={hideSortItemFolderDialog}
          ></SortItemFolderDialog>
          <div
            className={`controler-sort-setting${
              sortStore.sortItemSettingShow ? " show" : ""
            }`}
          >
            <div
              onClick={() => {
                sortStore.openSortItemFolder();
                sortStore.hideSortItemSetting();
              }}
              className="controler-sort-setting-item"
            >
              <span>打开文件夹</span>
              <div className="controler-sort-setting-item-icon">
                <SvgIcon
                  svgName="folder"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </div>
            <div
              onClick={() => {
                showSortItemFolderDialog();
                sortStore.hideSortItemSetting();
              }}
              className="controler-sort-setting-item"
            >
              <span>详细信息</span>
              <div className="controler-sort-setting-item-icon">
                <SvgIcon
                  svgName="info"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </div>
            <div className="controler-sort-setting-item">
              <span>重命名</span>
              <div className="controler-sort-setting-item-icon">
                <SvgIcon
                  svgName="edit"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </div>
            <div className="controler-sort-setting-item">
              <span>设为置顶</span>
              <div className="controler-sort-setting-item-icon">
                <SvgIcon
                  svgName="top"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </div>
            {/* <div className="controler-sort-setting-item">
                  <span>取消置顶</span>
                  <div className="controler-sort-setting-item-icon">
                    <SvgIcon
                      svgName="top"
                      svgSize="18px"
                      clickable={true}
                      color="var(--color-white2)"
                    ></SvgIcon>
                  </div>
                </div> */}
            <div className="controler-sort-setting-item">
              <span>自动重命名</span>
              <div className="controler-sort-setting-item-icon">
                <SvgIcon
                  svgName="auto"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </div>
            <div className="controler-sort-setting-item delete">
              <span>删除文件夹</span>
              <div className="controler-sort-setting-item-icon">
                <SvgIcon
                  svgName="delete"
                  svgSize="18px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </div>
            <div
              onClick={() => {
                sortStore.hideSortItemSetting();
              }}
              className="controler-sort-setting-item"
            >
              <span>取消</span>
              <div className="controler-sort-setting-item-icon padding">
                <SvgIcon
                  svgName="exit"
                  svgSize="14px"
                  clickable={true}
                  color="var(--color-white2)"
                ></SvgIcon>
              </div>
            </div>
          </div>
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
                      <div className="auto">
                        <SvgIcon
                          svgName="auto"
                          svgSize="18px"
                          clickable={true}
                          color="var(--color-white2)"
                        ></SvgIcon>
                      </div>
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
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          sortStore.showSortItemSetting(item.name);
                        }}
                        className="setting"
                      >
                        <SvgIcon
                          svgName="setting"
                          svgSize="20px"
                          clickable={true}
                          color="var(--color-white2)"
                        ></SvgIcon>
                      </div>
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

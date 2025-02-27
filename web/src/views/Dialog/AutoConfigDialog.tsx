import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Observer } from "mobx-react";
import settingStore from "../../store/modules/setting";
import "../../styles/dialog/autoconfigdialog.scss";
import Switcher from "../../components/Switcher";
import Inputer from "../../components/Inputer";
import Loader from "../../components/Loader";
import TextOverflow from "react-text-overflow";
import SvgIcon from "../../components/SvgIcon";
import {
  sortTypeForPic,
  formatType,
  generateFormatPreview,
} from "../../utils/config";
import { cloneDeep } from "lodash";
import winStore from "../../store/modules/win";
import sortStore from "../../store/modules/sort";

interface AutoConfigDialogProps {
  show: boolean;
  hide: () => void;
}

const AutoConfigDialog: React.FC<AutoConfigDialogProps> = ({ show, hide }) => {
  const closeDialog = () => {
    if (
      !settingStore.getAutoConfigLoading &&
      !settingStore.setAutoConfigLoading
    ) {
      hide();
    }
  };
  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (sortTypeSelect) {
      setSortTypeSelect(false);
    } else if (insertTypeSelect) {
      setInsertTypeSelect(false);
    } else {
      // 点击对话框外容器关闭对话框
      const el = document.querySelector(".autoconfigdialog-container");
      if (event.target == el) {
        closeDialog();
      }
    }
  };

  // 文件路径
  const [sortPath, setSortPath] = useState("");
  // 选择绑定
  const [sortTypeSelect, setSortTypeSelect] = useState(false);
  const [insertTypeSelect, setInsertTypeSelect] = useState(false);
  // 排序方式
  const [sortTypeVal, setSortTypeVal] = useState<SortTypeForPic>("nameAsc");
  const getSortTypeVal = (val: SortTypeForPic) => {
    let findName = Object.keys(sortTypeForPic).find(
      (key) => sortTypeForPic[key as SortNameTypeForPic].value == val
    )!;
    let desc = sortTypeForPic[findName as SortNameTypeForPic].desc;
    return findName + "（" + desc + "）";
  };
  // 分隔符
  const [separator, setSeparator] = useState<"-" | "_">("_");
  // 布尔值
  const [applyNew, setApplyNew] = useState(true);
  const [enable, setEnable] = useState(false);
  // 自动重命名格式数组
  const [format, setFormat] = useState<Array<FormatConfigType>>([]);
  const setFormatVal = (index: number, newVal: string) => {
    setFormat((prevFormat) =>
      prevFormat.map((item, i) =>
        i === index ? { ...item, value: newVal } : item
      )
    );
  };
  const insertFormatType = (type: FormatType) => {
    if (format.length == 10) {
      winStore.setMessage({
        type: "error",
        msg: "最多使用 10 个配置项",
      });
    } else {
      let cloneFormat = cloneDeep(format);
      cloneFormat.push({
        type: type,
        value: "",
      });
      setFormat(cloneFormat);
    }
  };
  const deleteFormatType = (index: number) => {
    let cloneFormat = cloneDeep(format);
    cloneFormat.splice(index, 1);
    setFormat(cloneFormat);
  };
  // 自动重命名预览数组
  const [preview, setPreview] = useState<[string[], string[], string[]]>([
    [],
    [],
    [],
  ]);
  const validPreview = () => {
    if (!sortPath) {
      winStore.setMessage({
        type: "error",
        msg: "分类文件夹路径缺失",
      });
      return false;
    } else if (format.length == 0) {
      winStore.setMessage({
        type: "error",
        msg: "请添加自动重命名配置项",
      });
      return false;
    } else if (
      format.filter((item) => item.type == "timestamp" || item.type == "serial")
        .length == 0
    ) {
      winStore.setMessage({
        type: "error",
        msg: "至少需要一个“时间戳”或者“序号”配置项",
      });
      return false;
    } else {
      let strFormatItems = format.filter((item) => item.type == "str");
      let conflict = false;
      let empty = false;
      let regexp = false;
      strFormatItems.forEach((item) => {
        if (item.value.includes(separator)) {
          conflict = true;
        }
        if (item.value == "") {
          empty = true;
        }
        if (/^[.]|[/\\:*?"<>|.]/.test(item.value)) {
          regexp = true;
        }
      });
      if (conflict) {
        winStore.setMessage({
          type: "error",
          msg: "固定字符配置项不能包含分隔符",
        });
        return false;
      } else if (empty) {
        winStore.setMessage({
          type: "error",
          msg: "固定字符配置项不能为空",
        });
        return false;
      } else if (regexp) {
        winStore.setMessage({
          type: "error",
          msg: '固定字符配置项不能包含字符\\/:*?"<>|.',
        });
        return false;
      } else {
        return true;
      }
    }
  };
  const getPreview = () => {
    let validRes = validPreview();
    if (validRes) {
      let res = generateFormatPreview(separator, sortTypeVal, format);
      setPreview(cloneDeep(res));
    }
  };

  const initDialog = (success: boolean, config?: AutoRenameConfig) => {
    if (success) {
      setSortPath(config!.path);
      setSortTypeVal(config!.sortType);
      setSeparator(config!.separator);
      setApplyNew(config!.applyNew);
      setEnable(config!.enable);
      setFormat(cloneDeep(config!.format));
      setPreview([[], [], []]);
    } else {
      setSortPath("");
      setSortTypeVal("nameAsc");
      setSeparator("_");
      setApplyNew(true);
      setEnable(false);
      setFormat([]);
      setPreview([[], [], []]);
    }
  };

  const submitConfig = async () => {
    if (
      !settingStore.getAutoConfigLoading &&
      !settingStore.setAutoConfigLoading
    ) {
      let validRes = validPreview();
      if (validRes) {
        let autoConfig: AutoRenameConfig = {
          path: sortPath,
          enable: enable,
          separator: separator,
          applyNew: applyNew,
          sortType: sortTypeVal,
          format: cloneDeep(format),
        };
        let res = await settingStore.setAutoConfig(cloneDeep(autoConfig));
        if (res) {
          winStore.setMessage({
            type: "success",
            msg: "配置成功",
          });
          closeDialog();
        }
      }
    }
  };

  useEffect(() => {
    if (!show) {
      settingStore.setAllowShortcut(true);
      setSortTypeSelect(false);
      setInsertTypeSelect(false);
    } else {
      settingStore.setAllowShortcut(false);
      settingStore.getAutoConfig().then((res) => {
        if (res.success) {
          initDialog(true, res.data as AutoRenameConfig);
        } else {
          initDialog(false);
        }
      });
    }

    return () => {
      setSortTypeSelect(false);
      setInsertTypeSelect(false);
    };
  }, [show]);

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`autoconfigdialog-container${show ? " show" : ""}`}
        >
          <div className="autoconfigdialog-main">
            <p className="autoconfigdialog-title">设置自动重命名配置</p>
            <div className="autoconfigdialog-form">
              <div className="autoconfigdialog-left">
                <div className="autoconfigdialog-form-item">
                  <span className="autoconfigdialog-form-item-label">
                    分类文件夹路径
                  </span>
                  <div className="autoconfigdialog-form-item-main">
                    <SvgIcon svgName="folder" svgSize="26px"></SvgIcon>
                    {sortPath ? (
                      <div
                        onClick={() => {
                          sortStore.openSortItemFolder();
                        }}
                        className="autoconfigdialog-form-item-main-path path"
                      >
                        <TextOverflow
                          truncatePosition="middle"
                          text={sortPath}
                        ></TextOverflow>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <span className="autoconfigdialog-form-item-tip">
                    当前自动重命名配置所指定的分类文件夹所在位置
                  </span>
                </div>
                <div className="autoconfigdialog-form-item">
                  <span className="autoconfigdialog-form-item-label">
                    自动重命名顺序
                  </span>
                  <div className="autoconfigdialog-form-item-main padding">
                    <SvgIcon
                      svgName="sorttype"
                      svgSize="20px"
                      color="var(--color-white6)"
                    ></SvgIcon>
                    <div className="autoconfigdialog-form-item-main-path">
                      <span
                        onClick={() => {
                          setSortTypeSelect(!sortTypeSelect);
                        }}
                      >
                        {getSortTypeVal(sortTypeVal)}
                      </span>
                    </div>
                  </div>
                  <span className="autoconfigdialog-form-item-tip">
                    参与自动重命名的图片排序好后再逐个重命名，自动重命名可避免出现分类冲突的情况
                  </span>
                </div>
                <div className="autoconfigdialog-form-item">
                  <span className="autoconfigdialog-form-item-label">
                    重命名分隔符
                  </span>
                  <div className="autoconfigdialog-form-item-main">
                    <SvgIcon
                      svgName="separator"
                      svgSize="26px"
                      color="var(--color-white6)"
                    ></SvgIcon>
                    <div className="autoconfigdialog-form-item-main-path">
                      {separator == "-" ? (
                        <span
                          onClick={() => {
                            setSeparator("_");
                          }}
                        >
                          {"减号 -"}
                        </span>
                      ) : (
                        <span
                          onClick={() => {
                            setSeparator("-");
                          }}
                        >
                          {"下划线 _"}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="autoconfigdialog-form-item-tip">
                    分隔各个自动重命名配置项的字符
                  </span>
                </div>
                <div className="autoconfigdialog-form-item">
                  <span className="autoconfigdialog-form-item-label">
                    是否仅重命名新图片
                  </span>
                  <div className="autoconfigdialog-form-item-main lockpadding">
                    <SvgIcon
                      svgName="lock"
                      svgSize="24px"
                      color="var(--color-white6)"
                    ></SvgIcon>
                    <div className="autoconfigdialog-form-item-main-switch">
                      <Switcher
                        value={applyNew}
                        setValue={() => {
                          setApplyNew(!applyNew);
                        }}
                      ></Switcher>
                    </div>
                  </div>
                  <span className="autoconfigdialog-form-item-tip">
                    如果是，那么仅自动重命名操作中的图片，分类文件夹内已存在的图片不会参与自动重命名
                  </span>
                </div>
                <div className="autoconfigdialog-form-item">
                  <span className="autoconfigdialog-form-item-label">
                    是否启用重命名配置
                  </span>
                  <div className="autoconfigdialog-form-item-main autopadding">
                    <SvgIcon
                      svgName="auto"
                      svgSize="22px"
                      color="var(--color-white6)"
                    ></SvgIcon>
                    <div className="autoconfigdialog-form-item-main-switch">
                      <Switcher
                        value={enable}
                        setValue={() => {
                          setEnable(!enable);
                        }}
                      ></Switcher>
                    </div>
                  </div>
                  <span className="autoconfigdialog-form-item-tip">
                    启用后，分类到该文件夹内的图片会按照配置自动重命名，文件夹内图片较多时，分类耗时增加
                  </span>
                </div>
              </div>
              <div className="autoconfigdialog-center">
                <p className="autoconfigdialog-center-title">
                  <span>自动重命名配置</span>
                  <span
                    onClick={() => {
                      setInsertTypeSelect(!insertTypeSelect);
                    }}
                    className="autoconfigdialog-center-title-btn"
                  >
                    添加项
                  </span>
                </p>
                <span className="autoconfigdialog-center-tip">
                  必须选择至少一个“时间戳”或者“序号”项来保证自动重命名唯一性
                </span>
                {format.map((item, index) => (
                  <div
                    key={index}
                    className="autoconfigdialog-center-item-container"
                  >
                    <span className="autoconfigdialog-center-item">
                      {
                        formatType.find(
                          (typeItem) => typeItem.value == item.type
                        )?.title
                      }
                    </span>
                    {item.type == "str" ? (
                      <Inputer
                        placeholder="请输入字符"
                        value={item.value}
                        setValue={(newVal) => {
                          setFormatVal(index, newVal);
                        }}
                      ></Inputer>
                    ) : (
                      <></>
                    )}
                    <button
                      onClick={() => {
                        deleteFormatType(index);
                      }}
                      className="autoconfigdialog-center-item-btn"
                    >
                      <SvgIcon
                        svgName="delete"
                        svgSize="18px"
                        clickable={true}
                        color="var(--color-white2)"
                      ></SvgIcon>
                    </button>
                  </div>
                ))}
              </div>
              <div className="autoconfigdialog-right">
                <div className="autoconfigdialog-right-main">
                  <p className="autoconfigdialog-right-title">
                    <span>自动重命名预览</span>
                    <span
                      onClick={getPreview}
                      className="autoconfigdialog-right-title-btn"
                    >
                      生成预览
                    </span>
                  </p>
                  {preview[0].length > 0 ? (
                    <div className="autoconfigdialog-right-scroll-container">
                      <div className="autoconfigdialog-right-scroll">
                        <div className="autoconfigdialog-right-scroll-item-container">
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[0][0]}
                          </span>
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[0][1]}
                          </span>
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[0][2]}
                          </span>
                        </div>

                        <div className="autoconfigdialog-right-scroll-step">
                          <SvgIcon
                            svgName="step"
                            svgSize="26px"
                            color="var(--color-white6)"
                          ></SvgIcon>
                          <span>排序后</span>
                          <SvgIcon
                            svgName="step"
                            svgSize="26px"
                            color="var(--color-white6)"
                          ></SvgIcon>
                        </div>

                        <div className="autoconfigdialog-right-scroll-item-container">
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[1][0]}
                          </span>
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[1][1]}
                          </span>
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[1][2]}
                          </span>
                        </div>

                        <div className="autoconfigdialog-right-scroll-step">
                          <SvgIcon
                            svgName="step"
                            svgSize="26px"
                            color="var(--color-white6)"
                          ></SvgIcon>
                          <span>重命名后</span>
                          <SvgIcon
                            svgName="step"
                            svgSize="26px"
                            color="var(--color-white6)"
                          ></SvgIcon>
                        </div>

                        <div className="autoconfigdialog-right-scroll-item-container">
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[2][0]}
                          </span>
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[2][1]}
                          </span>
                          <span className="autoconfigdialog-right-scroll-item">
                            {preview[2][2]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
                <button
                  onClick={submitConfig}
                  className={`autoconfigdialog-right-btn${
                    settingStore.getAutoConfigLoading ||
                    settingStore.setAutoConfigLoading
                      ? " loading"
                      : ""
                  }`}
                >
                  <span className="autoconfigdialog-right-btn-text">
                    设置完成
                  </span>
                  <div className="autoconfigdialog-right-btn-loading">
                    <Loader width="20px"></Loader>
                  </div>
                </button>
              </div>
            </div>

            <ul
              className={`autoconfigdialog-form-sort-select${
                sortTypeSelect ? " show" : ""
              }`}
            >
              {Object.keys(sortTypeForPic).map((key) => (
                <li
                  onClick={() => {
                    setSortTypeVal(
                      sortTypeForPic[key as SortNameTypeForPic].value
                    );
                  }}
                  key={sortTypeForPic[key as SortNameTypeForPic].value}
                  className={`autoconfigdialog-form-sort-select-item${
                    sortTypeForPic[key as SortNameTypeForPic].value ==
                    sortTypeVal
                      ? " active"
                      : ""
                  }`}
                >
                  {key}
                </li>
              ))}
            </ul>
            <ul
              className={`autoconfigdialog-form-format-select${
                insertTypeSelect ? " show" : ""
              }`}
            >
              {formatType.map((item) => (
                <li
                  onClick={() => {
                    insertFormatType(item.value);
                  }}
                  key={item.value}
                  className="autoconfigdialog-form-format-select-item"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Observer>,
    document.getElementById("root")!
  );
};

export default AutoConfigDialog;

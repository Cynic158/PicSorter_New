import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import SvgIcon from "../../components/SvgIcon";
import TextOverflow from "react-text-overflow";
import { Observer } from "mobx-react";
import { cloneDeep } from "lodash";
import "../../styles/dialog/picfolderdialog.scss";
import { sortTypeForPic } from "../../utils/config";
import sortStore from "../../store/modules/sort";
import winStore from "../../store/modules/win";
import Loader from "../../components/Loader";
import Switcher from "../../components/Switcher";
import Inputer from "../../components/Inputer";
import ReactFlatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { Mandarin } from "flatpickr/dist/l10n/zh.js"; // 导入中文语言包
import picStore from "../../store/modules/pic";
import { getFileSizeArr, getFileSizeNumber } from "../../utils";

Mandarin.months.shorthand = [
  "1 月",
  "2 月",
  "3 月",
  "4 月",
  "5 月",
  "6 月",
  "7 月",
  "8 月",
  "9 月",
  "10 月",
  "11 月",
  "12 月",
];
Mandarin.months.longhand = [
  "1 月",
  "2 月",
  "3 月",
  "4 月",
  "5 月",
  "6 月",
  "7 月",
  "8 月",
  "9 月",
  "10 月",
  "11 月",
  "12 月",
];

interface PicFolderDialogProps {
  show: boolean;
  hide: () => void;
}

const PicFolderDialog: React.FC<PicFolderDialogProps> = ({ show, hide }) => {
  const [sortTypeSelect, setSortTypeSelect] = useState(false);
  const [editingPicFolderConfig, setEditingPicFolderConfig] =
    useState<PicFolderConfigType>({
      folderPath: "",
      sortType: "nameAsc",
      deep: false,
      selectConfig: {
        name: {
          type: "all",
          value: "",
        },
        size: {
          type: "all",
          value: 0,
        },
        fileType: ["png", "jpg", "gif", "webp"],
        resolution: {
          width: {
            type: "all",
            value: 0,
          },
          height: {
            type: "all",
            value: 0,
          },
        },
        createdAt: {
          type: "all",
          value: 0,
        },
        modifiedAt: {
          type: "all",
          value: 0,
        },
      },
    });
  const [selectNameType, setSelectNameType] = useState<selectNameType>("all");
  const [selectName, setSelectName] = useState("");
  const [selectSizeType, setSelectSizeType] = useState<selectNumberType>("all");
  const [selectSize, setSelectSize] = useState("");
  const [selectSizeUnit, setSelectSizeUnit] = useState<sizeType>("KB");
  const [selectSizeRange, setSelectSizeRange] = useState(["", ""]);
  const setSizeRangeStart = (val: string) => {
    setSelectSizeRange([val, selectSizeRange[1]]);
  };
  const setSizeRangeEnd = (val: string) => {
    setSelectSizeRange([selectSizeRange[0], val]);
  };
  const [selectSizeRangeUnit, setSelectSizeRangeUnit] = useState<
    Array<sizeType>
  >(["KB", "KB"]);
  const fileType: Array<picType> = ["png", "jpg", "gif", "webp"];
  const [selectFileType, setSelectFileType] = useState<Array<picType>>([
    "png",
    "jpg",
    "gif",
    "webp",
  ]);
  const setFileType = (type: picType) => {
    let cloneFileType = cloneDeep(selectFileType);
    if (selectFileType.includes(type)) {
      setSelectFileType(cloneFileType.filter((item) => item != type));
    } else {
      cloneFileType.push(type);
      setSelectFileType(cloneFileType);
    }
  };
  const [selectResolutionWidthType, setSelectResolutionWidthType] =
    useState<selectNumberType>("all");
  const [selectResolutionWidth, setSelectResolutionWidth] = useState("");
  const [selectResolutionWidthRange, setSelectResolutionWidthRange] = useState([
    "",
    "",
  ]);
  const setResolutionWidthRangeStart = (val: string) => {
    setSelectResolutionWidthRange([val, selectResolutionWidthRange[1]]);
  };
  const setResolutionWidthRangeEnd = (val: string) => {
    setSelectResolutionWidthRange([selectResolutionWidthRange[0], val]);
  };
  const [selectResolutionHeightType, setSelectResolutionHeightType] =
    useState<selectNumberType>("all");
  const [selectResolutionHeight, setSelectResolutionHeight] = useState("");
  const [selectResolutionHeightRange, setSelectResolutionHeightRange] =
    useState(["", ""]);
  const setResolutionHeightRangeStart = (val: string) => {
    setSelectResolutionHeightRange([val, selectResolutionHeightRange[1]]);
  };
  const setResolutionHeightRangeEnd = (val: string) => {
    setSelectResolutionHeightRange([selectResolutionHeightRange[0], val]);
  };
  const [selectCreatedAtType, setSelectCreatedAtType] =
    useState<selectDateType>("all");
  const [createAt, setCreateAt] = useState(new Date());
  const [createAtRange, setCreateAtRange] = useState([new Date(), new Date()]);
  const setCreateAtRangeStart = (val: Date) => {
    setCreateAtRange([val, createAtRange[1]]);
  };
  const setCreateAtRangeEnd = (val: Date) => {
    setCreateAtRange([createAtRange[0], val]);
  };
  const [selectModifiedAtType, setSelectModifiedAtType] =
    useState<selectDateType>("all");
  const [modifiedAt, setModifiedAt] = useState(new Date());
  const [modifiedAtRange, setModifiedAtRange] = useState([
    new Date(),
    new Date(),
  ]);
  const setModifiedAtRangeStart = (val: Date) => {
    setModifiedAtRange([val, modifiedAtRange[1]]);
  };
  const setModifiedAtRangeEnd = (val: Date) => {
    setModifiedAtRange([modifiedAtRange[0], val]);
  };

  const [gettingPath, setGettingPath] = useState(false);
  const closeDialog = () => {
    if (!sortStore.picFolderPathLoading && !picStore.picListLoading) {
      if (gettingPath) {
        winStore.setMessage({
          msg: "请完成未分类文件夹路径选择",
          type: "error",
        });
      } else {
        hide();
      }
    }
  };
  const setFolderPath = async () => {
    if (!gettingPath) {
      setGettingPath(true);
      let res = await sortStore.getPicFolderPath(
        editingPicFolderConfig.folderPath
      );
      if (res) {
        let config = cloneDeep(editingPicFolderConfig);
        config.folderPath = res;
        setEditingPicFolderConfig(config);
      }
      setGettingPath(false);
    }
  };
  const setSortType = (type: SortTypeForPic) => {
    let config = cloneDeep(editingPicFolderConfig);
    config.sortType = type;
    setEditingPicFolderConfig(config);
  };
  const setDeep = () => {
    let config = cloneDeep(editingPicFolderConfig);
    config.deep = !config.deep;
    setEditingPicFolderConfig(config);
  };
  const setSelectForm = (cloneConfig: SelectConfigType) => {
    setSelectNameType(cloneConfig.name.type);
    setSelectSizeType(cloneConfig.size.type);
    setSelectFileType(cloneConfig.fileType);
    setSelectResolutionWidthType(cloneConfig.resolution.width.type);
    setSelectResolutionHeightType(cloneConfig.resolution.height.type);
    setSelectCreatedAtType(cloneConfig.createdAt.type);
    setSelectModifiedAtType(cloneConfig.modifiedAt.type);

    if (cloneConfig.name.type == "all") {
      setSelectName("");
    } else {
      setSelectName(cloneConfig.name.value);
    }

    if (cloneConfig.size.type == "all") {
      setSelectSize("");
      setSelectSizeUnit("KB");
      setSelectSizeRange(["", ""]);
      setSelectSizeRangeUnit(["KB", "KB"]);
    } else if (cloneConfig.size.type == "range") {
      setSelectSize("");
      setSelectSizeUnit("KB");
      let sizeStartArr = getFileSizeArr(
        (cloneConfig.size.value as Array<number>)[0]
      );
      let sizeEndArr = getFileSizeArr(
        (cloneConfig.size.value as Array<number>)[1]
      );
      setSelectSizeRange([sizeStartArr[0], sizeEndArr[0]]);
      setSelectSizeRangeUnit([sizeStartArr[1], sizeEndArr[1]]);
    } else {
      let sizeArr = getFileSizeArr(cloneConfig.size.value as number);
      setSelectSize(sizeArr[0]);
      setSelectSizeUnit(sizeArr[1]);
      setSelectSizeRange(["", ""]);
      setSelectSizeRangeUnit(["KB", "KB"]);
    }

    if (cloneConfig.resolution.width.type == "all") {
      setSelectResolutionWidth("");
      setSelectResolutionWidthRange(["", ""]);
    } else if (cloneConfig.resolution.width.type == "range") {
      setSelectResolutionWidth("");
      let [start, end] = cloneConfig.resolution.width.value as Array<number>;
      setSelectResolutionWidthRange([
        start ? String(start) : "",
        end ? String(end) : "",
      ]);
    } else {
      setSelectResolutionWidth(
        String((cloneConfig.resolution.width.value as number) || "")
      );
      setSelectResolutionWidthRange(["", ""]);
    }
    if (cloneConfig.resolution.height.type == "all") {
      setSelectResolutionHeight("");
      setSelectResolutionHeightRange(["", ""]);
    } else if (cloneConfig.resolution.height.type == "range") {
      setSelectResolutionHeight("");
      let [start, end] = cloneConfig.resolution.height.value as Array<number>;
      setSelectResolutionHeightRange([
        start ? String(start) : "",
        end ? String(end) : "",
      ]);
    } else {
      setSelectResolutionHeight(
        String((cloneConfig.resolution.height.value as number) || "")
      );
      setSelectResolutionHeightRange(["", ""]);
    }

    if (cloneConfig.createdAt.type == "range") {
      setCreateAt(new Date());
      let [start, end] = cloneConfig.createdAt.value as Array<number>;
      setCreateAtRange([
        start ? new Date(start) : new Date(),
        end ? new Date(end) : new Date(),
      ]);
    } else {
      let date = cloneConfig.createdAt.value as number;
      setCreateAt(date ? new Date(date) : new Date());
      setCreateAtRange([new Date(), new Date()]);
    }
    if (cloneConfig.modifiedAt.type == "range") {
      setModifiedAt(new Date());
      let [start, end] = cloneConfig.modifiedAt.value as Array<number>;
      setModifiedAtRange([
        start ? new Date(start) : new Date(),
        end ? new Date(end) : new Date(),
      ]);
    } else {
      let date = cloneConfig.modifiedAt.value as number;
      setModifiedAt(date ? new Date(date) : new Date());
      setModifiedAtRange([new Date(), new Date()]);
    }
  };
  const clearSelectForm = () => {
    setSelectNameType("all");
    setSelectName("");
    setSelectSizeType("all");
    setSelectSize("");
    setSelectSizeUnit("KB");
    setSelectSizeRange(["", ""]);
    setSelectSizeRangeUnit(["KB", "KB"]);
    setSelectFileType(cloneDeep(fileType));
    setSelectResolutionWidthType("all");
    setSelectResolutionWidth("");
    setSelectResolutionWidthRange(["", ""]);
    setSelectResolutionHeightType("all");
    setSelectResolutionHeight("");
    setSelectResolutionHeightRange(["", ""]);
    setSelectCreatedAtType("all");
    setCreateAt(new Date());
    setCreateAtRange([new Date(), new Date()]);
    setSelectModifiedAtType("all");
    setModifiedAt(new Date());
    setModifiedAtRange([new Date(), new Date()]);
  };
  const setPicConfig = async () => {
    if (!sortStore.picFolderPathLoading && !picStore.picListLoading) {
      let validateRes = validateConfig();
      if (!validateRes[0]) {
        winStore.setMessage({
          msg: validateRes[1],
          type: "error",
        });
      } else {
        // 通过校验
        let clonePicFolderConfig = cloneDeep(editingPicFolderConfig);

        clonePicFolderConfig.selectConfig.name.type = selectNameType;
        if (selectNameType == "all") {
          clonePicFolderConfig.selectConfig.name.value = "";
        } else {
          clonePicFolderConfig.selectConfig.name.value = selectName;
        }

        clonePicFolderConfig.selectConfig.size.type = selectSizeType;
        if (selectSizeType == "all") {
          clonePicFolderConfig.selectConfig.size.value = 0;
        } else if (selectSizeType == "range") {
          let startNum = getFileSizeNumber(
            selectSizeRange[0],
            selectSizeRangeUnit[0]
          );
          let endNum = getFileSizeNumber(
            selectSizeRange[1],
            selectSizeRangeUnit[1]
          );
          if (startNum < endNum) {
            clonePicFolderConfig.selectConfig.size.value = [startNum, endNum];
          } else {
            clonePicFolderConfig.selectConfig.size.value = [endNum, startNum];
          }
        } else {
          let size = getFileSizeNumber(selectSize, selectSizeUnit);
          clonePicFolderConfig.selectConfig.size.value = size;
        }

        clonePicFolderConfig.selectConfig.fileType = cloneDeep(selectFileType);

        clonePicFolderConfig.selectConfig.resolution.width.type =
          selectResolutionWidthType;
        if (selectResolutionWidthType == "all") {
          clonePicFolderConfig.selectConfig.resolution.width.value = 0;
        } else if (selectResolutionWidthType == "range") {
          let startNum = Number(selectResolutionWidthRange[0]);
          let endNum = Number(selectResolutionWidthRange[1]);
          if (startNum < endNum) {
            clonePicFolderConfig.selectConfig.resolution.width.value = [
              startNum,
              endNum,
            ];
          } else {
            clonePicFolderConfig.selectConfig.resolution.width.value = [
              endNum,
              startNum,
            ];
          }
        } else {
          clonePicFolderConfig.selectConfig.resolution.width.value = Number(
            selectResolutionWidth
          );
        }

        clonePicFolderConfig.selectConfig.resolution.height.type =
          selectResolutionHeightType;
        if (selectResolutionHeightType == "all") {
          clonePicFolderConfig.selectConfig.resolution.height.value = 0;
        } else if (selectResolutionHeightType == "range") {
          let startNum = Number(selectResolutionHeightRange[0]);
          let endNum = Number(selectResolutionHeightRange[1]);
          if (startNum < endNum) {
            clonePicFolderConfig.selectConfig.resolution.height.value = [
              startNum,
              endNum,
            ];
          } else {
            clonePicFolderConfig.selectConfig.resolution.height.value = [
              endNum,
              startNum,
            ];
          }
        } else {
          clonePicFolderConfig.selectConfig.resolution.height.value = Number(
            selectResolutionHeight
          );
        }

        clonePicFolderConfig.selectConfig.createdAt.type = selectCreatedAtType;
        if (selectCreatedAtType == "all") {
          clonePicFolderConfig.selectConfig.createdAt.value = 0;
        } else if (selectCreatedAtType == "range") {
          let startNum = createAtRange[0].getTime();
          let endNum = createAtRange[1].getTime();
          if (startNum < endNum) {
            clonePicFolderConfig.selectConfig.createdAt.value = [
              startNum,
              endNum,
            ];
          } else {
            clonePicFolderConfig.selectConfig.createdAt.value = [
              endNum,
              startNum,
            ];
          }
        } else {
          clonePicFolderConfig.selectConfig.createdAt.value =
            createAt.getTime();
        }

        clonePicFolderConfig.selectConfig.modifiedAt.type =
          selectModifiedAtType;
        if (selectModifiedAtType == "all") {
          clonePicFolderConfig.selectConfig.modifiedAt.value = 0;
        } else if (selectModifiedAtType == "range") {
          let startNum = modifiedAtRange[0].getTime();
          let endNum = modifiedAtRange[1].getTime();
          if (startNum < endNum) {
            clonePicFolderConfig.selectConfig.modifiedAt.value = [
              startNum,
              endNum,
            ];
          } else {
            clonePicFolderConfig.selectConfig.modifiedAt.value = [
              endNum,
              startNum,
            ];
          }
        } else {
          clonePicFolderConfig.selectConfig.modifiedAt.value =
            modifiedAt.getTime();
        }

        let res = await sortStore.setPicFolderPath(clonePicFolderConfig);
        if (res) {
          winStore.setMessage({
            msg: "设置成功",
            type: "success",
          });
          closeDialog();
        }
      }
    }
  };

  const validateNumber = (
    name: string,
    config: {
      type: selectNumberType;
      value: string;
      rangeValue: Array<string>;
    },
    float: boolean = false
  ): [boolean, string] => {
    const IntRegex = /^[1-9][0-9]*$/;
    const FloatRegex = /^(?:[1-9][0-9]*|0(?:\\.\\d+))$/;
    if (config.type == "all") {
      return [true, ""];
    } else if (config.type == "gt" || config.type == "lt") {
      if (float) {
        // 正数允许有小数
        if (FloatRegex.test(config.value)) {
          return [true, ""];
        } else {
          return [false, "请输入正确的" + name + "筛选值"];
        }
      } else {
        // 仅正数
        if (IntRegex.test(config.value)) {
          return [true, ""];
        } else {
          return [false, "请输入正确的" + name + "筛选值"];
        }
      }
    } else {
      if (float) {
        if (
          FloatRegex.test(config.rangeValue[0]) &&
          FloatRegex.test(config.rangeValue[1]) &&
          config.rangeValue[0] != config.rangeValue[1]
        ) {
          return [true, ""];
        } else {
          return [false, "请输入正确的" + name + "筛选范围值"];
        }
      } else {
        if (
          IntRegex.test(config.rangeValue[0]) &&
          IntRegex.test(config.rangeValue[1]) &&
          config.rangeValue[0] != config.rangeValue[1]
        ) {
          return [true, ""];
        } else {
          return [false, "请输入正确的" + name + "筛选范围值"];
        }
      }
    }
  };
  const validateDate = (
    dateRange: Array<Date>,
    name: string
  ): [boolean, string] => {
    // 提取日期的年、月、日
    const [startDate, endDate] = dateRange;

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth(); // 月份从0开始
    const startDay = startDate.getDate();

    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endDay = endDate.getDate();

    // 校验年、月、日是否相同
    if (
      startYear === endYear &&
      startMonth === endMonth &&
      startDay === endDay
    ) {
      return [false, "请选择正确的" + name + "筛选范围值"];
    }

    return [true, ""];
  };
  const validateConfig = (): [boolean, string] => {
    if (!editingPicFolderConfig.folderPath) {
      return [false, "请选择未分类文件夹路径"];
    } else if (selectNameType != "all" && !selectName) {
      return [false, "请输入名称筛选值"];
    } else {
      let sizeRes = validateNumber(
        "大小",
        {
          type: selectSizeType,
          value: selectSize,
          rangeValue: selectSizeRange,
        },
        true
      );
      if (!sizeRes[0]) {
        return sizeRes;
      }
      if (!selectFileType.length) {
        return [false, "请至少保留一种类型"];
      }
      let resolutionWidthRes = validateNumber("分辨率宽度", {
        type: selectResolutionWidthType,
        value: selectResolutionWidth,
        rangeValue: selectResolutionWidthRange,
      });
      if (!resolutionWidthRes[0]) {
        return resolutionWidthRes;
      }
      let resolutionHeightRes = validateNumber("分辨率高度", {
        type: selectResolutionHeightType,
        value: selectResolutionHeight,
        rangeValue: selectResolutionHeightRange,
      });
      if (!resolutionHeightRes[0]) {
        return resolutionHeightRes;
      }
      if (selectCreatedAtType == "range") {
        let createAtRes = validateDate(createAtRange, "创建时间");
        if (!createAtRes[0]) {
          return createAtRes;
        }
      }
      if (selectModifiedAtType == "range") {
        let modifiedAtRes = validateDate(modifiedAtRange, "修改时间");
        if (!modifiedAtRes[0]) {
          return modifiedAtRes;
        }
      }
    }

    return [true, ""];
  };

  const maskClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (sortTypeSelect) {
      setSortTypeSelect(false);
    } else {
      // 点击对话框外容器关闭对话框
      const el = document.querySelector(".picfolderdialog-container");
      if (event.target == el) {
        closeDialog();
      }
    }
  };

  useEffect(() => {
    if (!show) {
      setSortTypeSelect(false);
    } else {
      let cloneRes = cloneDeep(sortStore.picFolderConfig);
      setEditingPicFolderConfig(cloneRes);
      setSelectForm(cloneRes.selectConfig);
    }

    return () => {
      setSortTypeSelect(false);
    };
  }, [show]);

  return ReactDOM.createPortal(
    <Observer>
      {() => (
        <div
          onClick={(event) => {
            maskClick(event);
          }}
          className={`picfolderdialog-container${show ? " show" : ""}${
            sortStore.picFolderPathLoading || picStore.picListLoading
              ? " loading"
              : ""
          }`}
        >
          <div className="picfolderdialog-main">
            <div className="picfolderdialog-block"></div>
            <p className="picfolderdialog-title">设置未分类存储</p>
            <div className="picfolderdialog-form-container">
              <div className="picfolderdialog-form">
                <div className="picfolderdialog-form-item">
                  <span className="picfolderdialog-form-item-label">
                    未分类文件夹路径
                  </span>
                  <div
                    onClick={() => {
                      if (
                        !sortStore.picFolderPathLoading &&
                        !picStore.picListLoading
                      ) {
                        setFolderPath();
                      }
                    }}
                    className="picfolderdialog-form-item-main"
                  >
                    <SvgIcon
                      svgName="folder"
                      svgSize="26px"
                      clickable={true}
                    ></SvgIcon>
                    <div className="picfolderdialog-form-item-main-path">
                      <TextOverflow
                        truncatePosition="middle"
                        text={
                          editingPicFolderConfig.folderPath
                            ? editingPicFolderConfig.folderPath
                            : "点我来选择路径"
                        }
                      ></TextOverflow>
                    </div>
                  </div>
                  <span className="picfolderdialog-form-item-tip">
                    存放了一堆未分类图片的文件夹路径
                  </span>
                </div>

                <div className="picfolderdialog-form-item">
                  <span className="picfolderdialog-form-item-label">
                    预览图片队列排序方式
                  </span>
                  <div
                    onClick={() => {
                      if (
                        !sortStore.picFolderPathLoading &&
                        !picStore.picListLoading
                      ) {
                        setSortTypeSelect(!sortTypeSelect);
                      }
                    }}
                    className="picfolderdialog-form-item-main padding"
                  >
                    <SvgIcon
                      svgName="sorttype"
                      svgSize="20px"
                      clickable={true}
                      color="var(--color-white6)"
                    ></SvgIcon>
                    <div className="picfolderdialog-form-item-main-path">
                      <TextOverflow
                        text={
                          Object.keys(sortTypeForPic).find(
                            (key) =>
                              sortTypeForPic[key as SortNameTypeForPic].value ==
                              editingPicFolderConfig.sortType
                          )!
                        }
                      ></TextOverflow>
                    </div>
                  </div>
                  <span className="picfolderdialog-form-item-tip">
                    {"预览图片时的图片先后顺序: " +
                      sortTypeForPic[
                        Object.keys(sortTypeForPic).find(
                          (key) =>
                            sortTypeForPic[key as SortNameTypeForPic].value ==
                            editingPicFolderConfig.sortType
                        ) as SortNameTypeForPic
                      ].desc}
                  </span>
                </div>

                <div className="picfolderdialog-form-item">
                  <span className="picfolderdialog-form-item-label">
                    是否穿透
                  </span>
                  <div className="picfolderdialog-form-item-main">
                    <SvgIcon
                      svgName="across"
                      svgSize="26px"
                      color="var(--color-white6)"
                    ></SvgIcon>
                    <div className="picfolderdialog-form-item-switch">
                      <Switcher
                        value={editingPicFolderConfig.deep}
                        setValue={setDeep}
                      ></Switcher>
                    </div>
                  </div>
                  <span className="picfolderdialog-form-item-tip">
                    是否额外获取未分类文件夹内的文件夹内的图片
                  </span>
                </div>
              </div>

              <div className="picfolderdialog-config-container">
                <div className="picfolderdialog-config">
                  <p className="picfolderdialog-config-title">
                    <span>图片筛选配置</span>
                    <span
                      onClick={clearSelectForm}
                      className="picfolderdialog-config-title-btn"
                    >
                      恢复默认配置
                    </span>
                  </p>
                  <div className="picfolderdialog-config-item">
                    <div className="picfolderdialog-config-item-left">
                      <span className="picfolderdialog-config-item-label">
                        名称:
                      </span>
                      <span
                        onClick={() => {
                          if (selectNameType == "all") {
                            setSelectNameType("include");
                          } else if (selectNameType == "include") {
                            setSelectNameType("exclude");
                          } else {
                            setSelectNameType("all");
                          }
                        }}
                        className="picfolderdialog-config-item-type"
                      >
                        {selectNameType == "all" ? "不筛选" : ""}
                        {selectNameType == "include" ? "包含" : ""}
                        {selectNameType == "exclude" ? "排除" : ""}
                      </span>
                    </div>

                    <div
                      className={`picfolderdialog-config-item-right${
                        selectNameType != "all" ? " show" : ""
                      }`}
                    >
                      <Inputer
                        placeholder="请输入筛选值"
                        value={selectName}
                        setValue={setSelectName}
                        width="265px"
                      ></Inputer>
                    </div>
                  </div>
                  <div className="picfolderdialog-config-item">
                    <div className="picfolderdialog-config-item-left">
                      <span className="picfolderdialog-config-item-label">
                        大小:
                      </span>
                      <span
                        onClick={() => {
                          if (selectSizeType == "all") {
                            setSelectSizeType("gt");
                          } else if (selectSizeType == "gt") {
                            setSelectSizeType("lt");
                          } else if (selectSizeType == "lt") {
                            setSelectSizeType("range");
                          } else {
                            setSelectSizeType("all");
                          }
                        }}
                        className="picfolderdialog-config-item-type"
                      >
                        {selectSizeType == "all" ? "不筛选" : ""}
                        {selectSizeType == "gt" ? "大于" : ""}
                        {selectSizeType == "lt" ? "小于" : ""}
                        {selectSizeType == "range" ? "范围" : ""}
                      </span>
                    </div>

                    <div
                      className={`picfolderdialog-config-item-right${
                        selectSizeType == "gt" || selectSizeType == "lt"
                          ? " show"
                          : ""
                      }`}
                    >
                      <Inputer
                        placeholder="输入正数"
                        value={selectSize}
                        setValue={setSelectSize}
                        width="91px"
                      ></Inputer>
                      <span
                        onClick={() => {
                          if (selectSizeUnit == "KB") {
                            setSelectSizeUnit("MB");
                          } else if (selectSizeUnit == "MB") {
                            setSelectSizeUnit("GB");
                          } else if (selectSizeUnit == "GB") {
                            setSelectSizeUnit("B");
                          } else {
                            setSelectSizeUnit("KB");
                          }
                        }}
                        className="picfolderdialog-config-item-unit"
                      >
                        {selectSizeUnit}
                      </span>
                    </div>
                    <div
                      className={`picfolderdialog-config-item-right${
                        selectSizeType == "range" ? " show" : ""
                      }`}
                    >
                      <Inputer
                        placeholder="输入正数"
                        value={selectSizeRange[0]}
                        setValue={setSizeRangeStart}
                        width="91px"
                      ></Inputer>
                      <span
                        onClick={() => {
                          if (selectSizeRangeUnit[0] == "KB") {
                            setSelectSizeRangeUnit([
                              "MB",
                              selectSizeRangeUnit[1],
                            ]);
                          } else if (selectSizeRangeUnit[0] == "MB") {
                            setSelectSizeRangeUnit([
                              "GB",
                              selectSizeRangeUnit[1],
                            ]);
                          } else if (selectSizeRangeUnit[0] == "GB") {
                            setSelectSizeRangeUnit([
                              "B",
                              selectSizeRangeUnit[1],
                            ]);
                          } else {
                            setSelectSizeRangeUnit([
                              "KB",
                              selectSizeRangeUnit[1],
                            ]);
                          }
                        }}
                        className="picfolderdialog-config-item-unit"
                      >
                        {selectSizeRangeUnit[0]}
                      </span>
                      <span className="picfolderdialog-config-item-sep">-</span>
                      <Inputer
                        placeholder="输入正数"
                        value={selectSizeRange[1]}
                        setValue={setSizeRangeEnd}
                        width="91px"
                      ></Inputer>
                      <span
                        onClick={() => {
                          if (selectSizeRangeUnit[1] == "KB") {
                            setSelectSizeRangeUnit([
                              selectSizeRangeUnit[0],
                              "MB",
                            ]);
                          } else if (selectSizeRangeUnit[1] == "MB") {
                            setSelectSizeRangeUnit([
                              selectSizeRangeUnit[0],
                              "GB",
                            ]);
                          } else if (selectSizeRangeUnit[1] == "GB") {
                            setSelectSizeRangeUnit([
                              selectSizeRangeUnit[0],
                              "B",
                            ]);
                          } else {
                            setSelectSizeRangeUnit([
                              selectSizeRangeUnit[0],
                              "KB",
                            ]);
                          }
                        }}
                        className="picfolderdialog-config-item-unit"
                      >
                        {selectSizeRangeUnit[1]}
                      </span>
                    </div>
                  </div>
                  <div className="picfolderdialog-config-item">
                    <div className="picfolderdialog-config-item-left">
                      <span className="picfolderdialog-config-item-label">
                        分辨率宽度:
                      </span>
                      <span
                        onClick={() => {
                          if (selectResolutionWidthType == "all") {
                            setSelectResolutionWidthType("gt");
                          } else if (selectResolutionWidthType == "gt") {
                            setSelectResolutionWidthType("lt");
                          } else if (selectResolutionWidthType == "lt") {
                            setSelectResolutionWidthType("range");
                          } else {
                            setSelectResolutionWidthType("all");
                          }
                        }}
                        className="picfolderdialog-config-item-type"
                      >
                        {selectResolutionWidthType == "all" ? "不筛选" : ""}
                        {selectResolutionWidthType == "gt" ? "大于" : ""}
                        {selectResolutionWidthType == "lt" ? "小于" : ""}
                        {selectResolutionWidthType == "range" ? "范围" : ""}
                      </span>
                    </div>

                    <div
                      className={`picfolderdialog-config-item-right${
                        selectResolutionWidthType == "gt" ||
                        selectResolutionWidthType == "lt"
                          ? " show"
                          : ""
                      }`}
                    >
                      <Inputer
                        placeholder="请输入正整数"
                        value={selectResolutionWidth}
                        setValue={setSelectResolutionWidth}
                      ></Inputer>
                    </div>
                    <div
                      className={`picfolderdialog-config-item-right${
                        selectResolutionWidthType == "range" ? " show" : ""
                      }`}
                    >
                      <Inputer
                        placeholder="请输入正整数"
                        value={selectResolutionWidthRange[0]}
                        setValue={setResolutionWidthRangeStart}
                      ></Inputer>
                      <span className="picfolderdialog-config-item-sep">-</span>
                      <Inputer
                        placeholder="请输入正整数"
                        value={selectResolutionWidthRange[1]}
                        setValue={setResolutionWidthRangeEnd}
                      ></Inputer>
                    </div>
                  </div>
                  <div className="picfolderdialog-config-item">
                    <div className="picfolderdialog-config-item-left">
                      <span className="picfolderdialog-config-item-label">
                        分辨率高度:
                      </span>
                      <span
                        onClick={() => {
                          if (selectResolutionHeightType == "all") {
                            setSelectResolutionHeightType("gt");
                          } else if (selectResolutionHeightType == "gt") {
                            setSelectResolutionHeightType("lt");
                          } else if (selectResolutionHeightType == "lt") {
                            setSelectResolutionHeightType("range");
                          } else {
                            setSelectResolutionHeightType("all");
                          }
                        }}
                        className="picfolderdialog-config-item-type"
                      >
                        {selectResolutionHeightType == "all" ? "不筛选" : ""}
                        {selectResolutionHeightType == "gt" ? "大于" : ""}
                        {selectResolutionHeightType == "lt" ? "小于" : ""}
                        {selectResolutionHeightType == "range" ? "范围" : ""}
                      </span>
                    </div>

                    <div
                      className={`picfolderdialog-config-item-right${
                        selectResolutionHeightType == "gt" ||
                        selectResolutionHeightType == "lt"
                          ? " show"
                          : ""
                      }`}
                    >
                      <Inputer
                        placeholder="请输入正整数"
                        value={selectResolutionHeight}
                        setValue={setSelectResolutionHeight}
                      ></Inputer>
                    </div>
                    <div
                      className={`picfolderdialog-config-item-right${
                        selectResolutionHeightType == "range" ? " show" : ""
                      }`}
                    >
                      <Inputer
                        placeholder="请输入正整数"
                        value={selectResolutionHeightRange[0]}
                        setValue={setResolutionHeightRangeStart}
                      ></Inputer>
                      <span className="picfolderdialog-config-item-sep">-</span>
                      <Inputer
                        placeholder="请输入正整数"
                        value={selectResolutionHeightRange[1]}
                        setValue={setResolutionHeightRangeEnd}
                      ></Inputer>
                    </div>
                  </div>
                  <div className="picfolderdialog-config-item">
                    <div className="picfolderdialog-config-item-left">
                      <span className="picfolderdialog-config-item-label">
                        创建时间:
                      </span>
                      <span
                        onClick={() => {
                          if (selectCreatedAtType == "all") {
                            setSelectCreatedAtType("before");
                          } else if (selectCreatedAtType == "before") {
                            setSelectCreatedAtType("after");
                          } else if (selectCreatedAtType == "after") {
                            setSelectCreatedAtType("range");
                          } else {
                            setSelectCreatedAtType("all");
                          }
                        }}
                        className="picfolderdialog-config-item-type"
                      >
                        {selectCreatedAtType == "all" ? "不筛选" : ""}
                        {selectCreatedAtType == "before" ? "早于" : ""}
                        {selectCreatedAtType == "after" ? "晚于" : ""}
                        {selectCreatedAtType == "range" ? "范围" : ""}
                      </span>
                    </div>

                    <div
                      className={`picfolderdialog-config-item-right${
                        selectCreatedAtType == "before" ||
                        selectCreatedAtType == "after"
                          ? " show"
                          : ""
                      }`}
                    >
                      <ReactFlatpickr
                        data-input
                        value={createAt}
                        onChange={([selectedDate]) => setCreateAt(selectedDate)}
                        options={{
                          dateFormat: "Y/m/d", // 日期和时间格式
                          altInput: true, // 使用自定义输入框
                          altFormat: "Y/m/d", // 自定义显示格式
                          time_24hr: true, // 使用24小时制
                          locale: Mandarin, // 设置中文地区
                          minDate: "1970/01/01",
                          maxDate: "2999/12/31",
                          monthSelectorType: "static",
                        }}
                      />
                    </div>
                    <div
                      className={`picfolderdialog-config-item-right${
                        selectCreatedAtType == "range" ? " show" : ""
                      }`}
                    >
                      <ReactFlatpickr
                        data-input
                        value={createAtRange[0]}
                        onChange={([selectedDate]) =>
                          setCreateAtRangeStart(selectedDate)
                        }
                        options={{
                          dateFormat: "Y/m/d", // 日期和时间格式
                          altInput: true, // 使用自定义输入框
                          altFormat: "Y/m/d", // 自定义显示格式
                          time_24hr: true, // 使用24小时制
                          locale: Mandarin, // 设置中文地区
                          minDate: "1970/01/01",
                          maxDate: "2999/12/31",
                          monthSelectorType: "static",
                        }}
                      />
                      <span className="picfolderdialog-config-item-sep">-</span>
                      <ReactFlatpickr
                        data-input
                        value={createAtRange[1]}
                        onChange={([selectedDate]) =>
                          setCreateAtRangeEnd(selectedDate)
                        }
                        options={{
                          dateFormat: "Y/m/d", // 日期和时间格式
                          altInput: true, // 使用自定义输入框
                          altFormat: "Y/m/d", // 自定义显示格式
                          time_24hr: true, // 使用24小时制
                          locale: Mandarin, // 设置中文地区
                          minDate: "1970/01/01",
                          maxDate: "2999/12/31",
                          monthSelectorType: "static",
                        }}
                      />
                    </div>
                  </div>
                  <div className="picfolderdialog-config-item">
                    <div className="picfolderdialog-config-item-left">
                      <span className="picfolderdialog-config-item-label">
                        修改时间:
                      </span>
                      <span
                        onClick={() => {
                          if (selectModifiedAtType == "all") {
                            setSelectModifiedAtType("before");
                          } else if (selectModifiedAtType == "before") {
                            setSelectModifiedAtType("after");
                          } else if (selectModifiedAtType == "after") {
                            setSelectModifiedAtType("range");
                          } else {
                            setSelectModifiedAtType("all");
                          }
                        }}
                        className="picfolderdialog-config-item-type"
                      >
                        {selectModifiedAtType == "all" ? "不筛选" : ""}
                        {selectModifiedAtType == "before" ? "早于" : ""}
                        {selectModifiedAtType == "after" ? "晚于" : ""}
                        {selectModifiedAtType == "range" ? "范围" : ""}
                      </span>
                    </div>

                    <div
                      className={`picfolderdialog-config-item-right${
                        selectModifiedAtType == "before" ||
                        selectModifiedAtType == "after"
                          ? " show"
                          : ""
                      }`}
                    >
                      <ReactFlatpickr
                        data-input
                        value={modifiedAt}
                        onChange={([selectedDate]) =>
                          setModifiedAt(selectedDate)
                        }
                        options={{
                          dateFormat: "Y/m/d", // 日期和时间格式
                          altInput: true, // 使用自定义输入框
                          altFormat: "Y/m/d", // 自定义显示格式
                          time_24hr: true, // 使用24小时制
                          locale: Mandarin, // 设置中文地区
                          minDate: "1970/01/01",
                          maxDate: "2999/12/31",
                          monthSelectorType: "static",
                        }}
                      />
                    </div>
                    <div
                      className={`picfolderdialog-config-item-right${
                        selectModifiedAtType == "range" ? " show" : ""
                      }`}
                    >
                      <ReactFlatpickr
                        data-input
                        value={modifiedAtRange[0]}
                        onChange={([selectedDate]) =>
                          setModifiedAtRangeStart(selectedDate)
                        }
                        options={{
                          dateFormat: "Y/m/d", // 日期和时间格式
                          altInput: true, // 使用自定义输入框
                          altFormat: "Y/m/d", // 自定义显示格式
                          time_24hr: true, // 使用24小时制
                          locale: Mandarin, // 设置中文地区
                          minDate: "1970/01/01",
                          maxDate: "2999/12/31",
                          monthSelectorType: "static",
                        }}
                      />
                      <span className="picfolderdialog-config-item-sep">-</span>
                      <ReactFlatpickr
                        data-input
                        value={modifiedAtRange[1]}
                        onChange={([selectedDate]) =>
                          setModifiedAtRangeEnd(selectedDate)
                        }
                        options={{
                          dateFormat: "Y/m/d", // 日期和时间格式
                          altInput: true, // 使用自定义输入框
                          altFormat: "Y/m/d", // 自定义显示格式
                          time_24hr: true, // 使用24小时制
                          locale: Mandarin, // 设置中文地区
                          minDate: "1970/01/01",
                          maxDate: "2999/12/31",
                          monthSelectorType: "static",
                        }}
                      />
                    </div>
                  </div>
                  <div className="picfolderdialog-config-item">
                    <div className="picfolderdialog-config-item-left">
                      <span className="picfolderdialog-config-item-label">
                        类型:
                      </span>
                      <span className="picfolderdialog-config-item-type">
                        {selectFileType.length == fileType.length
                          ? "不筛选"
                          : "部分"}
                      </span>
                    </div>

                    <div className="picfolderdialog-config-item-right show">
                      {fileType.map((type) => (
                        <div
                          key={type}
                          onClick={() => {
                            setFileType(type);
                          }}
                          className={`picfolderdialog-config-item-tag${
                            selectFileType.includes(type) ? " active" : ""
                          }`}
                        >
                          {type.toLocaleUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={setPicConfig}
              className={`picfolderdialog-btn${
                sortStore.picFolderPathLoading || picStore.picListLoading
                  ? " loading"
                  : ""
              }`}
            >
              <span className="picfolderdialog-btn-text">设置完成</span>
              <div className="picfolderdialog-btn-loading">
                <Loader></Loader>
              </div>
            </button>

            <ul
              className={`picfolderdialog-form-item-select${
                sortTypeSelect ? " show" : ""
              }`}
            >
              {Object.keys(sortTypeForPic).map((key) => (
                <li
                  onClick={() => {
                    setSortType(
                      sortTypeForPic[key as SortNameTypeForPic].value
                    );
                  }}
                  key={sortTypeForPic[key as SortNameTypeForPic].value}
                  className={`picfolderdialog-form-item-select-item${
                    sortTypeForPic[key as SortNameTypeForPic].value ==
                    editingPicFolderConfig.sortType
                      ? " active"
                      : ""
                  }`}
                >
                  {key}
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

export default PicFolderDialog;

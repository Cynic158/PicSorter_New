const sortType: {
  [key in SortNameType]: { value: SortType; desc: SortDescType };
} = {
  名称递增: {
    value: "nameAsc",
    desc: "A —> Z",
  },
  名称递减: {
    value: "nameDesc",
    desc: "Z —> A",
  },
  文件大小递增: {
    value: "sizeAsc",
    desc: "114KB —> 514MB",
  },
  文件大小递减: {
    value: "sizeDesc",
    desc: "514MB —> 114KB",
  },
  文件数量递增: {
    value: "countAsc",
    desc: "07张 —> 21张",
  },
  文件数量递减: {
    value: "countDesc",
    desc: "21张 —> 07张",
  },
  创建时间递增: {
    value: "createdAtAsc",
    desc: "旧 —> 新",
  },
  创建时间递减: {
    value: "createdAtDesc",
    desc: "新 —> 旧",
  },
  修改时间递增: {
    value: "modifiedAtAsc",
    desc: "旧 —> 新",
  },
  修改时间递减: {
    value: "modifiedAtDesc",
    desc: "新 —> 旧",
  },
};

const sortTypeForPic: {
  [key in SortNameTypeForPic]: {
    value: SortTypeForPic;
    desc: SortDescTypeForPic;
  };
} = {
  名称递增: {
    value: "nameAsc",
    desc: "A —> Z",
  },
  名称递减: {
    value: "nameDesc",
    desc: "Z —> A",
  },
  文件大小递增: {
    value: "sizeAsc",
    desc: "114KB —> 5.14MB",
  },
  文件大小递减: {
    value: "sizeDesc",
    desc: "5.14MB —> 114KB",
  },
  创建时间递增: {
    value: "createdAtAsc",
    desc: "旧 —> 新",
  },
  创建时间递减: {
    value: "createdAtDesc",
    desc: "新 —> 旧",
  },
  修改时间递增: {
    value: "modifiedAtAsc",
    desc: "旧 —> 新",
  },
  修改时间递减: {
    value: "modifiedAtDesc",
    desc: "新 —> 旧",
  },
};

const formatType: Array<{ title: string; value: FormatType }> = [
  {
    title: "年月日",
    value: "date",
  },
  {
    title: "年",
    value: "year",
  },
  {
    title: "月",
    value: "month",
  },
  {
    title: "日",
    value: "day",
  },
  {
    title: "时",
    value: "hour",
  },
  {
    title: "分",
    value: "minute",
  },
  {
    title: "秒",
    value: "second",
  },
  {
    title: "时间戳",
    value: "timestamp",
  },
  {
    title: "序号",
    value: "serial",
  },
  {
    title: "固定字符",
    value: "str",
  },
];

const generateFormatPreview = (
  separator: "-" | "_",
  sortType: SortTypeForPic,
  format: Array<FormatConfigType>
) => {
  // 获取排序前和排序后数组
  let str1 = "测试图片.png(100KB)(2023)";
  let str2 = "testPicture.png(200KB)(2024)";
  let str3 = "1145140721.png(1MB)(2025)";
  let sortTypePreviewBefore = [str1, str2, str3];
  let sortTypePreviewAfter: Array<string> = [str3, str2, str1];
  if (sortType == "nameAsc") {
    sortTypePreviewAfter = [str3, str2, str1];
  } else if (sortType == "nameDesc") {
    sortTypePreviewAfter = [str1, str2, str3];
  } else if (sortType == "sizeAsc") {
    sortTypePreviewAfter = [str1, str2, str3];
  } else if (sortType == "sizeDesc") {
    sortTypePreviewAfter = [str3, str2, str1];
  } else if (sortType == "createdAtAsc" || sortType == "modifiedAtAsc") {
    sortTypePreviewAfter = [str1, str2, str3];
  } else {
    sortTypePreviewAfter = [str3, str2, str1];
  }

  // 获取自动重命名结果数组
  let formatStr1 = "";
  let formatStr2 = "";
  let formatStr3 = "";
  let now = new Date();
  let year = String(now.getFullYear()); // 年份（四位数）
  let month = String(now.getMonth() + 1).padStart(2, "0"); // 月（两位数）
  let day = String(now.getDate()).padStart(2, "0"); // 日（两位数）
  let hour = String(now.getHours()).padStart(2, "0"); // 时（24小时制，两位数）
  let minute = String(now.getMinutes()).padStart(2, "0"); // 分（两位数）
  let second = String(now.getSeconds()).padStart(2, "0"); // 秒（两位数）
  let timestamp1 = String(now.getTime()); // 时间戳（字符串）
  let timestamp2 = String(now.getTime() + 100);
  let timestamp3 = String(now.getTime() + 200);
  const setFormatStr = (item: string) => {
    formatStr1 = formatStr1 + item;
    formatStr2 = formatStr2 + item;
    formatStr3 = formatStr3 + item;
  };
  format.forEach((item, index) => {
    if (item.type == "date") {
      setFormatStr(year + month + day);
    } else if (item.type == "year") {
      setFormatStr(year);
    } else if (item.type == "month") {
      setFormatStr(month);
    } else if (item.type == "day") {
      setFormatStr(day);
    } else if (item.type == "hour") {
      setFormatStr(hour);
    } else if (item.type == "minute") {
      setFormatStr(minute);
    } else if (item.type == "second") {
      setFormatStr(second);
    } else if (item.type == "str") {
      setFormatStr(item.value);
    } else if (item.type == "serial") {
      formatStr1 = formatStr1 + "1";
      formatStr2 = formatStr2 + "2";
      formatStr3 = formatStr3 + "3";
    } else if (item.type == "timestamp") {
      formatStr1 = formatStr1 + timestamp1;
      formatStr2 = formatStr2 + timestamp2;
      formatStr3 = formatStr3 + timestamp3;
    }
    if (index != format.length - 1) {
      setFormatStr(separator);
    } else {
      setFormatStr(".png");
    }
  });

  let formatPreview: [string[], string[], string[]] = [
    sortTypePreviewBefore,
    sortTypePreviewAfter,
    [formatStr1, formatStr2, formatStr3],
  ];
  return formatPreview;
};

const picStaticPath = "http://127.0.0.1:7777/pic";
const sortStaticPath = "http://127.0.0.1:7777/sort";

export {
  sortType,
  sortTypeForPic,
  picStaticPath,
  sortStaticPath,
  formatType,
  generateFormatPreview,
};

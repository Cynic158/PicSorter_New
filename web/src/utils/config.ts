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

export { sortType, sortTypeForPic };

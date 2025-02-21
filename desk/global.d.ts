declare global {
  // Api类型
  type WinApi = "Win_quit" | "Win_hide" | "Win_max" | "Win_copy" | "Win_link";
  type PicApi =
    | "Pic_getPicList"
    | "Pic_renamePic"
    | "Pic_getPicInfo"
    | "Pic_showPic";
  type SortApi =
    | "Sort_getPicFolder"
    | "Sort_getPicFolderPath"
    | "Sort_setPicFolderPath"
    | "Sort_getPicFolderInfo"
    | "Sort_openPicFolder"
    | "Sort_getSortFolder"
    | "Sort_getSortFolderPath"
    | "Sort_setSortFolderPath"
    | "Sort_getSortFolderInfo"
    | "Sort_openSortFolder"
    | "Sort_insertSortFolder"
    | "Sort_deleteSortFolder"
    | "Sort_copyPic"
    | "Sort_copyPicGroup"
    | "Sort_deletePic"
    | "Sort_deletePicGroup"
    | "Sort_openSortItemFolder"
    | "Sort_getSortItemFolderInfo"
    | "Sort_setTopList"
    | "Sort_renameSortItem";
  type SettingApi =
    | "Setting_getAutoConfig"
    | "Setting_setAutoConfig"
    | "Setting_getDefaultSetting"
    | "Setting_getDefaultSetting"
    | "Setting_setDefaultSetting"
    | "Setting_openConfigFolder"
    | "Setting_getHandlePicCount";

  // 其他类型
  // 通用部分
  type picType = "png" | "jpg" | "gif" | "webp";
  type viewType = "view" | "horizontal" | "vertical" | "total";

  // pic部分
  type GetPicListSaveType = () => Array<PicInfo>;
  type SetPicListSave = (list: Array<PicInfo>) => void;

  type PicInfo = {
    name: string;
    size: number;
    type: picType;
    resolution: {
      width: number | undefined;
      height: number | undefined;
    };
    dpi: number | undefined;
    bitDepth: number | undefined;
    createdAt: number;
    modifiedAt: number;
    path: string;
  };
  interface PicConfig {
    picLoadLimit: number;
  }

  // sort部分
  type ResetPicStaticType = (picFolderPath: string) => Promise<boolean>;
  type ResetSortStaticType = (sortFolderPath: string) => Promise<boolean>;

  type SortTypeForPic =
    | "nameAsc" // 名称递增: a-z
    | "nameDesc" // 名称递减: z-a
    | "sizeAsc" // 文件大小递增: 小到大
    | "sizeDesc" // 文件大小递减: 大到小
    | "createdAtAsc" // 创建时间递增: 从旧到新
    | "createdAtDesc" // 创建时间递减: 从新到旧
    | "modifiedAtAsc" // 修改时间递增: 从旧到新
    | "modifiedAtDesc"; // 修改时间递减: 从新到旧
  type SortType =
    | "nameAsc" // 名称递增: a-z
    | "nameDesc" // 名称递减: z-a
    | "sizeAsc" // 文件大小递增: 小到大
    | "sizeDesc" // 文件大小递减: 大到小
    | "countAsc" // 文件数量递增: 少到多
    | "countDesc" // 文件数量递增: 多到少
    | "createdAtAsc" // 创建时间递增: 从旧到新
    | "createdAtDesc" // 创建时间递减: 从新到旧
    | "modifiedAtAsc" // 修改时间递增: 从旧到新
    | "modifiedAtDesc"; // 修改时间递减: 从新到旧
  interface SelectConfigType {
    name: {
      type: "all" | "include" | "exclude";
      value: string;
    };
    size: {
      type: "all" | "gt" | "lt" | "range";
      value: number | Array<number>;
    };
    fileType: Array<picType>;
    resolution: {
      width: {
        type: "all" | "gt" | "lt" | "range";
        value: number | Array<number>;
      };
      height: {
        type: "all" | "gt" | "lt" | "range";
        value: number | Array<number>;
      };
    };
    createdAt: {
      type: "all" | "before" | "after" | "range";
      value: number | Array<number>;
    };
    modifiedAt: {
      type: "all" | "before" | "after" | "range";
      value: number | Array<number>;
    };
  }
  interface PicFolderConfigType {
    folderPath: string;
    sortType: SortTypeForPic;
    deep: boolean;
    selectConfig: SelectConfigType;
  }
  interface SortFolderConfigType {
    folderPath: string;
    sortType: SortType;
  }

  interface SortConfig {
    picFolderPath: string;
    picFolderType: SortTypeForPic;
    deep: boolean;
    selectConfig: SelectConfigType;
    sortFolderPath: string;
    sortFolderType: SortType;
    topList: Array<string>;
    clearList: boolean;
  }

  interface SortFolderListType {
    name: string;
    count: number;
    size: number;
    top: boolean;
    auto: boolean;
  }

  interface FolderInfoType {
    name: string;
    path: string;
    deep: boolean;
    sortTotal: number;
    picTotal: number;
    sizeTotal: number;
    sizeRange: Array<number>;
    resolution: string;
    picType: Array<picType>;
    createdAt: string;
    modifiedAt: string;
  }

  interface CopyPicDataType {
    picName: string;
    picPath: string;
    sortName: string;
    sortPath: string;
    action: "copy" | "cut";
  }

  // 设置部分
  type FormatType =
    | "date"
    | "year"
    | "month"
    | "day"
    | "hour"
    | "minute"
    | "second"
    | "timestamp"
    | "serial"
    | "str";
  interface FormatConfigType {
    type: FormatType;
    value: string;
  }
  interface AutoRenameConfig {
    path: string;
    enable: boolean;
    separator: "-" | "_";
    applyNew: boolean;
    sortType: SortTypeForPic;
    format: Array<FormatConfigType>;
  }
  interface SettingConfig {
    autoRename: Array<AutoRenameConfig>;
    handlePicCount: number;
  }

  type UpdateHandlePicCountType = (count: number) => Promise<void>;
}

export {};

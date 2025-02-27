declare global {
  interface GetPicListDataType {
    config: PicFolderConfigType;
    picList: Array<PicInfo | null>;
    total: number;
  }
  interface GetSortFolderDataType {
    folderPath: string;
    sortType: SortType;
    list: Array<SortFolderListType>;
    clearList: boolean;
  }
  interface GetDefaultSettingDataType {
    clearList: boolean;
    picLoadLimit: string;
    showStartup: boolean;
    configPath: string;
  }
  interface Window {
    DeskApi: {
      Win_quit: () => void;
      Win_hide: () => void;
      Win_max: () => void;
      Win_copy: (
        content: string
      ) => Promise<{ success: boolean; data: string }>;
      Win_link: (url: string) => Promise<{ success: boolean; data: string }>;

      Pic_getPicList: (
        mode: viewType,
        refresh: boolean,
        currentPicPath?: string | null
      ) => Promise<{ success: boolean; data: GetPicListDataType | string }>;
      Pic_renamePic: (
        renamePath: string,
        newName: string
      ) => Promise<{
        success: boolean;
        conflict: boolean;
        data: PicInfo | ConflictDataType | string;
      }>;
      Pic_getPicInfo: (picPath: string) => Promise<{
        success: boolean;
        data: PicInfoDataType | string;
      }>;
      Pic_showPic: (picPath: string) => Promise<{
        success: boolean;
        data: string;
      }>;

      Sort_getPicFolder: () => void;
      Sort_getPicFolderPath: (
        defaultPath: string
      ) => Promise<{ success: boolean; data: string }>;
      Sort_setPicFolderPath: (
        config: PicFolderConfigType
      ) => Promise<{ success: boolean; data: string }>;
      Sort_getPicFolderInfo: () => Promise<{
        success: boolean;
        data: FolderInfoType | string;
      }>;
      Sort_openPicFolder: () => Promise<{ success: boolean; data: string }>;
      Sort_getSortFolder: () => Promise<{
        success: boolean;
        data: string | GetSortFolderDataType;
      }>;
      Sort_getSortFolderPath: (
        defaultPath: string
      ) => Promise<{ success: boolean; data: string }>;
      Sort_setSortFolderPath: (
        config: SortFolderConfigType
      ) => Promise<{ success: boolean; data: string }>;
      Sort_getSortFolderInfo: () => Promise<{
        success: boolean;
        data: FolderInfoType | string;
      }>;
      Sort_openSortFolder: () => Promise<{ success: boolean; data: string }>;
      Sort_insertSortFolder: (
        name: string
      ) => Promise<{ success: boolean; conflict: boolean; data: string }>;
      Sort_deleteSortFolder: (
        targets: Array<string>
      ) => Promise<{ success: boolean; data: string }>;
      Sort_copyPic: (
        picPath: string,
        targets: Array<string>,
        action: "copy" | "cut",
        force: boolean
      ) => Promise<{
        success: boolean;
        conflict: boolean;
        data: Array<CopyPicDataType> | string;
      }>;
      Sort_copyPicGroup: (
        picPathGroup: Array<string>,
        targets: Array<string>,
        action: "copy" | "cut",
        force: boolean
      ) => Promise<{
        success: boolean;
        conflict: boolean;
        data: Array<CopyPicDataType> | string;
      }>;
      Sort_deletePic: (
        picPath: string,
        cut?: boolean
      ) => Promise<{ success: boolean; data: string }>;
      Sort_deletePicGroup: (
        picPathGroup: Array<string>,
        cut?: boolean
      ) => Promise<{ success: boolean; data: string }>;
      Sort_openSortItemFolder: (
        sortName: string
      ) => Promise<{ success: boolean; data: string }>;
      Sort_getSortItemFolderInfo: (sortName: string) => Promise<{
        success: boolean;
        data: FolderInfoType | string;
      }>;
      Sort_setTopList: (
        sortName: string,
        type: "insert" | "delete"
      ) => Promise<{
        success: boolean;
        data: string;
      }>;
      Sort_renameSortItem: (
        oldName: string,
        newName: string
      ) => Promise<{ success: boolean; conflict: boolean; data: string }>;

      Setting_getAutoConfig: (
        sortName: string
      ) => Promise<{ success: boolean; data: string | AutoRenameConfig }>;
      Setting_setAutoConfig: (
        config: AutoRenameConfig
      ) => Promise<{ success: boolean; data: string }>;
      Setting_getDefaultSetting: () => Promise<{
        success: boolean;
        data: string | GetDefaultSettingDataType;
      }>;
      Setting_setDefaultSetting: (
        clearList: boolean,
        picLoadLimit: number,
        showStartup: boolean
      ) => Promise<{ success: boolean; data: string }>;
      Setting_openConfigFolder: () => Promise<{
        success: boolean;
        data: string;
      }>;
      Setting_getTopList: () => Promise<{
        success: boolean;
        data: string | Array<string>;
      }>;
      Setting_setTopList: (
        topList: Array<string>
      ) => Promise<{ success: boolean; data: string }>;
      Setting_getAutoConfigList: () => Promise<{
        success: boolean;
        data: string | Array<string>;
      }>;
      Setting_setAutoConfigList: (
        autoList: Array<string>
      ) => Promise<{ success: boolean; data: string }>;
      Setting_openFolder: (folderPath: string) => Promise<{
        success: boolean;
        data: string;
      }>;
      Setting_getHandlePicCount: () => Promise<{
        success: boolean;
        data: string;
      }>;
      Setting_getShortcut: () => Promise<{
        success: boolean;
        data: string | Array<boolean>;
      }>;
      Setting_setShortcut: (shortcuts: Array<boolean>) => Promise<{
        success: boolean;
        data: string;
      }>;

      Tool_adjustPic: (
        picPath: string
      ) => Promise<{ success: boolean; data: string }>;
    };
  }

  // 通用部分
  type picType = "png" | "jpg" | "gif" | "webp";
  type sizeType = "B" | "KB" | "MB" | "GB";
  type viewType = "view" | "horizontal" | "vertical" | "total";

  // win部分
  interface MessageType {
    msg: string;
    type: "success" | "error";
  }

  // pic部分
  type PicInfo = {
    name: string;
    size: number;
    type: picType;
    resolution: {
      width: number;
      height: number;
    };
    dpi: number | undefined;
    bitDepth: number | undefined;
    createdAt: number;
    modifiedAt: number;
    path: string;
  } | null;

  interface ConflictDataType {
    path: string;
    width: number;
    height: number;
  }
  interface PicInfoDataType {
    dpi: number;
    bitDepth: number;
  }

  // sort部分
  type SortTypeForPic =
    | "nameAsc" // 名称递增: a-z
    | "nameDesc" // 名称递减: z-a
    | "sizeAsc" // 文件大小递增: 小到大
    | "sizeDesc" // 文件大小递减: 大到小
    | "createdAtAsc" // 创建时间递增: 从旧到新
    | "createdAtDesc" // 创建时间递减: 从新到旧
    | "modifiedAtAsc" // 修改时间递增: 从旧到新
    | "modifiedAtDesc"; // 修改时间递减: 从新到旧
  type SortNameTypeForPic =
    | "名称递增"
    | "名称递减"
    | "文件大小递增"
    | "文件大小递减"
    | "创建时间递增"
    | "创建时间递减"
    | "修改时间递增"
    | "修改时间递减";
  type SortDescTypeForPic =
    | "A —> Z"
    | "Z —> A"
    | "114KB —> 5.14MB"
    | "5.14MB —> 114KB"
    | "旧 —> 新"
    | "新 —> 旧";
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
  type SortNameType =
    | "名称递增"
    | "名称递减"
    | "文件大小递增"
    | "文件大小递减"
    | "文件数量递增"
    | "文件数量递减"
    | "创建时间递增"
    | "创建时间递减"
    | "修改时间递增"
    | "修改时间递减";
  type SortDescType =
    | "A —> Z"
    | "Z —> A"
    | "114KB —> 514MB"
    | "514MB —> 114KB"
    | "07张 —> 21张"
    | "21张 —> 07张"
    | "旧 —> 新"
    | "新 —> 旧";

  interface SortFolderListType {
    name: string;
    count: number;
    size: number;
    top: boolean;
    auto: boolean;
  }

  type selectNameType = "all" | "include" | "exclude";
  type selectNumberType = "all" | "gt" | "lt" | "range";
  type selectDateType = "all" | "before" | "after" | "range";
  interface SelectConfigType {
    name: {
      // 名称筛选：不筛选、包含字符、排除字符
      type: selectNameType;
      value: string;
    };
    size: {
      // 大小筛选：不筛选、大于、小于、范围
      type: selectNumberType;
      value: number | Array<number>;
    };
    // 类型筛选
    fileType: Array<picType>;
    // 分辨率筛选
    resolution: {
      // 宽度：不筛选、大于、小于、范围
      width: {
        type: selectNumberType;
        value: number | Array<number>;
      };
      // 高度：不筛选、大于、小于、范围
      height: {
        type: selectNumberType;
        value: number | Array<number>;
      };
    };
    createdAt: {
      // 创建时间筛选：不筛选、早于、晚于、范围
      type: selectDateType;
      value: number | Array<number>;
    };
    modifiedAt: {
      // 修改时间筛选：不筛选、早于、晚于、范围
      type: selectDateType;
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

  interface FolderInfoType {
    name: string;
    path: string;
    deep: boolean;
    sortTotal: number;
    picTotal: number;
    sizeTotal: number | string;
    sizeRange: Array<number> | string;
    resolution: string;
    picType: Array<picType> | string;
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

  // setting部分
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
}

export {};

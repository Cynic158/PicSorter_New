declare module "virtual:svg-icons-register";

declare global {
  interface GetSortFolderDataType {
    folderPath: string;
    sortType: SortType;
    list: Array<SortFolderListType>;
    clearList: boolean;
  }
  interface Window {
    DeskApi: {
      Win_quit: () => void;
      Win_hide: () => void;
      Win_max: () => void;
      Win_copy: (
        content: string
      ) => Promise<{ success: boolean; data: string }>;

      Sort_getPicFolder: () => void;
      Sort_getPicFolderPath: () => void;
      Sort_setPicFolderPath: () => void;
      Sort_getPicFolderInfo: () => void;
      Sort_openPicFolder: () => void;
      Sort_getSortFolder: () => Promise<{
        success: boolean;
        data: string | GetSortFolderDataType;
      }>;
      Sort_getSortFolderPath: (
        defaultPath: string
      ) => Promise<{ success: boolean; data: string }>;
      Sort_setSortFolderPath: (
        config: SortConfigType
      ) => Promise<{ success: boolean; data: string }>;
      Sort_getSortFolderInfo: () => void;
      Sort_openSortFolder: () => Promise<{ success: boolean; data: string }>;
    };
  }

  // win部分
  interface MessageType {
    msg: string;
    type: "success" | "error";
  }

  // sort部分
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
  }
  interface SortConfigType {
    folderPath: string;
    sortType: SortType;
  }
}

export {};

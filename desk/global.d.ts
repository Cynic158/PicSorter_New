declare global {
  // Api类型
  type WinApi = "Win_quit" | "Win_hide" | "Win_max" | "Win_copy";
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
    | "Sort_openSortFolder";

  // 其他类型
  // 通用部分
  type picType = "png" | "jpeg" | "jpg" | "gif" | "webp";
  // sort部分
  type resetPicServerType = (picFolderPath: string) => boolean;
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
  interface SortFolderConfig {
    folderPath: string;
    sortType: SortType;
  }
  interface SortConfig {
    picFolderPath: string;
    picFolderType: string;
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
  }
}

export {};

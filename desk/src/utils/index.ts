import sizeOf from "image-size";
import fs from "fs";
import path from "path";

const generateErrorLog = (error: Error | unknown) => {
  // 获取当前时间
  const timestamp = new Date().toISOString();

  // 获取错误信息
  let errorMessage = "Unknown error";
  let stackTrace = "No stack trace available";

  if (error instanceof Error) {
    errorMessage = error.message;
    stackTrace = error.stack || stackTrace;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else if (typeof error === "object" && error !== null) {
    try {
      errorMessage = JSON.stringify(error, null, 2);
    } catch {
      errorMessage = "Error object could not be stringified";
    }
  }

  // 构造错误日志字符串
  const errorLog = `Error Report:\nTimestamp: ${timestamp}\nMessage: ${errorMessage}\nStack Trace:\n${stackTrace}`;

  return errorLog;
};

interface CheckResult {
  success: boolean;
  result: string[];
}
async function checkPathsExist(
  type: "file" | "folder",
  checkList: string[]
): Promise<CheckResult> {
  const checkResults = await Promise.all(
    checkList.map(async (path) => {
      try {
        const stats = await fs.promises.stat(path);
        // 根据 type 判断是文件还是文件夹
        if (
          (type === "file" && stats.isFile()) ||
          (type === "folder" && stats.isDirectory())
        ) {
          return null; // 返回 null 表示符合条件
        }
        return path; // 不符合条件
      } catch (error) {
        return path; // 路径不存在
      }
    })
  );

  // 过滤出不符合条件的路径
  const nonExistentPaths = checkResults.filter(
    (result) => result !== null
  ) as string[];

  return {
    success: nonExistentPaths.length === 0,
    result: nonExistentPaths,
  };
}

interface ResolutionType {
  width: number | undefined;
  height: number | undefined;
}
// 筛选函数
async function filterImages(
  selectConfig: any,
  imageFiles: string[]
): Promise<PicInfo[]> {
  const tasks = imageFiles.map(async (filePath) => {
    try {
      // 获取图片的基本信息
      const stats = fs.statSync(filePath);
      const fileName = path.basename(filePath);
      const fileSize = stats.size;
      const createdAt = stats.birthtimeMs;
      const modifiedAt = stats.mtimeMs;

      // 使用 image-size 获取分辨率
      let resolution: ResolutionType = { width: undefined, height: undefined };
      try {
        const dimensions = sizeOf(filePath);
        resolution = { width: dimensions.width, height: dimensions.height };
      } catch (_err) {}

      const dpi = undefined;
      const bitDepth = undefined;

      // 过滤掉缺少必需属性的文件
      if (
        (selectConfig.resolution.width.type != "all" &&
          resolution.width === undefined) ||
        (selectConfig.resolution.height.type != "all" &&
          resolution.height === undefined)
      ) {
        return null;
      }

      // 根据 selectConfig 进行过滤
      const nameMatches =
        selectConfig.name.type === "all" ||
        (selectConfig.name.type === "include" &&
          fileName.includes(selectConfig.name.value)) ||
        (selectConfig.name.type === "exclude" &&
          !fileName.includes(selectConfig.name.value));

      const sizeMatches =
        selectConfig.size.type === "all" ||
        (selectConfig.size.type === "gt" &&
          fileSize > selectConfig.size.value) ||
        (selectConfig.size.type === "lt" &&
          fileSize < selectConfig.size.value) ||
        (selectConfig.size.type === "range" &&
          fileSize >= selectConfig.size.value[0] &&
          fileSize <= selectConfig.size.value[1]);

      const createdAtMatches =
        selectConfig.createdAt.type === "all" ||
        (selectConfig.createdAt.type === "before" &&
          createdAt < selectConfig.createdAt.value) ||
        (selectConfig.createdAt.type === "after" &&
          createdAt > selectConfig.createdAt.value) ||
        (selectConfig.createdAt.type === "range" &&
          createdAt >= selectConfig.createdAt.value[0] &&
          createdAt <= selectConfig.createdAt.value[1]);

      const modifiedAtMatches =
        selectConfig.modifiedAt.type === "all" ||
        (selectConfig.modifiedAt.type === "before" &&
          modifiedAt < selectConfig.modifiedAt.value) ||
        (selectConfig.modifiedAt.type === "after" &&
          modifiedAt > selectConfig.modifiedAt.value) ||
        (selectConfig.modifiedAt.type === "range" &&
          modifiedAt >= selectConfig.modifiedAt.value[0] &&
          modifiedAt <= selectConfig.modifiedAt.value[1]);

      const resolutionWidthMatches =
        selectConfig.resolution.width.type === "all" ||
        (selectConfig.resolution.width.type === "gt" &&
          resolution.width! > selectConfig.resolution.width.value) ||
        (selectConfig.resolution.width.type === "lt" &&
          resolution.width! < selectConfig.resolution.width.value) ||
        (selectConfig.resolution.width.type === "range" &&
          resolution.width! >= selectConfig.resolution.width.value[0] &&
          resolution.width! <= selectConfig.resolution.width.value[1]);

      const resolutionHeightMatches =
        selectConfig.resolution.height.type === "all" ||
        (selectConfig.resolution.height.type === "gt" &&
          resolution.height! > selectConfig.resolution.height.value) ||
        (selectConfig.resolution.height.type === "lt" &&
          resolution.height! < selectConfig.resolution.height.value) ||
        (selectConfig.resolution.height.type === "range" &&
          resolution.height! >= selectConfig.resolution.height.value[0] &&
          resolution.height! <= selectConfig.resolution.height.value[1]);

      // 如果所有条件都匹配，返回结果
      if (
        nameMatches &&
        sizeMatches &&
        createdAtMatches &&
        modifiedAtMatches &&
        resolutionWidthMatches &&
        resolutionHeightMatches
      ) {
        return {
          name: fileName,
          size: fileSize,
          type: path
            .extname(filePath)
            .toUpperCase()
            .replace(".", "") as picType,
          resolution: resolution,
          dpi: dpi,
          bitDepth: bitDepth,
          createdAt: createdAt,
          modifiedAt: modifiedAt,
          path: filePath,
          exist: true,
        };
      }

      return null; // 不符合条件，返回 null
    } catch (_err) {
      return null; // 如果发生错误，忽略该文件
    }
  });

  // 等待所有任务完成，并过滤掉 null 值
  const results = await Promise.all(tasks);
  return results.filter((item) => item !== null) as PicInfo[];
}

const getFolderInfo = async (
  folderPath: string,
  deepRead: boolean,
  type: "pic" | "sort"
): Promise<FolderInfoType> => {
  const validPicTypes: Array<picType> = ["png", "jpg", "gif", "webp"];

  const isImage = (file: string): boolean => {
    const ext = path.extname(file).toLowerCase().replace(".", "");
    return validPicTypes.includes(ext as picType);
  };

  const getImageStats = (filePath: string) => {
    try {
      const dimensions = sizeOf(filePath);
      const stats = fs.statSync(filePath);
      return {
        size: stats.size,
        width: dimensions.width || 0,
        height: dimensions.height || 0,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch {
      return null;
    }
  };

  const getFolderContentsForPic = (
    dirPath: string,
    deep: boolean
  ): Array<string> => {
    let files: string[] = [];
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      if (item.isFile() && isImage(item.name)) {
        files.push(fullPath);
      } else if (item.isDirectory() && deep) {
        files = files.concat(getFolderContentsForPic(fullPath, true));
      }
    }
    return files;
  };

  const getFolderContentsForSort = (dirPath: string): Array<string> => {
    let files: string[] = [];
    const folders = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const folder of folders) {
      const folderPath = path.join(dirPath, folder.name);
      if (folder.isDirectory()) {
        const folderFiles = fs.readdirSync(folderPath, {
          withFileTypes: true,
        });
        for (const folderFile of folderFiles) {
          const filePath = path.join(folderPath, folderFile.name);
          if (folderFile.isFile() && isImage(folderFile.name)) {
            files.push(filePath);
          }
        }
      }
    }
    return files;
  };

  const name = path.basename(folderPath);
  const sortTotal =
    type === "sort"
      ? fs
          .readdirSync(folderPath, { withFileTypes: true })
          .filter((item) => item.isDirectory()).length
      : 0;

  let picTotal = 0;
  let sizeTotal = 0;
  let sizeRange: Array<number> = [];
  let resolution = "无";
  let picType: Array<picType> = [];
  let createdAt = "无";
  let modifiedAt = "无";

  let imageFiles: Array<string> = [];
  if (type === "pic") {
    imageFiles = getFolderContentsForPic(folderPath, deepRead);
  } else {
    imageFiles = getFolderContentsForSort(folderPath);
  }
  const sizes: Array<number> = [];
  const widths: Array<number> = [];
  const heights: Array<number> = [];
  const createdDates: Array<Date> = [];
  const modifiedDates: Array<Date> = [];

  for (const file of imageFiles) {
    const stats = getImageStats(file);
    if (stats) {
      picTotal++;
      sizeTotal += stats.size;
      sizes.push(stats.size);
      widths.push(stats.width);
      heights.push(stats.height);
      createdDates.push(stats.createdAt);
      modifiedDates.push(stats.modifiedAt);

      const ext = path.extname(file).toLowerCase().replace(".", "");
      if (!picType.includes(ext as picType)) {
        picType.push(ext as picType);
      }
    }
  }

  if (sizes.length > 0) {
    sizeRange = [Math.min(...sizes), Math.max(...sizes)];
    const minWidth = Math.min(...widths);
    const maxWidth = Math.max(...widths);
    const minHeight = Math.min(...heights);
    const maxHeight = Math.max(...heights);

    resolution = `${minWidth}${
      minWidth === maxWidth ? "" : ` - ${maxWidth}`
    } x ${minHeight}${minHeight === maxHeight ? "" : ` - ${maxHeight}`}`;

    createdAt = `${createdDates
      .reduce((a, b) => (a < b ? a : b))
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/")}`;
    modifiedAt = `${modifiedDates
      .reduce((a, b) => (a < b ? a : b))
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "/")}`;

    if (createdDates.length > 1) {
      let nextCreateAt = createdDates
        .reduce((a, b) => (a > b ? a : b))
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/");
      if (createdAt != nextCreateAt) {
        createdAt += ` - ${nextCreateAt}`;
      }
    }

    if (modifiedDates.length > 1) {
      let nextModifiedAt = modifiedDates
        .reduce((a, b) => (a > b ? a : b))
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/");
      if (modifiedAt != nextModifiedAt) {
        modifiedAt += ` - ${nextModifiedAt}`;
      }
    }
  }

  return {
    name,
    path: folderPath,
    deep: deepRead,
    sortTotal,
    picTotal,
    sizeTotal,
    sizeRange,
    resolution,
    picType,
    createdAt,
    modifiedAt,
  };
};

export { generateErrorLog, checkPathsExist, filterImages, getFolderInfo };

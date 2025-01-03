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

export { generateErrorLog, checkPathsExist, filterImages };

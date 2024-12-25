import fs from "fs";

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

export { generateErrorLog, checkPathsExist };

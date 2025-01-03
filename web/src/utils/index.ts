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

const getFileSize = (size: number): string => {
  const units: Array<sizeType> = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
};
const getFileSizeArr = (size: number): [string, sizeType] => {
  if (size == 0) {
    return ["", "KB"];
  }
  const units: Array<sizeType> = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return [size.toFixed(2), units[unitIndex]];
};
const getFileSizeNumber = (size: string, unit: sizeType) => {
  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = units.indexOf(unit);

  // 将输入字符串转换为浮点数
  const sizeInNumber = parseFloat(size);

  // 转换成字节单位的正整数
  const sizeInBytes = sizeInNumber * Math.pow(1024, unitIndex);

  // 返回正整数
  return Math.round(sizeInBytes);
};

export { generateErrorLog, getFileSize, getFileSizeArr, getFileSizeNumber };

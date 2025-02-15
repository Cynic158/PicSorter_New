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
  const errorLog = `FrontEnd Error Report:\nTimestamp: ${timestamp}\nMessage: ${errorMessage}\nStack Trace:\n${stackTrace}`;

  return errorLog;
};

const getFileSize = (size: number): string => {
  if (size == 0) {
    return "0 KB";
  }
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

const getAdaptiveResolution = (
  targetWidth: [number, number],
  targetHeight: [number, number],
  currentWidth: number,
  currentHeight: number
): [string, string] => {
  // 初步计算宽高比例
  const widthRatio = targetWidth[1] / currentWidth;
  const heightRatio = targetHeight[1] / currentHeight;
  const initialScale = Math.min(widthRatio, heightRatio);

  // 初步缩放结果
  let scaledWidth = currentWidth * initialScale;
  let scaledHeight = currentHeight * initialScale;

  // 检查是否需要再次缩放
  if (scaledWidth > targetWidth[1]) {
    const adjustmentScale = targetWidth[1] / scaledWidth;
    scaledWidth = targetWidth[1];
    scaledHeight *= adjustmentScale;
  } else if (scaledHeight > targetHeight[1]) {
    const adjustmentScale = targetHeight[1] / scaledHeight;
    scaledHeight = targetHeight[1];
    scaledWidth *= adjustmentScale;
  }

  // 应用最小宽高限制
  scaledWidth = Math.max(scaledWidth, targetWidth[0]);
  scaledHeight = Math.max(scaledHeight, targetHeight[0]);

  return [`${Math.round(scaledWidth)}px`, `${Math.round(scaledHeight)}px`];
};

const getFileTime = (time: number) => {
  let date = new Date(time);
  return date.toISOString().split("T")[0].replace(/-/g, "/");
};

export {
  generateErrorLog,
  getFileSize,
  getFileSizeArr,
  getFileSizeNumber,
  getAdaptiveResolution,
  getFileTime,
};

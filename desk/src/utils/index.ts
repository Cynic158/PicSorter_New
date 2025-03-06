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
      if (resolution.width === undefined || resolution.height === undefined) {
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
      } else if (deep && item.isDirectory()) {
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
    if (stats && stats.width && stats.height) {
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

const autoRenamer = async (
  picTargets: Array<string>,
  autoConfigs: Array<AutoRenameConfig>
) => {
  // 重命名映射
  let renameMap: Array<{ from: string; to: string }> = [];
  // 判断是否符合图片要求
  const validPicTypes: Array<picType> = ["png", "jpg", "gif", "webp"];
  const isImage = (file: string): boolean => {
    const ext = path.extname(file).toLowerCase().replace(".", "");
    return validPicTypes.includes(ext as picType);
  };
  // 判断是否符合格式
  const validFormat = (
    name: string,
    separator: "-" | "_",
    format: Array<FormatConfigType>
  ) => {
    let nameArr = name.split(separator);
    if (nameArr.length != format.length) {
      // 直接不符合
      return false;
    } else {
      // 检查每个部分是否匹配 format 配置
      let isMatched = true;
      for (let i = 0; i < format.length; i++) {
        const { type, value } = format[i];
        const part = nameArr[i];

        switch (type) {
          case "date":
            if (!/^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/.test(part)) {
              isMatched = false;
            }
            break;
          case "year":
            if (!/^\d{4}$/.test(part)) {
              isMatched = false;
            }
            break;
          case "month":
            if (!/^(0[1-9]|1[0-2])$/.test(part)) {
              isMatched = false;
            }
            break;
          case "day":
            if (!/^(0[1-9]|[12][0-9]|3[01])$/.test(part)) {
              isMatched = false;
            }
            break;
          case "hour":
            if (!/^(0[0-9]|1[0-9]|2[0-3])$/.test(part)) {
              isMatched = false;
            }
            break;
          case "minute":
          case "second":
            if (!/^[0-5][0-9]$/.test(part)) {
              isMatched = false;
            }
            break;
          case "str":
            if (part !== value) {
              isMatched = false;
            }
            break;
          case "timestamp":
            if (!/^\d+$/.test(part)) {
              isMatched = false;
            }
            break;
          case "serial":
            if (!/^\d+$/.test(part)) {
              isMatched = false;
            }
            break;
          default:
            isMatched = false;
        }

        if (!isMatched) break;
      }
      return isMatched;
    }
  };
  // 获取图片名称、大小、创建时间、修改时间
  const getBasePicInfo = async (picPath: string) => {
    const stats = await fs.promises.stat(picPath);
    let name = path.basename(picPath);
    let size = stats.size;
    let createdAt = stats.birthtimeMs;
    let modifiedAt = stats.mtimeMs;
    return {
      picPath,
      name,
      size,
      createdAt,
      modifiedAt,
    };
  };
  const compareFunctions: {
    [key in SortTypeForPic]: (
      a: {
        name: string;
        size: number;
        createdAt: number;
        modifiedAt: number;
        picPath: string;
      },
      b: {
        name: string;
        size: number;
        createdAt: number;
        modifiedAt: number;
        picPath: string;
      }
    ) => number;
  } = {
    nameAsc: (a, b) => {
      const isAEnglish = /^[A-Za-z]/.test(a.name); // 判断图片名称首字符是否为英文
      const isBEnglish = /^[A-Za-z]/.test(b.name);
      const isAChinese = /^[\u4e00-\u9fa5]/.test(a.name); // 判断图片名称首字符是否为中文
      const isBChinese = /^[\u4e00-\u9fa5]/.test(b.name);

      // 如果 a 是非英文非中文，排最前面
      if (!isAEnglish && !isAChinese && (isBEnglish || isBChinese)) return -1;
      if ((isAEnglish || isAChinese) && !isBEnglish && !isBChinese) return 1;

      // 英文名称排在中文名称前面
      if (isAEnglish && !isBEnglish) return -1;
      if (!isAEnglish && isBEnglish) return 1;

      if (isAChinese && !isBChinese) return 1;
      if (!isAChinese && isBChinese) return -1;

      // 如果是同样类型的名称，按照字母顺序比较
      return a.name.localeCompare(b.name);
    },
    nameDesc: (a, b) => {
      const isAEnglish = /^[A-Za-z]/.test(a.name);
      const isBEnglish = /^[A-Za-z]/.test(b.name);
      const isAChinese = /^[\u4e00-\u9fa5]/.test(a.name);
      const isBChinese = /^[\u4e00-\u9fa5]/.test(b.name);

      // 如果 a 是非英文非中文，排最前面
      if (!isAEnglish && !isAChinese && (isBEnglish || isBChinese)) return -1;
      if ((isAEnglish || isAChinese) && !isBEnglish && !isBChinese) return 1;

      // 英文名称排在中文名称前面
      if (isAEnglish && !isBEnglish) return 1;
      if (!isAEnglish && isBEnglish) return -1;

      if (isAChinese && !isBChinese) return -1;
      if (!isAChinese && isBChinese) return 1;

      // 如果是同样类型的文件夹，按照字母顺序反向比较
      return b.name.localeCompare(a.name);
    },
    sizeAsc: (a, b) => a.size - b.size,
    sizeDesc: (a, b) => b.size - a.size,
    createdAtAsc: (a, b) => a.createdAt - b.createdAt,
    createdAtDesc: (a, b) => b.createdAt - a.createdAt,
    modifiedAtAsc: (a, b) => a.modifiedAt - b.modifiedAt,
    modifiedAtDesc: (a, b) => b.modifiedAt - a.modifiedAt,
  };
  // 创建映射
  const generateMap = async (
    picPathGroup: Array<string>,
    config: AutoRenameConfig,
    initSerial: number
  ) => {
    // 先进行排序
    const sortFunction = compareFunctions[config.sortType];
    let picInfoGroup = await Promise.all(picPathGroup.map(getBasePicInfo));
    picInfoGroup.sort(sortFunction);
    let picMap = picInfoGroup.map((item) => {
      return { from: item.picPath, to: "" };
    });

    let now = new Date();
    let timeParts = {
      year: String(now.getFullYear()),
      month: String(now.getMonth() + 1).padStart(2, "0"),
      day: String(now.getDate()).padStart(2, "0"),
      hour: String(now.getHours()).padStart(2, "0"),
      minute: String(now.getMinutes()).padStart(2, "0"),
      second: String(now.getSeconds()).padStart(2, "0"),
    };

    const updatePicMap = (part: string) => {
      picMap.forEach((item, index) => {
        picMap[index].to = item.to + part;
      });
    };
    // 为picMap得到to的图片名称
    let formatIndex = 0;
    for (const item of config.format) {
      if (item.type == "date") {
        updatePicMap(timeParts.year + timeParts.month + timeParts.day);
      } else if (item.type == "str") {
        updatePicMap(item.value);
      } else if (item.type == "serial") {
        picMap.forEach((picItem, picIndex) => {
          let serial = initSerial + picIndex;
          picMap[picIndex].to = picItem.to + serial;
        });
      } else if (item.type == "timestamp") {
        for (const picItem of picMap) {
          await new Promise((resolve) => setTimeout(resolve, 5));
          picItem.to = picItem.to + Date.now();
        }
      } else {
        updatePicMap(timeParts[item.type]);
      }

      if (formatIndex != config.format.length - 1) {
        updatePicMap(config.separator);
      }
      formatIndex = formatIndex + 1;
    }

    // 为to补充路径以及后缀
    // 遍历 picMap，拼接新的 to 值
    for (const picItem of picMap) {
      const ext = path.extname(picItem.from); // 提取文件后缀（包含 .）
      picItem.to = path.join(config.path, picItem.to + ext);
      renameMap.push(picItem);
    }
  };

  await Promise.all(
    autoConfigs.map(async (config) => {
      // 符合格式的图片组，用于计算最大序号值
      let resolveGroup: Array<string> = [];
      // 不符格式的图片组，合并至待重命名组
      let rejectGroup: Array<string> = [];
      // 获取分类文件夹内所有图片
      let imageFiles = await fs.promises.readdir(config.path, {
        withFileTypes: true,
      });

      await Promise.all(
        imageFiles
          .filter((file) => file.isFile() && isImage(file.name))
          .map(async (file) => {
            let fileNameWithoutExt = path.parse(file.name).name;
            if (
              validFormat(fileNameWithoutExt, config.separator, config.format)
            ) {
              resolveGroup.push(file.name);
            } else {
              rejectGroup.push(path.join(config.path, file.name));
            }
          })
      );

      // 检查需不需要提供序号
      let serialItemIndex = config.format.findIndex(
        (item) => item.type == "serial"
      );
      let initSerial = 0;
      if (serialItemIndex != -1 && resolveGroup.length > 0) {
        // 需要提供序号
        let serialGroup = resolveGroup.map((item) => {
          let itemWithoutExt = path.parse(item).name;
          return Number(
            itemWithoutExt.split(config.separator)[serialItemIndex]
          );
        });
        let maxSerial = Math.max(...serialGroup);
        initSerial = maxSerial + 1;
      }
      // 如果仅处理新图片
      if (config.applyNew) {
        await generateMap(picTargets, config, initSerial);
      } else {
        let pathGroup = [...picTargets, ...rejectGroup];
        await generateMap(pathGroup, config, initSerial);
      }
    })
  );

  // 得到处理好的renameMap，执行复制
  await Promise.all(
    renameMap.map(async (item) => {
      await fs.promises.copyFile(item.from, item.to);
    })
  );
};

export {
  generateErrorLog,
  checkPathsExist,
  filterImages,
  getFolderInfo,
  autoRenamer,
};

import { ipcMain, shell } from "electron";
import { generateErrorLog, checkPathsExist } from "../utils/index";

const toolHandler = () => {
  // 调整指定图片
  ipcMain.handle(
    "Tool_adjustPic" as ToolApi,
    async (_event, picPath: string) => {
      try {
        // 检查对应图片存不存在
        const checkRes = await checkPathsExist("file", [picPath]);
        if (!checkRes.success) {
          return {
            success: false,
            data: "onlymessage指定的图片丢失",
          };
        }
        await shell.openPath(picPath);
        return {
          success: true,
          data: "",
        };
      } catch (error) {
        // 编写错误报告
        let errorLog = generateErrorLog(error);
        return {
          success: false,
          data: errorLog,
        };
      }
    }
  );
};

export default toolHandler;

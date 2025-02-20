import { observable, action, runInAction } from "mobx";
import { generateErrorLog } from "../../utils";
import WinApi from "../../api/win";

const winStore = observable(
  {
    // 报错对话框部分
    // 是否显示报错对话框
    showErrorDialog: false,
    // 错误报告内容
    errorLog: "",
    // 错误的操作类型
    errorAction: "",
    // 显示报错对话框
    setErrorDialog(log: string, action: string) {
      if (log.startsWith("onlymessage")) {
        // 仅打印消息
        this.setMessage({
          msg: log.replace("onlymessage", ""),
          type: "error",
        });
      } else {
        runInAction(() => {
          this.errorLog = log;
          this.errorAction = action;
          this.showErrorDialog = true;
        });
      }
    },
    // 隐藏报错对话框
    hideErrorDialog() {
      this.showErrorDialog = false;
    },

    async copyContent(content?: string) {
      let funcAction = "复制内容";
      try {
        if (!content) {
          let res = await WinApi.COPY(this.errorLog);
          if (res.success) {
            return true;
          } else {
            // 报错
            this.setErrorDialog(res.data, funcAction);
            return false;
          }
        } else {
          let res = await WinApi.COPY(content);
          if (res.success) {
            return true;
          } else {
            // 报错
            this.setErrorDialog(res.data, funcAction);
            return false;
          }
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        this.setErrorDialog(log, funcAction);
        return false;
      }
    },

    async openLink(url: string) {
      let funcAction = "打开链接";
      try {
        let res = await WinApi.LINK(url);
        if (res.success) {
          return true;
        } else {
          // 报错
          this.setErrorDialog(res.data, funcAction);
          return false;
        }
      } catch (error) {
        // 报错
        let log = generateErrorLog(error);
        this.setErrorDialog(log, funcAction);
        return false;
      }
    },

    // 消息组件部分
    // 是否显示消息组件
    showMessage: false,
    setShowMessage(bool: boolean) {
      this.showMessage = bool;
    },
    // 消息队列
    messageList: [] as Array<MessageType>,
    addMessage(msg: MessageType) {
      this.messageList.push(msg);
    },
    clearMessage() {
      this.messageList.shift();
    },
    // 消息定时器
    messageTimer: null as null | ReturnType<typeof setInterval>,
    transitionTimer: null as null | ReturnType<typeof setTimeout>,
    // 清除所有定时器
    clearAllTimers() {
      if (this.messageTimer !== null) {
        clearInterval(this.messageTimer);
        this.messageTimer = null;
      }
      if (this.transitionTimer !== null) {
        clearTimeout(this.transitionTimer);
        this.transitionTimer = null;
      }
    },
    // 显示消息
    setMessage(msg: MessageType) {
      this.addMessage(msg);

      // 如果主循环未启动，则启动主循环
      if (this.messageTimer === null) {
        // 显示当前消息
        this.runMessageLoop();
        this.messageTimer = setInterval(() => {
          this.runMessageLoop();
        }, 5050);
      }
    },
    // 主消息循环
    runMessageLoop() {
      if (this.messageList.length === 0) {
        // 如果队列为空，清除主循环定时器
        this.clearAllTimers();
        return;
      }
      // 显示当前消息
      this.setShowMessage(true);

      // 设置隐藏和移除逻辑
      this.transitionTimer = setTimeout(() => {
        // 隐藏消息
        this.setShowMessage(false);

        // 等待过渡结束后移除队列消息
        this.transitionTimer = setTimeout(() => {
          this.clearMessage(); // 移除第一条消息
        }, 300); // 等待过渡时间
      }, 4700); // 等待显示时间
    },
  },
  {
    setErrorDialog: action,
    hideErrorDialog: action,
    copyContent: action,
    openLink: action,
    setShowMessage: action,
    addMessage: action,
    clearMessage: action,
    clearAllTimers: action,
    setMessage: action,
    runMessageLoop: action,
  }
);

export default winStore;

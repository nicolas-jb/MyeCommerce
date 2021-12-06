import log4js from "log4js";

log4js.configure({
  appenders: {
    miConsoleLogger: { type: "console" },
    miFileLogger: { type: "file", filename: "error.log" },
  },
  categories: {
    default: { appenders: ["miConsoleLogger"], level: "info" },
    errorFile: { appenders: ["miFileLogger"], level: "error" },
  },
});

export default log4js;

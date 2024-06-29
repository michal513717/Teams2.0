import * as log4js from "log4js";
import { Logger } from "../models/common.models";

//TODO discuss whether it should be singleton or class with static methods
class LoggerHelper {

  constructor() {
    this.configureLogger();
  }

  private configureLogger(): void {
    log4js.configure({
      appenders: {
        out: { type: "stdout" },
        app: { type: "file", filename: "./loggerOutput/application.log" },
      },
      categories: {
        default: { appenders: ["out", "app"], level: "debug" },
      },
    });
  }

  public getLogger(instanceName: string): Logger {
    return log4js.getLogger(instanceName);
  }
}

var instance = new LoggerHelper();

export default instance;
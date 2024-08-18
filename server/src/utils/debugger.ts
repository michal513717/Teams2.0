import { Application } from "express";
import { getLogger } from "log4js";

export class Debugger {

  public static debugRequest = async (application: Application) => {

    const logger = getLogger("Main Router");

    application.use((req, res, next) => {
      logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

      res.on('finish', () => {
        logger.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
      });

      next();
    });
  }
}
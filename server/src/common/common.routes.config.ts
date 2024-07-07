import { CommonRoutesInitData } from "../models/common.models";
import { Logger } from "../models/common.models";
import LoggerHelper from "./../utils/logger";
import type { Application } from "express";
import * as http from "http";

export abstract class CommonRoutesConfig {

  private routeName: string;
  private version: string;
  protected app: Application;
  protected logger!: Logger;

  public static statusMessage = {
    FAILED: "Failed",
    SUCCESS: "Success",
  };

  protected static routeType = {
    PUT: "PutRoutes",
    GET: "GetRoutes",
    POST: "PostRoutes",
    PATCH: "PatchRoutes",
    DELETE: "DeleteRoutes",
    SOCKET: "SocketRoutes",
    NOT_VALID: "NotValidRoutes",
  };

  constructor(app: Application, routeName: string, version: string, server?: http.Server) {
    this.routeName = routeName;
    this.app = app;
    this.version = version;

    this.initLogger();
    this.init({
      app,
      routeName,
      version,
      httpServer: typeof server === "undefined" ? null : server
    });

    this.configureRoute();
  }

  //To implements methods before configure routes
  protected init(initData: CommonRoutesInitData): void{}

  public initLogger(): void {
    this.logger = LoggerHelper.getLogger(this.getName());
  }

  public getName(): string {
    return this.routeName;
  }

  public getVersion(): string {
    return this.version;
  }

  public getApp(): Application {
    return this.app;
  }

  abstract configureRoute(): Application;
}
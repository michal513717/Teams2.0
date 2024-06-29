import * as log4js from "log4js";
import * as http from "http";
import { Application } from "express";

export type Logger = log4js.Logger;
export type HttpServer = http.Server;
export type CommonRoutesInitData = {
  app: Application;
  routeName: string;
  version: string
  httpServer: HttpServer | null;
};
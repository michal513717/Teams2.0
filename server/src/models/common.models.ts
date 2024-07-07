import * as log4js from "log4js";
import * as http from "http";
import { Application } from "express";
import { Db } from "mongodb";

export type Logger = log4js.Logger;
export type HttpServer = http.Server;
export type MongoDatabase = Db;
export type CommonRoutesInitData = {
  app: Application;
  routeName: string;
  version: string
  httpServer: HttpServer | null;
};
export type NextFunction = any;
export type ChatSocketType = any;
export type SessionRecord = {
  userID: string;
  userName: string;
  connected: boolean;
}
import * as log4js from "log4js";
import * as http from "http";
import { Application } from "express";
import { Db } from "mongodb";
import { Socket } from "socket.io";
import { DefaultEventsMap, } from "socket.io/dist/typed-events";

export type Logger = log4js.Logger;
export type HttpServer = http.Server;
export type MongoDatabase = Db;
export type NextFunction = any;
export type ChatSocketType = any;
export type ClientToServerEvents = any;
export type ServerToClientEvents = any;
export type InterServerEvents = any;
export type SocketData = any;
export type SessionRecord = {
  userID: string;
  userName: string;
  connected: boolean;
};
export type CommonRoutesInitData = {
  app: Application;
  routeName: string;
  version: string
  httpServer: HttpServer | null;
};
export type SocketConection = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
import * as log4js from "log4js";
import * as http from "http";
import { Application } from "express";
import { Db } from "mongodb";
import { Socket } from "socket.io";

export type Logger = log4js.Logger;
export type HttpServer = http.Server;
export type MongoDatabase = Db;
export type NextFunction = any;
export type ChatSocketType = any & Socket;
export type SessionRecord = {
  socketId: string;
  userName: string;
  connected: boolean;
};
export type CommonRoutesInitData = {
  app: Application;
  routeName: string;
  version: string
  httpServer: HttpServer | null;
};
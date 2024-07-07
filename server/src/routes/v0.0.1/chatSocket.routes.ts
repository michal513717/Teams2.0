import { Application, NextFunction } from "express";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { Server } from "socket.io";
import { ChatSocketType, CommonRoutesInitData, HttpServer } from "../../models/common.models";
import { InvalidTokenError } from "../../utils/errors";
import { Authenticator } from "../../middlewares/aunthenicator";
import Jwt from "jsonwebtoken";
import { SECRET } from "../../utils/configs/secret";
import { chatSessionManager } from "../../managers/chatSessionManager";
import { databaseManager } from "../../managers/databaseManager";
import { ChatInitData, ChatRecord, ConversationData } from "../../models/mongose.schema";
import { Timestamp } from "mongodb";

export class ChatSockets extends CommonRoutesConfig {

  private activeSockets: string[] = [];
  private serverIO!: Server;

  constructor(app: Application, server: HttpServer){
    
    super(app, "Chats routes", "0.0.1", server);
  }

  protected init(initData: CommonRoutesInitData): void {

    if(initData.httpServer !== null){

      this.initSocketServer(initData.httpServer);
    }

    super.init(initData);
  }

  private initSocketServer(httpServer: HttpServer): void{
    this.serverIO = new Server(httpServer, {  
      cors: {
        //@ts-ignore
        origins: ["http://localhost:5500/dist"]
      }
    });
  }

  configureRoute(): Application {

    this.serverIO.use(Authenticator.verifyTokenSocketMiddleware);

    this.serverIO.on("connection", async(socket: ChatSocketType) => {

      chatSessionManager.saveSession(socket.sessionID, {
        userID: socket.userID,
        userName: socket.userName,
        connected: true
      });

      socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID
      });

      socket.join(socket.userID);

      const chatHistory = await databaseManager.getAllMesseges(socket.userName);
      let messegesData: ChatInitData[] = [];

      chatHistory.forEach((chatRecord) => {
        chatRecord.messages.forEach((messege) => {
          messegesData.push({
            from: messege.sender,
            message: messege.message,
            to: messege.sender !== chatRecord.members[0] ? chatRecord.members[1] : chatRecord.members[1]//Need to fix types
          })
        });
      });
      
      socket.emit("init-chats", messegesData);


      socket.broadcast.emit("user-connected", {
        userID: socket.userID,
        username: socket.username,
        connected: true,
        messages: [],
      });

      socket.on('private-message', ({ content, to }: any) => {
        const data: ConversationData = {
          to: to,
          message: content,
          from: socket.userName
        };

        databaseManager.saveMessage(data);
        socket.to(to).to(socket.userID).emit("private-message", data);
      });

      socket.on('disconnect', async() => {
        socket.broadcast.emit('user-disconnected', socket.userID);
        chatSessionManager.saveSession(socket.sessionID, {
          userID: socket.userID,
          userName: socket.userName,
          connected: false
        });
      });

    });

    return this.getApp();
  }
}
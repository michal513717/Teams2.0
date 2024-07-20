import { CommonRoutesInitData, HttpServer } from "../../models/common.models";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { ChatMiddlewareHandler } from "../../middlewares/chatMiddleware";
import { chatSessionManager } from "../../managers/chatSessionManager";
import { databaseManager } from "../../managers/databaseManager";
import { Application } from "express";
import { Server, Socket } from "socket.io";


export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server;

  constructor(app: Application, server: HttpServer){
    
    super(app, "Sockets routes", "0.0.1", server);
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
        origin: '*'
      }
    });
  }

  configureRoute(): Application {

    this.serverIO.use(ChatMiddlewareHandler.verifyConnection);

    this.serverIO.use(ChatMiddlewareHandler.createSession);

    this.serverIO.on('connection', socket => {

      this.configureWebRTCConnection(socket);

      this.configureChatConnection(socket);
    });

    return this.getApp();
  }

  private configureWebRTCConnection = (socket: Socket) => {
    socket.on("make-answer", (data) => {
      socket.to(data.to).emit("answer-made", {
        socket: socket.id,
        answer: data.answer
      });
    });
  }

  private configureChatConnection = async (socket: Socket & any) => {
    
    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID
    });

    socket.join(socket.userID);

    socket.emit("init-chats", await databaseManager.getUserChatHistory(socket.userName));

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      username: socket.username,
      connected: true,
      messages: [],
    });

    socket.on('private-message', async ({ content, to }: any) => {

      const recivedID = chatSessionManager.findSocketIdByUserName(to);

      const messageData = {
        to: to,
        message: content,
        from: socket.userName,
        timestamp: new Date(),
      };

      databaseManager.saveMessage(messageData);
      
      socket.to(recivedID).to(socket.userID).emit("private-message", {
        to: to,
        message: content,
        from: socket.userName
      });
    });

    socket.on('disconnect', async() => {
      socket.broadcast.emit('user-disconnected', socket.userID);
      chatSessionManager.saveSession(socket.sessionID, {
        userID: socket.userID,
        userName: socket.userName,
        connected: false
      });
    });
  }
}
import { ClientToServerEvents, CommonRoutesInitData, HttpServer, InterServerEvents, ServerToClientEvents, SocketConection, SocketData } from "../../models/common.models";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { Application } from "express";
import { Server } from "socket.io";
import { chatSessionManager } from "../../managers/chatSessionManager";
import { databaseManager } from "../../managers/databaseManager";
import { ConversationData } from "../../models/mongose.schema";
import { ChatMiddlewareHandler } from "../../middlewares/chatMiddleware";

export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server<     
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >;

  constructor(app: Application, server: HttpServer){
    
    super(app, "Scokests routes", "0.0.1", server);
  }

  protected init(initData: CommonRoutesInitData): void {

    if(initData.httpServer !== null){
      this.initSocketServer(initData.httpServer);
    } else {
      this.logger.warn("Server http not provided");
    }

    super.init(initData);
  }

  private initSocketServer(httpServer: HttpServer): void{
    this.serverIO = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(httpServer, {  
      cors: {
        origin: "*"
      }
    });
  }

  public configureRoute(): Application {

    //* Firstly we need check token or sessionID
    this.serverIO.use(ChatMiddlewareHandler.verifyConnection);

    //* If connection contains token or sessionID, we can create session
    this.serverIO.use(ChatMiddlewareHandler.createSession);

    this.serverIO.on('connection', socket => {

      this.configureWebRtcConnection(socket);

      this.configureChatConnection(socket);
    })

    return this.getApp();
  };

  
  //* WebRTC
  private configureWebRtcConnection(socket: SocketConection): void {
    socket.on("make-answer", (data) => {
      socket.to(data.to).emit("answer-made", {
        socket: socket.id,
        answer: data.answer
      });
    });
  }

  private async configureChatConnection(socket: any): Promise<void> {

    socket.emit("init-chats", await databaseManager.getUserChatHistory(socket.userName));

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      username: socket.username,
      connected: true,
    });

    socket.on('private-message', async ({ content, to }: any) => {

      const recivedID = chatSessionManager.findSocketIdByUserName(to);

      databaseManager.saveMessage({
        to: to,
        message: content,
        from: socket.userName
      });
      
      socket
        .to(recivedID)
        .to(socket.userID)
        .emit("private-message", {
          to: to,
          message: content,
          from: socket.userName
        });
    });

    socket.on('disconnect', async() => {

      socket.broadcast.emit('user-disconnected', {
        userID: socket.userID,
        userName: socket.userName,
        connected: false
      });

      chatSessionManager.saveSession(socket.sessionID, {
        userID: socket.userID,
        userName: socket.userName,
        connected: false
      });
    });
  }
}
import { CommonRoutesInitData, HttpServer } from "../../models/common.models";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { ChatMiddlewareHandler } from "../../middlewares/chatMiddleware";
import { ChatSessionManager, chatSessionManager } from "../../managers/chatSessionManager";
import { databaseManager } from "../../managers/databaseManager";
import { Application } from "express";
import { Server, Socket } from "socket.io";
import { APPLICATION_CONFIG } from "../../utils/configs/applicationConfig";
import { VideoConnectionManager, videoConnectionManager } from "../../managers/videoConnectionManager";


export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server;
  private chatSessionManager!: ChatSessionManager;
  private videoConnectionManager!: VideoConnectionManager;

  constructor(app: Application, server: HttpServer) {

    super(app, "Sockets routes", "0.0.1", server);
  }

  protected init(initData: CommonRoutesInitData): void {

    if (initData.httpServer !== null) {

      this.initSocketServer(initData.httpServer);
    }

    this.initManagers();

    super.init(initData);
  }

  private initManagers(): void {

    this.chatSessionManager = chatSessionManager;
    this.videoConnectionManager = videoConnectionManager;
  }

  private initSocketServer(httpServer: HttpServer): void {
    this.serverIO = new Server(httpServer, {
      cors: {
        origin: '*'
      }
    });
  }

  public configureRoute(): Application {

    this.serverIO.use(ChatMiddlewareHandler.verifyConnection);

    this.serverIO.use(ChatMiddlewareHandler.createSession);

    this.serverIO.on('connection', socket => {

      this.configureWebRTCConnection(socket);

      this.configureChatConnection(socket);
    });

    return this.getApp();
  }

  private configureWebRTCConnection = (socket: Socket) => {

    this.videoConnectionManager.setupCallUser(socket);

    this.videoConnectionManager.setupMakeAnswer(socket);
  }

  private configureChatConnection = async (socket: Socket & any) => {

    socket.emit("session", {
      sessionID: socket.sessionID,
      userID: socket.userID
    });

    socket.join(socket.userID);

    socket.emit("init-chats", await databaseManager.getUserChatHistory(socket.userName));

    const allSessions = this.chatSessionManager.findAllSessions();

    socket.emit("all-users", allSessions);

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      userName: socket.userName,
      connected: true,
      messages: [],
    });

    socket.on('private-message', async ({ content, to }: any) => {

      const recivedID = this.chatSessionManager.findSocketIdByUserName(to);

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
        from: socket.userName,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', async () => {
      socket.broadcast.emit('user-disconnected', socket.userName);
      this.chatSessionManager.removeSession(socket.socketId);
    });
  }
}
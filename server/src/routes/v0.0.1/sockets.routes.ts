import { CommonRoutesInitData, HttpServer } from "../../models/common.models";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { ChatMiddlewareHandler } from "../../middlewares/chatMiddleware";
import { chatSessionManager } from "../../managers/chatSessionManager";
import { databaseManager } from "../../managers/databaseManager";
import { Application } from "express";
import { Server, Socket } from "socket.io";
import { APPLICATION_CONFIG } from "../../utils/configs/applicationConfig";


export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server;

  constructor(app: Application, server: HttpServer) {

    super(app, "Sockets routes", "0.0.1", server);
  }

  protected init(initData: CommonRoutesInitData): void {

    if (initData.httpServer !== null) {

      this.initSocketServer(initData.httpServer);
    }

    super.init(initData);
  }

  private initSocketServer(httpServer: HttpServer): void {
    this.serverIO = new Server(httpServer, {
      cors: {
        methods: ["GET", "POST"],
        credentials: true,
        origin: APPLICATION_CONFIG.CORS_CONFIG.origin,
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

    socket.on("call-user", data => {

      const recivedID = chatSessionManager.findSocketIdByUserName(data.to) as string;

      socket.to(recivedID).emit("call-made", {
        offer: data.offer,
        socket: socket.id
      });
    });

    socket.on("make-answer", (data) => {

      const recivedID = chatSessionManager.findSocketIdByUserName(data.to) as string;

      socket.to(recivedID).emit("answer-made", {
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

    const allSessions = chatSessionManager.findAllSessions();

    socket.emit("all-users", allSessions);

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      userName: socket.userName,
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
        from: socket.userName,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', async () => {
      socket.broadcast.emit('user-disconnected', socket.userName);
      chatSessionManager.removeSession(socket.socketId);
    });
  }
}
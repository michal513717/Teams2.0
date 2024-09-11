import { VideoConnectionManager } from "../../managers/videoConnectionManager";
import { ChatConnectionManager } from "../../managers/chatConnectionManager";
import { CommonRoutesInitData, HttpServer } from "../../models/common.models";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { ChatMiddlewareHandler } from "../../middlewares/chatMiddleware";
import ManagersCollection from "../../managers/managersCollection";
import { Application } from "express";
import { Server, Socket } from "socket.io";
import { SessionManager } from "../../managers/sessionManager";


export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server;
  private videoConnectionManager!: VideoConnectionManager;
  private chatConnectionManager!: ChatConnectionManager;
  private chatMiddlewareHandler!: ChatMiddlewareHandler;
  private sessionsManager!: SessionManager;

  constructor(app: Application, server: HttpServer) {

    super(app, "Sockets routes", "0.0.1", server);
  }

  protected init(initData: CommonRoutesInitData): void {

    if (initData.httpServer !== null) {

      this.initSocketServer(initData.httpServer);
    }

    this.initManagers();
    this.initHandlers();

    super.init(initData);
  }

  private initHandlers(): void {
    this.chatMiddlewareHandler = new ChatMiddlewareHandler();
  }

  private initManagers(): void {

    this.videoConnectionManager = ManagersCollection.getManagerById<VideoConnectionManager>("videoConnectionManager");
    this.chatConnectionManager = ManagersCollection.getManagerById<ChatConnectionManager>("chatConnectionManager");
    this.sessionsManager = ManagersCollection.getManagerById<SessionManager>("sessionManager");
  }

  private initSocketServer(httpServer: HttpServer): void {
    this.serverIO = new Server(httpServer, {
      cors: {
        origin: '*'
      }
    });
  }

  public override configureControllers(): void {}

  public override configureRoute(): Application {

    this.serverIO.use(this.chatMiddlewareHandler.verifyConnection);

    this.serverIO.use(this.chatMiddlewareHandler.createSession);

    this.serverIO.on('connection', socket => {

      this.configureWebRTCConnection(socket);

      this.configureChatConnection(socket);

      this.configureDisconnect(socket);
    });

    return this.getApp();
  }

  private async configureWebRTCConnection (socket: Socket): Promise<void>{

    this.videoConnectionManager.setupCallUser(socket);

    this.videoConnectionManager.setupMakeAnswer(socket);

    this.videoConnectionManager.setupCloseConnection(socket);
  }

  private async configureChatConnection (socket: Socket & any): Promise<void> {

    this.chatConnectionManager.setupPrivateMessage(socket);
  }

  private async configureDisconnect(socket: Socket & any): Promise<void> {
    
    socket.on("disconnect", async () => {
      this.sessionsManager.changeUserStatusToDisconnect(socket.userName);
    });
  }
}
import { VideoConnectionManager } from "../../managers/videoConnectionManager";
import { ChatConnectionManager } from "../../managers/chatConnectionManager";
import { CommonRoutesInitData, HttpServer } from "../../models/common.models";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { ChatMiddlewareHandler } from "../../middlewares/chatMiddleware";
import ManagersCollection from "../../managers/managersCollection";
import { Application } from "express";
import { Server, Socket } from "socket.io";


export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server;
  private videoConnectionManager!: VideoConnectionManager;
  private chatConnectionManager!: ChatConnectionManager;
  private chatMiddlewareHandler!: ChatMiddlewareHandler;

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
    });

    return this.getApp();
  }

  private configureWebRTCConnection = (socket: Socket) => {

    this.videoConnectionManager.setupCallUser(socket);

    this.videoConnectionManager.setupMakeAnswer(socket);

    this.videoConnectionManager.setupCloseConnection(socket);
  }

  private configureChatConnection = async (socket: Socket & any) => {

    this.chatConnectionManager.setupPrivateMessage(socket);
  }
}
import { VideoConnectionManager, videoConnectionManager } from "../../managers/videoConnectionManager";
import { ChatConnectionManager, chatConnectionManager } from "../../managers/chatConnectionManager";
import { CommonRoutesInitData, HttpServer } from "../../models/common.models";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { ChatMiddlewareHandler } from "../../middlewares/chatMiddleware";
import { Application } from "express";
import { Server, Socket } from "socket.io";


export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server;
  private videoConnectionManager!: VideoConnectionManager;
  private chatConnectionManager!: ChatConnectionManager;

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

    this.videoConnectionManager = videoConnectionManager;
    this.chatConnectionManager = chatConnectionManager;
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

    this.videoConnectionManager.setupCloseConnection(socket);
  }

  private configureChatConnection = async (socket: Socket & any) => {

    this.chatConnectionManager.setupPrivateMessage(socket);
  }
}
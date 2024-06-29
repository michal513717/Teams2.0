import { Application } from "express";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { Server } from "socket.io";
import { CommonRoutesInitData, HttpServer } from "../../models/common.models";

export class SocketRoutes extends CommonRoutesConfig {

  private serverIO!: Server;

  constructor(app: Application, server: HttpServer){
    
    super(app, "Scokests routes", "0.0.1", server);
  }

  protected init(initData: CommonRoutesInitData): void {

    if(initData.httpServer !== null){

      this.initSocketServer(initData.httpServer);
    }

    super.init(initData);
  }

  private initSocketServer(httpServer: HttpServer): void{
    this.serverIO = new Server(httpServer);
  }

  configureRoute(): Application {

    this.serverIO.on('connection', socket => {
      // socket.on('join-room', this.clientJoinRoomCallback);
      socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)

        //@ts-ignore
        socket.to(roomId).broadcast.emit('user-connected', userId)
    
        socket.on('disconnect', () => {
          //@ts-ignore
          socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
      })
    })

    return this.getApp();
  }

  private clientJoinRoomCallback(): void{

  }
}
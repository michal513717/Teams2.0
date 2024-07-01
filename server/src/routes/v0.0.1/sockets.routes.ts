import { Application } from "express";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { Server } from "socket.io";
import { CommonRoutesInitData, HttpServer } from "../../models/common.models";

export class SocketRoutes extends CommonRoutesConfig {

  private activeSockets: string[] = [];
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
    this.serverIO = new Server(httpServer, {  
      cors: {
        //@ts-ignore
        origins: ["http://localhost:5500/dist"]
      }
    });
  }

  configureRoute(): Application {

    this.serverIO.on('connection', socket => {

      socket.on("disconnect", () => {
        
        this.activeSockets = this.activeSockets.filter(
          (existingSocket) => existingSocket !== socket.id
        );

        socket.broadcast.emit("remove-user", {
          socketId: socket.id,
        });
      });

      socket.on("make-answer", (data) => {
        socket.to(data.to).emit("answer-made", {
          socket: socket.id,
          answer: data.answer
        });
      });

      const existingSocket = this.activeSockets.find(
        (existingSocket) => existingSocket === socket.id
      );

      if (!existingSocket) {
        this.activeSockets.push(socket.id);

        socket.emit("update-user-list", {
          users: this.activeSockets.filter(
            (existingSocket) => existingSocket !== socket.id
          ),
        });

        socket.broadcast.emit("update-user-list", {
          users: [socket.id],
        });
      };
    })

    return this.getApp();
  }
}
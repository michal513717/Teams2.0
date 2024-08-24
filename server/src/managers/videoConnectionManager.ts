import { Socket } from "socket.io";
import { SessionManager } from "./sessionManager";
import { GLOBAL_CONFIG } from "../../../config.global";
import ManagersCollection from "./managersCollection";
import { Manager } from "../common/common.manager.config";

export class VideoConnectionManager extends Manager{

  private sessionManager!: SessionManager;

  protected async init(): Promise<void> {
    this.setupLogger("VideoConnectionManager");
    this.setupManagers();
    this.finishSetup();
  }

  private setupManagers(): void {
    this.sessionManager = ManagersCollection.getManagerById<SessionManager>("sessionManager");
  }

  //TODO specify types
  public setupCallUser(socket: Socket & any): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_USER, (data: any) => {

      const receivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      //TODO add error handler if reciverID is null

      socket.to(receivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, {
        offer: data.offer,
        socket: socket.id,
        userName: socket.userName
      });
    });
  }

  //TODO specify types
  public setupMakeAnswer(socket: Socket & any): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.MAKE_ANSWER, (data: any) => {

      const receivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      //TODO add error handler if reciverID is null

      socket.to(receivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.ANSWER_MADE, {
        socket: socket.id,
        answer: data.answer,
        userName: socket.userName,
        isCallAccepted: data.isCallAccepted
      });
    }); 
  }

  //TODO specify types
  public setupCloseConnection(socket: Socket & any): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.END_CALL, (data: any) => {

      const receivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      socket.to(receivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.USER_END_CALL, {
        socket: socket.id,
        userName: socket.userName
      })
    })
  }
}
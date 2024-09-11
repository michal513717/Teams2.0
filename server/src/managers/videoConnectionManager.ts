import { Socket } from "socket.io";
import { SessionManager } from "./sessionManager";
import { GLOBAL_CONFIG } from "../../../config.global";
import ManagersCollection from "./managersCollection";
import { Manager } from "../common/common.manager.config";
import { ChatSocketType } from "../models/common.models";
import { CallUserData, MakeAnswerData, CloseConnectionData } from "../models/video.models";

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

  public setupCallUser(socket: ChatSocketType): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_USER, (data: CallUserData) => {

      const receivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      if (!receivedID) {
        this.logger.error(`Receiver ID is null. Cannot make a call to user: ${data.to}`);
        return;
      }

      socket.to(receivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, {
        offer: data.offer,
        socket: socket.id,
        userName: socket.userName
      });
    });
  }

  public setupMakeAnswer(socket: ChatSocketType): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.MAKE_ANSWER, (data: MakeAnswerData) => {

      const receivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      if (!receivedID) {
        this.logger.error(`Receiver ID is null. Cannot send answer to user: ${data.to}`);
        return;
      }

      socket.to(receivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.ANSWER_MADE, {
        socket: socket.id,
        answer: data.answer,
        userName: socket.userName,
        isCallAccepted: data.isCallAccepted
      });
    }); 
  }

  public setupCloseConnection(socket: ChatSocketType): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.END_CALL, (data: CloseConnectionData) => {

      const receivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      socket.to(receivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.USER_END_CALL, {
        socket: socket.id,
        userName: socket.userName
      })
    })
  }
}
import { Socket } from "socket.io";
import { sessionManager, SessionManager } from "./sessionManager";
import { GLOBAL_CONFIG } from "../../../config.global";

export class VideoConnectionManager {

  private sessionManager!: SessionManager;

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupManagers();
  }

  private setupManagers(): void {
    this.sessionManager = sessionManager;
  }

  public setupCallUser(socket: Socket): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_USER, data => {

      const recivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      //TODO add error handler if reciverID is null

      socket.to(recivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.CALL_MADE, {
        offer: data.offer,
        socket: socket.id
      });
    });
  }

  public setupMakeAnswer(socket: Socket): void {
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.MAKE_ANSWER, (data) => {

      const recivedID = this.sessionManager.findSocketIdByUserName(data.to) as string;

      //TODO add error handler if reciverID is null

      socket.to(recivedID).emit(GLOBAL_CONFIG.SOCKET_EVENTS.ANSWER_MADE, {
        socket: socket.id,
        answer: data.answer
      });
    });
  }
}

export const videoConnectionManager = new VideoConnectionManager();
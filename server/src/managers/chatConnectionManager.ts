import { Socket } from "socket.io";
import { GLOBAL_CONFIG } from "../../../config.global";
import { sessionManager, SessionManager } from "./sessionManager";
import { databaseManager, DatabaseManager } from "./databaseManager";


export class ChatConnectionManager {

  private sessionManager!: SessionManager
  private databaseManager!: DatabaseManager;

  constructor() {
    this.init();
  }

  private init(): void {
    this.setupManagers();
  }

  private setupManagers(): void {
    this.sessionManager = sessionManager;
    this.databaseManager = databaseManager;
  }

  public async setupPrivateMessage(socket: Socket & any): Promise<void> {

    socket.join(socket.userID);

    socket.emit("init-chats", await this.databaseManager.getUserChatHistory(socket.userName));

    const allSessions = this.sessionManager.findAllSessions();

    socket.emit("all-users", allSessions);

    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      userName: socket.userName,
      connected: true,
      messages: [],
    });

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.SEND_PRIVATE_MESSAGE, async ({ content, to }: any) => {

      const recivedID = this.sessionManager.findSocketIdByUserName(to);

      const messageData = {
        to: to,
        message: content,
        from: socket.userName,
        timestamp: new Date(),
      };

      databaseManager.saveMessage(messageData);

      socket.to(recivedID).to(socket.userID)
        .emit(GLOBAL_CONFIG.SOCKET_EVENTS.SEND_PRIVATE_MESSAGE, {
          to: to,
          message: content,
          from: socket.userName,
          timestamp: new Date(),
        });
    });

    socket.on('disconnect', async () => {
      socket.broadcast.emit('user-disconnected', socket.userName);
      this.sessionManager.removeSession(socket.socketId);
    });
  }
}

export const chatConnectionManager = new ChatConnectionManager();
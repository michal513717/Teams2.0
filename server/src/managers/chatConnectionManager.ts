import { Socket } from "socket.io";
import { GLOBAL_CONFIG } from "../../../config.global";
import { SessionManager } from "./sessionManager";
import { DatabaseManager } from "./databaseManager";
import ManagersCollection from "./managersCollection";
import { Manager } from "../common/common.manager.config";
import { UnReadMessageSchema } from "../models/mongose.schema";

export class ChatConnectionManager extends Manager{

  private sessionManager!: SessionManager
  private databaseManager!: DatabaseManager;

  protected async init(): Promise<void> {
    this.setupLogger("ChatConnectionManager");
    this.setupManagers();
    this.finishSetup();
  }

  private setupManagers(): void {
    this.sessionManager = ManagersCollection.getManagerById<SessionManager>('sessionManager');
    this.databaseManager = ManagersCollection.getManagerById<DatabaseManager>('databaseManager');
  }

  public async setupPrivateMessage(socket: Socket & any): Promise<void> {

    socket.join(socket.userID);

    socket.emit(GLOBAL_CONFIG.SOCKET_EVENTS.INIT_CHATS, await this.databaseManager.getUserChatHistory(socket.userName));

    const allSessions = this.sessionManager.findAllSessions();

    //TODO change variable to const (Config)
    socket.emit("all-users", allSessions);

    //TODO is used? change variable to const (Config)
    socket.broadcast.emit("user-connected", {
      userID: socket.userID,
      userName: socket.userName,
      connected: true,
      messages: [],
    });

    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.SEND_PRIVATE_MESSAGE, async ({ content, to }: any) => {

      const receivedID = this.sessionManager.findSocketIdByUserName(to);

      const messageData = {
        to,
        message: content,
        from: socket.userName,
        timestamp: new Date(),
      };

      this.databaseManager.saveMessage(messageData);

      if(receivedID === null) return;

      socket.to(receivedID)
        .emit(GLOBAL_CONFIG.SOCKET_EVENTS.SEND_PRIVATE_MESSAGE, {
          to,
          message: content,
          from: socket.userName,
          timestamp: new Date(),
        });
    });

    //TODO refactor
    socket.on(GLOBAL_CONFIG.SOCKET_EVENTS.MESSAGE_READ, async ({ from, to }: UnReadMessageSchema) => {
      if(from === "" || to === "") return;
      this.databaseManager.markMessageAsRead({from, to});
    })

    socket.on('disconnect', async () => {
      socket.broadcast.emit('user-disconnected', socket.userName);
      this.sessionManager.removeSession(socket.socketId);
    });
  }
}
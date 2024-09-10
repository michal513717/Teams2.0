import { SessionManager } from "../managers/sessionManager";
import { ChatSocketType, NextFunction } from "../models/common.models";
import { InvalidTokenError } from "../utils/errors";
import { Authenticator } from "./authenticator";
import ManagerCollection from "../managers/managersCollection";

export class ChatMiddlewareHandler {

  private sessionManager!: SessionManager;

  constructor(){
    this.initManagers();
  }

  private initManagers(): void{
    this.sessionManager = ManagerCollection.getManagerById<SessionManager>('sessionManager');
  }

  public verifyConnection = async (socket: ChatSocketType, next: NextFunction) => {
    try {
      let userToken = socket.handshake.auth.token as string;

      if (!userToken) {
        userToken = socket.handshake.headers.auth as string;
      }

      if (!userToken) {
        return next();
      }

      const parsedToken = await Authenticator.verifyTokenSocketMiddleware(socket, next);

      if (this.sessionManager.isUserConnectedByUserName(parsedToken.userName) === true) {

        const prevSessionId = this.sessionManager.findSocketIdByUserName(parsedToken.userName) as string;;
        const prevSession = this.sessionManager.findSession(prevSessionId);

        if (prevSession !== null) {
          this.sessionManager.removeSession(prevSession.socketId);
        }
      }

      socket.sessionID = socket.id;
      socket.userName = parsedToken.userName;

      next();
    } catch (error) {
      console.warn(error)
      console.warn('error chat Middleware');
    }
  }

  public createSession = async (socket: ChatSocketType, next: NextFunction) => {
    try {
      this.sessionManager.saveSession(socket.sessionID, {
        socketId: socket.id,
        userName: socket.userName,
        connected: true
      });

      next();
    } catch (err) {
      console.warn(err);
    }
  }
}
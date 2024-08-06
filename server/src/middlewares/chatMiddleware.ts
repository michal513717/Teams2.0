import { chatSessionManager } from "../managers/chatSessionManager";
import { ChatSocketType, NextFunction } from "../models/common.models";
import { InvalidTokenError } from "../utils/errors";
import { Helper } from "../utils/helper";
import { Authenticator } from "./aunthenicator";


export class ChatMiddlewareHandler {
  public static verifyConnection = async (socket: ChatSocketType, next: NextFunction) => {
    try {
      let userToken = socket.handshake.auth.token as string;

      if (!userToken) {
        userToken = socket.handshake.headers.auth as string;
      }

      if (!userToken) {
        return next(new InvalidTokenError());
      }

      const parsedToken = await Authenticator.verifyTokenSocketMiddleware(socket, next);

      if (chatSessionManager.isUserConnectedByUserName(parsedToken.userName) === true) {

        const prevSession = chatSessionManager.findSession(parsedToken.userName)!;

        chatSessionManager.removeSession(prevSession.socketId);
      }

      socket.sessionID = socket.id;
      socket.userName = parsedToken.userName;

      next();
    } catch (error) {
      console.log('error chat Middleware');
    }
  }

  public static createSession = async (socket: ChatSocketType, next: NextFunction) => {
    try {
      chatSessionManager.saveSession(socket.sessionID, {
        socketId: socket.id,
        userName: socket.userName,
        connected: true
      });

      next();
    } catch (err) {
      console.log(err);
    }
  }
}
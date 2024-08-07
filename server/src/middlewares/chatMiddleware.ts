import { sessionManager } from "../managers/sessionManager";
import { ChatSocketType, NextFunction } from "../models/common.models";
import { InvalidTokenError } from "../utils/errors";
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

      if (sessionManager.isUserConnectedByUserName(parsedToken.userName) === true) {

        const prevSession = sessionManager.findSession(parsedToken.userName);

        if (prevSession !== null) {
          sessionManager.removeSession(prevSession.socketId);
        }
      }

      socket.sessionID = socket.id;
      socket.userName = parsedToken.userName;

      next();
    } catch (error) {
      console.log(error)
      console.warn('error chat Middleware');
    }
  }

  public static createSession = async (socket: ChatSocketType, next: NextFunction) => {
    try {
      sessionManager.saveSession(socket.sessionID, {
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
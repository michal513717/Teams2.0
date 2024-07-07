import { chatSessionManager } from "../managers/chatSessionManager";
import { ChatSocketType, NextFunction } from "../models/common.models";
import { InvalidTokenError } from "../utils/errors";
import { Helper } from "../utils/helper";
import { Authenticator } from "./aunthenicator";


class ChatMiddlewareHandler {
  public static verifyConnection = (socket: ChatSocketType, next: NextFunction) => {
    try {
      const sessionID = socket.handshake.auth.sessionID as string;
      const userToken = socket.handshake.auth.token as string;
  
      if(!userToken){
        return next(new InvalidTokenError());
      }
  
      if(sessionID){
        const session = chatSessionManager.findSession(sessionID);
  
        if(session !== null) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.userName = session.userName;
          next();
        }
      }
  
      const userName = Authenticator.verifyTokenSocketMiddleware(socket, next);
      
      socket.sessionID = Helper.getRandomID();
      socket.userID = Helper.getRandomID();
      socket.userName = userName;

      next();
    } catch (error) {
      console.log('error chat Middleware');
    }
  }   
}
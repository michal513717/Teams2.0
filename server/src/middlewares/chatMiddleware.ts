import { chatSessionManager } from "../managers/chatSessionManager";
import { ChatSocketType, NextFunction } from "../models/common.models";
import { InvalidTokenError } from "../utils/errors";
import { Helper } from "../utils/helper";
import { Authenticator } from "./aunthenicator";


export class ChatMiddlewareHandler {
  public static verifyConnection = async (socket: ChatSocketType, next: NextFunction) => {
    try {
      let sessionID = socket.handshake.auth.sessionID as string;
      let userToken = socket.handshake.auth.token as string;
      
      //!TMP
      if(!userToken){
        userToken = socket.handshake.headers.auth;
      }
      
      if(!sessionID){
        sessionID = socket.handshake.headers.sessionID;
      }

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

      const parsedToken = await Authenticator.verifyTokenSocketMiddleware(socket, next);
      
      socket.sessionID = Helper.getRandomID();
      socket.userID = Helper.getRandomID();
      socket.userName = parsedToken.userName;

      next();
    } catch (error) {
      console.log('error chat Middleware');
    }
  }   
}
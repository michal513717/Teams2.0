import { Request, Response, NextFunction } from 'express';
import { AuthroizationTokenManager } from '../managers/tokenManager';
import { ChatSocketType } from '../models/common.models';
import { InvalidTokenError } from '../utils/errors';

export class Authenticator {

  public static verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        throw new Error("Token Not Found");
      }
      const token = authHeader.split(' ')[1];
      const payload = AuthroizationTokenManager.verifyToken(token);

      if (payload == null) {
        throw new Error("Invalid Token");
      }
      next();
    } catch (error) {
      res.status(401).json(error)
    }
  }

  public static verifyTokenSocketMiddleware = async (socket: ChatSocketType, next: any) => {
    let token = socket.handshake.auth.token;
    
    if(!token){
      token = socket.handshake.headers.auth
    }
    
    if (!token) {
      return next(new InvalidTokenError());
    }

    const parsedToken = AuthroizationTokenManager.verifyToken(token);

    if(parsedToken === null){
      return next(new InvalidTokenError());
    }

    return parsedToken;
  }
}

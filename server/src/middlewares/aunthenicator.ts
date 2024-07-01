import { Request, Response, NextFunction } from 'express';
import { AuthroizationTokenManager } from '../managers/tokenManager';

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
}

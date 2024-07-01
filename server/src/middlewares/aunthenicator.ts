import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { SECRET } from '../utils/configs/secret';

class Authenticator {

    public static verifyToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, SECRET) as JwtPayload;
            return payload;
        } catch (error) {
            return null;
        }
    }
    
    public static authenticate(req: Request, res: Response, next: NextFunction): void {
        try{
            const authHeader = req.headers.authorization;

            if (!authHeader){
                throw new Error("Token Not Found");
            }
            const token = authHeader.split(' ')[1];
            const payload = Authenticator.verifyToken(token);

            if(payload == null){
                throw new Error("Invalid Token");
            }
            next();
        } catch(error){
            res.status(401).json(error)
        }
    }
}

import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

class Authenticator {
    //private static SECRET_KEY = 'your_secret_key';

    public static verifyToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, Authenticator.SECRET_KEY) as JwtPayload;
            return payload;
        } catch (error) {
            return null;
        }
    }
    public static authenticate(req: Request, res: Response, next: NextFunction): void {
        const authHeader = req.headers.authorization;

        if (authHeader) {
            const token = authHeader.split(' ')[1];
            const payload = Authenticator.verifyToken(token);

            if (payload) {
                next();
            } else {
                res.status(401).json({ message: 'Invalid token' });
            }
        } else {
            res.status(401).json({ message: 'Authorization header missing' });
        }
    }
}

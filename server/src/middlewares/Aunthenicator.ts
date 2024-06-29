import jwt, { JwtPayload } from 'jsonwebtoken';

class Aunthenicator {

    public static verifyToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, Aunthenicator.SECRET_KEY) as JwtPayload;
            return payload;
        } catch (error) {
            return null;
        }
    }
}

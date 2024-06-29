import jwt, { JwtPayload } from 'jsonwebtoken';

class Authorization {
    private static SECRET_KEY = 'your_secret_key';

    public static verifyToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, Authorization.SECRET_KEY) as JwtPayload;
            return payload;
        } catch (error) {
            return null;
        }
    }
}

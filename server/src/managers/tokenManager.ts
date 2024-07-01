import { SECRET } from "../utils/configs/secret";
import Jwt, { JwtPayload } from "jsonwebtoken";

export class AuthroizationTokenManager {
  
  public static generateToken(userName: string): {
    accessToken: string,
    refreshToken: string
  }{
    const payload = {
      userName,
    };
    const accessToken = Jwt.sign(payload, SECRET.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = Jwt.sign(payload, SECRET.JWT_SECRET_REFRESH, {
      expiresIn: "7d",
    });

    return {
      accessToken,
      refreshToken,
    };
  } 

  public static verifyToken(token: string): JwtPayload | null {
    try {
        const payload = Jwt.verify(token, SECRET.JWT_SECRET) as JwtPayload;
        return payload;
    } catch (error) {
        return null;
    }
  }
}
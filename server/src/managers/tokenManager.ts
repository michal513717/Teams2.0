import { SECRET } from "../utils/configs/secret";
import Jwt, { JwtPayload } from "jsonwebtoken";

export class AuthorizationTokenManager {
  
  public static generateToken(userName: string): {
    accessToken: string,
    refreshToken: string
  }{
    const payload = {
      userName: userName,
    };

    const accessToken = Jwt.sign(payload, SECRET.JWT_SECRET, { expiresIn: "7d" });
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
        return Jwt.verify(token, SECRET.JWT_SECRET) as JwtPayload;
    } catch (error) {
        return null;
    }
  }
}
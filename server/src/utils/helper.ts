import * as crypto from "crypto";

export class Helper {
  public static getRandomID(): string{
    return crypto.randomBytes(8).toString();
  }
}
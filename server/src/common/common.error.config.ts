import { CommonRoutesConfig } from "./common.routes.config";
import { ERROR_CODES } from "../utils/errors";

export abstract class ErrorWithCode extends Error {
  constructor(message: string, public status: number, public code: keyof typeof ERROR_CODES) {
    super(message);
  }

  public toJSON() {
    return {
      status: CommonRoutesConfig.statusMessage.FAILED,
      message: this.message,
      code: this.code
    }
  }
}
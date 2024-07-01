import { ErrorWithCode } from "../common/common.error.config";

export class UserAlreadyExist extends ErrorWithCode {
  constructor() {
    super("User exist", 403, "USER_EXIST");
  }
}

export const ERROR_CODES = {
  INVALID_TOKEN: "INALID_TOKEN",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  WRONG_PASSWORD: "WRONG_PASSWORD",
  VALIDAITON_ERROR: "VALIDATION_ERROR",
  USER_NOT_FOUND_ERROR: "USER_NOT_FOUND_ERROR",
  MISSING_PARAMETERS: "MISSING_PARAMETERS",
  USER_EXIST: "USER_EXIST"
};
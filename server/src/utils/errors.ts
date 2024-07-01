import { ErrorWithCode } from "../common/common.error.config";

export class UserNotFoundError extends ErrorWithCode {
  constructor() {
    super("User not found", 404, "USER_NOT_FOUND_ERROR");
  };
};

export class UsernameTakenError extends ErrorWithCode {
  constructor() {
    super("Username is already taken", 400, "USERNAME_TAKEN");
  };
};

export class InvalidTokenError extends ErrorWithCode {
  constructor() {
    super("Invalid token", 403, "INVALID_TOKEN");
  };
};

export class TokenExpiredError extends ErrorWithCode {
  constructor() {
    super("Expired token", 403, "TOKEN_EXPIRED");
  };
};

export class UnauthorizedError extends ErrorWithCode {
  constructor() {
    super("Unauthorized", 403, "UNAUTHORIZED");
  }
}


export const ERROR_CODES = {
  INVALID_TOKEN: "INALID_TOKEN",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  WRONG_PASSWORD: "WRONG_PASSWORD",
  VALIDAITON_ERROR: "VALIDATION_ERROR",
  USER_NOT_FOUND_ERROR: "USER_NOT_FOUND_ERROR",
  MISSING_PARAMETERS: "MISSING_PARAMETERS",
  USERNAME_TAKEN: "USERNAME_TAKEN"
};
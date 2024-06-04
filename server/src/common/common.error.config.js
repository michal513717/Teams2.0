import { CommonRoutesConfig } from "./common.routes.config.js";

export class ErrorWithCode extends Error {
    constructor(message, status, code) {
        super(message);
    }

    toJSON() {
        return {
            status: CommonRoutesConfig.statusMessage.FAILED,
            message: this.message,
            code: this.code
        }
    }
}
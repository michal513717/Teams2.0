import { CommonRoutesConfig } from "../../common/common.routes.config.js";
import { ERROR_CODES } from "../errors/errorCodes.error.js";
import { z } from "zod";

export function validationErrorResponse(res, error) {
    return res.status(400).json({
        status: CommonRoutesConfig.statusMessage.FAILED,
        code: ERROR_CODES.VALIDAITON_ERROR,
        message: error.format()
    })
}
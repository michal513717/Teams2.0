import { CommonRoutesConfig } from "../../common/common.routes.config.js"
import { ERROR_CODES } from "../errors/errorCodes.error.js"

export function internalServerErrorResponse(res) {
    return res.status(500).json({
        status: CommonRoutesConfig.statusMessage.FAILED,
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error, please try again later"
    })
}
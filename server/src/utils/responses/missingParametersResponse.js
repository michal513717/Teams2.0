import { CommonRoutesConfig } from "../../common/common.routes.config.js";
import { ERROR_CODES } from "../errors/errorCodes.error.js";

export function missingParametersResponse(res, data) {
    return res.status(422).json({
        status: CommonRoutesConfig.statusMessage.FAILED,
        code: ERROR_CODES.MISSING_PARAMETERS,
        result: {
            invalidDataType: data.wrongTypes,
            missingData: data.missing
        }
    })
}
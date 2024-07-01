import { CommonRoutesConfig } from "./../common/common.routes.config";
import { ERROR_CODES } from "./errors";
import type { Response } from "express";
import { z } from "zod";

export function validationErrorResponse(res: Response, error: z.ZodError) {
    return res.status(400).json({
        status: CommonRoutesConfig.statusMessage.FAILED,
        code: ERROR_CODES.VALIDAITON_ERROR,
        message: error.format()
    })
}

export function internalServerErrorResponse(res: Response) {
    return res.status(500).json({
        status: CommonRoutesConfig.statusMessage.FAILED,
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error, please try again later"
    })
}
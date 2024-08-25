import type { NextFunction, Request, Response } from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";

export class ExampleController {
  exampleController = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Example of a successfully completed request",
      result: {}
    });
  };
}
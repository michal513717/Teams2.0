import type { NextFunction, Request, Response } from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { databaseManager } from "../managers/databaseManager";

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const result = await databaseManager.getAllUsers();

  res.status(200).json({
    status: CommonRoutesConfig.statusMessage.SUCCESS,
    message: "Get all users completed request",
    result: result
  });
};
import type { NextFunction, Request, Response } from "express";
import { UserSchema, ZodUserSchema } from "../models/mongose.schema";
import { ErrorWithCode } from "../common/common.error.config";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { databaseManager } from "../managers/databaseManager";
import { internalServerErrorResponse, validationErrorResponse } from "../utils/responses";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";
import { UserAlreadyExist } from "../utils/errors";


export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

  } catch (error) {

  }
};


export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await ZodUserSchema.parseAsync(req.body);

    if (await databaseManager.isUserExist(data.userName) === true) {
      throw new UserAlreadyExist();
    };

    const newUser: UserSchema = {
      _id: new ObjectId(),
      userName: data.userName,
      password: data.password,
      create_at: new Date()
    }

    await databaseManager.addNewUser(newUser);

    res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Success"
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(res, error);
    }

    if (error instanceof ErrorWithCode) {
      return res.status(error.status).json(error.toJSON());
    }

    internalServerErrorResponse(res);
  }
};
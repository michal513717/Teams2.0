import type { NextFunction, Request, Response } from "express";
import { UserDatabaseSchema, ZodLoginUserSchema, ZodRegisterUserSchema } from "../models/mongose.schema";
import { ErrorWithCode } from "../common/common.error.config";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { databaseManager } from "../managers/databaseManager";
import { internalServerErrorResponse, validationErrorResponse } from "../utils/responses";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";
import { UnauthorizedError, UserNotFoundError, UsernameTakenError } from "../utils/errors";
import { AuthroizationTokenManager } from "../managers/tokenManager";


export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const credentials = await ZodLoginUserSchema.parseAsync(req.body);
    const result = await databaseManager.getUser(credentials.userName);

    if(result === null){
      throw new UserNotFoundError();
    }
    
    if(result.password !== credentials.password){
      throw new UnauthorizedError();
    }

    const tokens = AuthroizationTokenManager.generateToken(credentials.userName);

    res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Login success",
      result: tokens
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


export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await ZodRegisterUserSchema.parseAsync(req.body);

    if (await databaseManager.isUserExist(data.userName) === true) {
      throw new UsernameTakenError();
    };

    const newUser: UserDatabaseSchema = {
      _id: new ObjectId(),
      userName: data.userName,
      password: data.password,
      create_at: new Date()
    }

    await databaseManager.addNewUser(newUser);

    res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Register Success",
      result: {}
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
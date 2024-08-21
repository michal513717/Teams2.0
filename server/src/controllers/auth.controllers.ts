import type { NextFunction, Request, Response } from "express";
import { UserDatabaseSchema, ZodLoginUserSchema, ZodRegisterUserSchema } from "../models/mongose.schema";
import { ErrorWithCode } from "../common/common.error.config";
import { CommonRoutesConfig } from "../common/common.routes.config";
import ManagerCollection from "../managers/managersCollection";
import { DatabaseManager } from "../managers/databaseManager";
import { internalServerErrorResponse, validationErrorResponse } from "../utils/responses";
import { ObjectId } from "mongodb";
import { ZodError } from "zod";
import { UnauthorizedError, UserNotFoundError, UsernameTakenError } from "../utils/errors";
import { AuthorizationTokenManager } from "../managers/tokenManager";

export class AuthController { 

  private databaseManager!: DatabaseManager;

  constructor(){
    this.initManagers();
  }

  private initManagers(): void{
    this.databaseManager = ManagerCollection.getManagerById<DatabaseManager>("databaseManager");
  }

  loginController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const credentials = await ZodLoginUserSchema.parseAsync(req.body);
      const result = await this.databaseManager.getUser(credentials.userName);
  
      if(result === null){
        throw new UserNotFoundError();
      }
      
      if(result.password !== credentials.password){
        throw new UnauthorizedError();
      }
  
      const tokens = AuthorizationTokenManager.generateToken(credentials.userName);
  
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

  registerController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = await ZodRegisterUserSchema.parseAsync(req.body);
  
      if (await this.databaseManager.isUserExist(data.userName) === true) {
        throw new UsernameTakenError();
      };
  
      const newUser: UserDatabaseSchema = {
        _id: new ObjectId(),
        userName: data.userName,
        password: data.password,
        create_at: new Date()
      }
  
      await this.databaseManager.addNewUser(newUser);
  
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

  tokenCheckController = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
    const authHeader = req.headers.authorization;
    const token = authHeader!.split(' ')[1];
    const payload = AuthorizationTokenManager.verifyToken(token);
  
    res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Token is valid",
      result: { 
        userName: payload!.userName
      }
    });
  };
}
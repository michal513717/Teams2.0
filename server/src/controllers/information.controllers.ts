import type { NextFunction, Request, Response } from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import ManagerCollection from "../managers/managersCollection";
import { DatabaseManager } from "../managers/databaseManager";
import { Manager } from "../common/common.manager.config";
import { SessionManager } from "../managers/sessionManager";
import { UserStatus } from "../models/common.models";
import { internalServerErrorResponse, validationErrorResponse } from "../utils/responses";
import { ZodError } from "zod";
import { ErrorWithCode } from "../common/common.error.config";
import { ZodGetUnreadMessagesSchema } from "../models/mongose.schema";

export class InformationController extends Manager{

  private databaseManager!: DatabaseManager;
  private sessionManager!: SessionManager;

  protected async init(): Promise<void>{
    this.setupLogger("InformationController");
    this.initManagers();
    this.finishSetup();
  }

  private initManagers(): void{
    this.databaseManager = ManagerCollection.getManagerById<DatabaseManager>("databaseManager");
    this.sessionManager = ManagerCollection.getManagerById<SessionManager>("sessionManager");
  }

  getAllUsersController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
    const users = await this.databaseManager.getAllUsers();
    const sessions = this.sessionManager.findAllSessions();
    const result: UserStatus[] = [];
    
    users.forEach((item) => {
      result.push({
        userName: item,
        connected: sessions.some((session) => session.userName === item)
      })
    })
  
    res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Get all users completed request",
      result
    });
  }


  public getUnreadMessages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const data = await ZodGetUnreadMessagesSchema.parseAsync(req.query);

      const result = await this.databaseManager.getAllUnreadMessages(data.userName);

      res.status(200).json({
        status: CommonRoutesConfig.statusMessage.SUCCESS,
        message: "Get unread completed request",
        result
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
  }
};
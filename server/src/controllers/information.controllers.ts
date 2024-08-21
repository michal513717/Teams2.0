import type { NextFunction, Request, Response } from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import ManagerCollection from "../managers/managersCollection";
import { DatabaseManager } from "../managers/databaseManager";

export class InformationController {

  private databaseManager!: DatabaseManager;

  constructor(){
    this.initManagers();
  }

  private initManagers(): void{
    this.databaseManager = ManagerCollection.getManagerById<DatabaseManager>("databaseManager");
  }

  getAllUsersController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  
    const result = await this.databaseManager.getAllUsers();
  
    res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Get all users completed request",
      result: result
    });
  }
};
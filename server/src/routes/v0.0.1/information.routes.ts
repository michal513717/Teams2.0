import { InformationController } from "../../controllers/information.controllers";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { Authenticator } from "../../middlewares/authenticator";
import ControllersManager from "../../controllers/controllersCollection";
import type { Application } from "express";
import express from "express";

export class InformationRoute extends CommonRoutesConfig {

  private informationController!: InformationController;

  constructor(app: Application) {
    super(app, "Information Route", "0.0.1");
  }

  public override configureControllers(): void {
    this.informationController = ControllersManager.getControllerById<InformationController>("informationController");
  }

  public override configureRoute(): Application {

    const infoRouter = express.Router();

    const { getAllUsersController } = this.informationController

    infoRouter.get('/allUsers', Authenticator.verifyTokenMiddleware, getAllUsersController);

    this.app.use('/info', infoRouter);

    return this.getApp();
  }
}
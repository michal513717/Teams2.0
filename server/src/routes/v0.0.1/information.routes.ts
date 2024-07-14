import { getAllUsersController } from "../../controllers/infomration.controllers";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { Authenticator } from "../../middlewares/aunthenicator";
import type { Application } from "express";
import express from "express";

export class InformationRoute extends CommonRoutesConfig {

  constructor(app: Application) {
    super(app, "Infomration Route", "0.0.1");
  }

  configureRoute(): Application {

    const infoRouter = express.Router();

    infoRouter.get('/allUsers', Authenticator.verifyTokenMiddleware, getAllUsersController);

    this.app.use('/info', infoRouter);

    return this.getApp();
  }
}
import type { Application } from "express";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { exampleController } from "../../controllers/exampleRouter.controller";
import express from "express";

export class ExampleRoute extends CommonRoutesConfig {

  constructor(app: Application) {
    super(app, "Example Route", "0.0.1");
  }

  configureRoute(): Application {

    const exampleRouter = express.Router();

    exampleRouter.get('/ping', exampleController);

    this.app.use('/example', exampleRouter);

    return this.getApp();
  }
}
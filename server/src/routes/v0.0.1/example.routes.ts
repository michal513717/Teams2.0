import { ExampleController } from "../../controllers/exampleRouter.controller";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import ControllersCollection from "../../controllers/controllersCollection"
import type { Application } from "express";
import express from "express";

export class ExampleRoute extends CommonRoutesConfig {

  private exampleController!: ExampleController;

  constructor(app: Application) {
    super(app, "Example Route", "0.0.1");
  }

  public override configureControllers(): void {
    this.exampleController = ControllersCollection.getControllerById("exampleController");
  }

  public override configureRoute(): Application {

    const exampleRouter = express.Router();

    exampleRouter.get('/ping', this.exampleController.exampleController);

    this.app.use('/example', exampleRouter);

    return this.getApp();
  }
}
import type { Application } from "express";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import express from "express";
import { AuthController } from "../../controllers/auth.controllers";
import { Authenticator } from "../../middlewares/authenticator";
import ControllersCollection from "../../controllers/controllersCollection"

export class AuthRouter extends CommonRoutesConfig {

  private authController!: AuthController;

  constructor(app: Application) {
    super(app, "Auth Route", "0.0.1");
  }

  public override configureControllers(): void {
    this.authController = ControllersCollection.getControllerById<AuthController>("authController");
  }

  public override configureRoute(): Application {
    
    const authRouter = express.Router();
    
    const { registerController, loginController, tokenCheckController } = this.authController;

    authRouter.post('/register', registerController);
    authRouter.post('/login', loginController);
    authRouter.get('/tokenCheck', Authenticator.verifyTokenMiddleware, tokenCheckController)

    this.app.use('/auth', authRouter);

    return this.getApp();
  }
}
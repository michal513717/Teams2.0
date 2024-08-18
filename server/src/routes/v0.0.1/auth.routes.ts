import type { Application } from "express";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import express from "express";
import { loginController, registerController, tokenCheckController } from "../../controllers/auth.controllers";
import { Authenticator } from "../../middlewares/authenticator";

export class AuthRouter extends CommonRoutesConfig {

  constructor(app: Application) {
    super(app, "Auth Route", "0.0.1");
  }

  configureRoute(): Application {

    const authRouter = express.Router();

    authRouter.post('/register', registerController);
    authRouter.post('/login', loginController);
    authRouter.get('/tokenCheck', Authenticator.verifyTokenMiddleware, tokenCheckController)

    this.app.use('/auth', authRouter);

    return this.getApp();
  }
}
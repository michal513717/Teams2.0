import { CommonRoutesConfig } from "../../common/common.routes.config.js";
import express from "express";

export class AuthRoutes extends CommonRoutesConfig {

    constructor(app) {
        super(app, "Auth Route", "0.0.1");
    }

    configureRoute() {

        const authRouter = express.Router();

        // authRouter.post('/register', registerController);
        // authRouter.post('/login', loginController);

        this.app.use('/auth', authRouter);

        return this.getApp();
    }
}
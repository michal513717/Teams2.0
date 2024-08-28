import { CommonRoutesConfig } from "./common/common.routes.config";
import { APPLICATION_CONFIG } from "./utils/configs/applicationConfig";
import cacheControl from "express-cache-controller";
import bodyParser from "body-parser";
import ManagersCollection from "./managers/managersCollection";
import ControllersCollection from "./controllers/controllersCollection";
import { NotValidRoutes } from "./routes/v0.0.1/notValid.routes";
import { ExampleRoute } from "./routes/v0.0.1/example.routes";
import { SocketRoutes } from "./routes/v0.0.1/sockets.routes";
import { HttpServer, Logger } from "./models/common.models";
import { AuthRouter } from "./routes/v0.0.1/auth.routes";
import { InformationRoute } from "./routes/v0.0.1/information.routes";
import express, { Application } from "express";
import { Debugger } from "./utils/debugger";
import LoggerHelper from "./utils/logger";
import MongoLocalClient from "./database/index";
import * as http from "http";
import cors from "cors";
import { SessionManager } from "./managers/sessionManager";
import { DatabaseManager } from "./managers/databaseManager";
import { VideoConnectionManager } from "./managers/videoConnectionManager";
import { ChatConnectionManager } from "./managers/chatConnectionManager";
import { InformationController } from "./controllers/information.controllers";
import { ExampleController } from "./controllers/exampleRouter.controller";
import { AuthController } from "./controllers/auth.controllers";

export class MainApp {

  private config!: typeof APPLICATION_CONFIG;
  private application!: Application;
  private routes!: CommonRoutesConfig[];
  private server!: HttpServer;
  private logger!: Logger;

  static async createClassInstance() {
    const mainApp = new MainApp();
    await mainApp.init();
    return mainApp;
  }

  protected async init(): Promise<void> {
    
    await this.initManagers();
    await this.initControllers();
    this.initLogger();
    this.initApplicationConfig();
    this.initApplicationAndServer();
    this.initBasicDebug();
    this.initRoutes();

    this.startServer();
    this.setupCloseListeners();
  }

  private async initManagers(): Promise<void> {

    ManagersCollection.addManager("databaseManager", await DatabaseManager.createClassInstance());
    ManagersCollection.addManager("sessionManager", await SessionManager.createClassInstance());
    ManagersCollection.addManager("chatConnectionManager", await ChatConnectionManager.createClassInstance());
    ManagersCollection.addManager("videoConnectionManager", await VideoConnectionManager.createClassInstance());
  }

  private async initControllers(): Promise<void> {

    ControllersCollection.addController("authController", await AuthController.createClassInstance());
    ControllersCollection.addController("exampleController", new ExampleController());
    ControllersCollection.addController("informationController", await InformationController.createClassInstance());
  }

  private initLogger(): void {
    this.logger = LoggerHelper.getLogger("MainApp");
  }

  private initApplicationConfig(): void {

    this.config = APPLICATION_CONFIG;
  }

  private initApplicationAndServer(): void {

    this.application = express();
    // this.application.use(cors(this.config.CORS_CONFIG));
    this.application.use(cacheControl({ noCache: true }));
    this.application.use(cors({ origin: '*' }));
    this.application.use(express.json());

    this.server = http.createServer(this.application);

    this.application.use(bodyParser.urlencoded({ extended: true }));

  }

  private initBasicDebug(): void {
    if (APPLICATION_CONFIG.DEBUG_REQUEST === true) {
      Debugger.debugRequest(this.application);
    }
  }

  //* in this function we declare add another routes.
  //* Declare of notValidRoutes should be at the end.
  private initRoutes(): void {

    const application = this.application;

    this.routes = [];

    this.routes.push(new AuthRouter(application));
    this.routes.push(new ExampleRoute(application));
    this.routes.push(new InformationRoute(application));
    this.routes.push(new SocketRoutes(application, this.server));
    this.routes.push(new NotValidRoutes(application));
  }

  private startServer(): void {

    const port = this.config.APPLICATION_PORT;

    const runningMessage = `Server running at http://localhost:${port}`;

    this.server.listen(port, () => {
      this.routes.forEach((route) => {
        this.logger.info(
          `Routes configured for ${route.getVersion()} - ${route.getName()}`
        );
      });

      this.logger.info(runningMessage);
    });
  }

  private setupCloseListeners(): void {

    this.logger.info('Setup listeners of executing closing process');
    
    for (const signal of APPLICATION_CONFIG.EXIT_SIGNALS) {
      process.on(signal as any, async () => {
        if (MongoLocalClient.isMongoClientActive() === true) {
          await MongoLocalClient.closeClientConnection();
        }
      })
    }


    this.server.on('close', async () => {
      if (MongoLocalClient.isMongoClientActive() === true) {
        await MongoLocalClient.closeClientConnection();
      }
    })
  }
}

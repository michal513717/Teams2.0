import bodyParser from "body-parser";
import { APPLICATION_CONFIG } from "./utils/configs/applicationConfig";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { NotValidRoutes } from "./routes/v0.0.1/notValid.routes";
import { ExampleRoute } from "./routes/v0.0.1/example.routes";
import { SocketRoutes } from "./routes/v0.0.1/sockets.routes";
import { HttpServer, Logger } from "./models/common.models";
import { AuthRouter } from "./routes/v0.0.1/auth.routes";
import { databaseManager } from "./managers/databaseManager";
import express, { Application } from "express";
import { Debugger } from "./utils/debugger";
import LoggerHelper from "./utils/logger";
import * as http from "http";
import cors from "cors";
import { InformationRoute } from "./routes/v0.0.1/information.routes";
import cacheControl from "express-cache-controller";
// import { ChatSockets } from "./routes/v0.0.1/chatSocket.routes";

export class MainApp {

  private config!: typeof APPLICATION_CONFIG;
  private application!: Application;
  private routes!: CommonRoutesConfig[];
  private server!: HttpServer;
  private logger!: Logger;

  constructor() {
    this.init();
  }

  private init(): void {

    this.initLogger();
    this.initApplicationConfig();
    this.initApplicationAndServer();
    this.initBasicDebug();
    this.initRoutes();

    this.startServer();
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
}
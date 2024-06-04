import { APPLICATION_CONFIG } from "./utils/configs/applicationConfig.js";
import { NotValidRoutes } from "./routes/v0.0.1/notValid.routes.js";
import { AuthRoutes } from "./routes/v0.0.1/auth.routes.js";
import { Debugger } from "./utils/debugger.js";
import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import cors from "cors";

export class MainApp {

    constructor() {
        this.init();
    }

    init() {

        this.initApplcationConfig();
        this.initApplicationAndServer();
        this.initBasicDebug();
        this.initRoutes();

        this.startServer();
    }

    initApplcationConfig() {

        this.config = APPLICATION_CONFIG;
    }

    initApplicationAndServer() {

        this.application = express();
        this.application.use(cors());
        this.application.use(express.json());

        this.server = http.createServer(this.application);
        this.serverIO = new Server(this.server, { cors: { origin: "*" } });
    }

    initBasicDebug() {
        if (APPLICATION_CONFIG.DEBUG_REQUEST === true) {
            Debugger.debugRequest(this.application);
        }
    }

    initRoutes() {

        const application = this.application;

        this.routes = [];

        this.routes.push(new AuthRoutes(application));
        // this.routes.push(new SocketRoutes(application, this.serverIO));
        this.routes.push(new NotValidRoutes(application));
    }

    startServer() {

        const port = this.config.APPLICATION_PORT;

        const runningMessage = `Server running at http://localhost:${port}`;

        this.server.listen(port, () => {
            this.routes.forEach((route) => {
                console.log(
                    `Routes configured for ${route.getVersion()} - ${route.getName()}`
                );
            });

            console.log(runningMessage);
        });
    }
}
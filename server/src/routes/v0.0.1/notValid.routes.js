import { CommonRoutesConfig } from "../../common/common.routes.config.js";
import express from "express";
import path from "path";

export class NotValidRoutes extends CommonRoutesConfig {

    constructor(app) {

        super(app, "Not Valid route", "0.0.1");
    }

    configureRoute() {

        // TODO add assets
        // this.app.use(express.static(path.join(__dirname, "assets/images")));

        this.app.all("*", async (req, _res, next) => {
            const err = new Error(`Route ${req.originalUrl} not found`);
            err.statusCode = 404;
            next(err);
        });

        this.app.use(
            (err, _req, res, _next) => {
                const isNonNullObject = typeof err === "object" && err !== null;

                const status =
                    isNonNullObject && "status" in err ? err.status : "error";
                const statusCode =
                    isNonNullObject && "statusCode" in err
                        ? isNaN(Number(err.statusCode))
                            ? 500
                            : (err.statusCode)
                        : 500;

                const message = isNonNullObject && "message" in err ? err.message : "";

                res.status(statusCode).json({
                    status: status,
                    message: message,
                });
            }
        );

        return this.getApp();
    }
}
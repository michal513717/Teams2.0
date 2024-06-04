
export class CommonRoutesConfig {

    static statusMessage = {
        FAILED: "Failed",
        SUCCESS: "Success",
    };

    static routeType = {
        PUT: "PutRoutes",
        GET: "GetRoutes",
        POST: "PostRoutes",
        PATCH: "PatchRoutes",
        DELETE: "DeleteRoutes",
        SOCKET: "SocketRoutes",
        NOT_VALID: "NotValidRoutes",
    };

    constructor(
        app,
        routeName,
        version,
        server
    ) {
        this.routeName = routeName;
        this.app = app;
        this.version = version;
        this.io = server ?? null;

        this.configureRoute();
    }

    getName() {
        return this.routeName;
    }

    getVersion() {
        return this.version;
    }

    getApp() {
        return this.app;
    }

    configureRoute() { };
}
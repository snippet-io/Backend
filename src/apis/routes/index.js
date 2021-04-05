const express = require("express");


class Router {
    constructor() {
        this.express_router = express.Router();
    }
    get(path, middlewares, callback) {
        if (!callback) {
            callback = middlewares;
            this.express_router.get(path, make_express_controller(callback));
        }
        else {
            this.express_router.get(path, middlewares, make_express_controller(callback));
        }
    }
    post(path, middlewares, callback) {
        if (!callback) {
            callback = middlewares;
            this.express_router.post(path, make_express_controller(callback));
        }
        else {
            this.express_router.post(path, middlewares, make_express_controller(callback));
        }
    }
    patch(path, middlewares, callback) {
        if (!callback) {
            callback = middlewares;
            this.express_router.patch(path, make_express_controller(callback));
        }
        else {
            this.express_router.patch(path, middlewares, make_express_controller(callback));
        }
    }
    put(path, middlewares, callback) {
        if (!callback) {
            callback = middlewares;
            this.express_router.put(path, make_express_controller(callback));
        }
        else {
            this.express_router.put(path, middlewares, make_express_controller(callback));
        }
    }
    delete(path, middlewares, callback) {
        if (!callback) {
            callback = middlewares;
            this.express_router.delete(path, make_express_controller(callback));
        }
        else {
            this.express_router.delete(path, middlewares, make_express_controller(callback));
        }
    }
    getExpressRouter() {
        return this.express_router;
    }
}

function make_express_controller(callback) {
    return async (req, res, next) => {
        let result;
        try {
            result = await callback(req, res);
        } catch (error) {
            next(error);
            return;
        }
        res.send(result);
    };
}

module.exports = Router;
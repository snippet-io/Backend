const express = require("express");


class Router {
    constructor() {
        this.express_router = express.Router();
    }
    get(path, callback) {
        this.express_router.get(path, make_express_controller(callback));
    }
    post(path, callback) {
        this.express_router.post(path, make_express_controller(callback));
    }
    patch(path, callback) {
        this.express_router.patch(path, make_express_controller(callback));
    }
    put(path, callback) {
        this.express_router.put(path, make_express_controller(callback));
    }
    delete(path, callback) {
        this.express_router.delete(path, make_express_controller(callback));
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
const express = require("express");

class Router {
  constructor() {
    this.express_router = express.Router();
  }
  get(path, middlewares, callback) {
    wrapHttpMethod(this.express_router, "get", path, middlewares, callback);
  }
  post(path, middlewares, callback) {
    wrapHttpMethod(this.express_router, "post", path, middlewares, callback);
  }
  patch(path, middlewares, callback) {
    wrapHttpMethod(this.express_router, "patch", path, middlewares, callback);
  }
  put(path, middlewares, callback) {
    wrapHttpMethod(this.express_router, "put", path, middlewares, callback);
  }
  delete(path, middlewares, callback) {
    wrapHttpMethod(this.express_router, "delete", path, middlewares, callback);
  }
  getExpressRouter() {
    return this.express_router;
  }
}

function wrapHttpMethod(
  express_rotuer,
  http_method,
  path,
  middlewares,
  callback
) {
  if (!callback) {
    callback = middlewares;
    express_rotuer[http_method](path, make_express_controller(callback));
  } else {
    middlewares = middlewares.map((middleware) =>
      make_express_middleware(middleware)
    );
    express_rotuer[http_method](
      path,
      middlewares,
      make_express_controller(callback)
    );
  }
}
function make_express_middleware(callback) {
  return async (req, res, next) => {
    try {
      await callback(req, res);
    } catch (e) {
      next(e);
    }
    next();
  };
}
function make_express_controller(callback) {
  return async (req, res, next) => {
    let result;
    const loggerName = Math.random().toString();
    try {
      console.time(loggerName);
      result = await callback(req, res);
      console.timeEnd(loggerName);
    } catch (error) {
      next(error);
      return;
    }
    res.send(result);
  };
}

module.exports = Router;

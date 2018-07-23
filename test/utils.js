class Response {
  status(number) {
    this._status = number;
    return this;
  }

  json(object) {
    this._json = object;
    return object;
  }
}
exports.Response = () => new Response();

class App {
  constructor() {
    this.routes = {
      get: {},
      post: {}
    };
  }

  get(route, middleware, controller) {
    this.routes.get[route] = {
      middleware,
      controller
    };
  }

  post(route, middleware, controller) {
    this.routes.post[route] = {
      middleware,
      controller
    };
  }
}
exports.App = () => new App();

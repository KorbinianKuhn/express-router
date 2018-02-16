const shouldThrow = (message, func, ...params) => {
  let error;
  try {
    func(...params);
  } catch (err) {
    error = err;
  }

  if (error === null) {
    throw new Error('Did not throw');
  }

  error.message.should.equal(message);
};

exports.test = {
  throw: shouldThrow
};

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

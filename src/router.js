const helper = require('./helper');
const { assign, defaults } = require('lodash');
const createFunction = require('./create');
const middlewareFunction = require('./middleware');
const DEFAULTS = require('./defaults');

const _private = Symbol('Private variables');

class Router {
  constructor(routes, options = {}) {
    this[_private] = {
      metadata: {},
      errors: [],
    };
    this[_private].routes = helper.transform(routes, options);
  }

  create(app, middleware, options = {}) {
    switch (typeof middleware) {
      case 'object':
        options = middleware;
        middleware = DEFAULTS.middleware;
        break;
      case 'function':
        break;
      default:
        middleware = DEFAULTS.middleware;
        break;
    }
    createFunction(
      app,
      this[_private].routes,
      middleware,
      defaults(options, DEFAULTS.ROUTING_OPTIONS)
    );
  }

  middleware(options = {}) {
    return middlewareFunction(
      this[_private].routes,
      defaults(options, DEFAULTS.MIDDLEWARE_OPTIONS)
    );
  }

  metadata(object) {
    assign(this[_private].metadata, object);
    return this;
  }

  errors(...errors) {
    this[_private].errors.push(...errors);
    return this;
  }

  toObject(options = {}) {
    const object = {
      routes: [],
    };
    assign(object, this[_private].metadata);

    const endpointOptions = defaults(options);

    if (this[_private].errors.length > 0) {
      endpointOptions.errors = this[_private].errors;
    }

    for (const route in this[_private].routes) {
      for (const method in this[_private].routes[route]) {
        const endpoint = this[_private].routes[route][method];
        const routeObject = {
          uri: route,
          method,
        };
        assign(routeObject, endpoint.toObject(endpointOptions));
        object.routes.push(routeObject);
      }
    }
    return object;
  }
}

const RouterFactory = (routes, options = {}) => new Router(routes, options);
exports.RouterFactory = RouterFactory;

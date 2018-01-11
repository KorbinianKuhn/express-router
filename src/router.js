const _ = require('lodash');

const DEFAULT_OPTIONS = {
  asyncWrapper: true
}

const DEFAULT_MIDDLEWARE = (req, res, next) => {
  next();
}

const wrap = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const mapper = (app, routes, middleware, options, route) => {
  const tempRoute = route || '';
  for (const key in routes) {
    switch (typeof routes[key]) {
      case 'object':
        mapper(app, routes[key], middleware, options, tempRoute + key);
        break;
      case 'function':
        const fn = options.asyncWrapper ? wrap(routes[key]) : routes[key];
        app[key](tempRoute, middleware, fn);
        break;
    }
  }
}
exports.mapper = mapper;

exports.create = (app, routes, middleware, options) => {
  switch (typeof middleware) {
    case 'object':
      options = middleware;
      break;
    case 'function':
      break;
    default:
      middleware = DEFAULT_MIDDLEWARE;
      break;
  }

  if (!options) {
    options = DEFAULT_OPTIONS;
  }

  mapper(app, routes, middleware, options);
}

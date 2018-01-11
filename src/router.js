const helper = require('./helper');
const _ = require('lodash');

const DEFAULT_OPTIONS = {
  asyncWrapper: true,
  verbose: null
}

const DEFAULT_MIDDLEWARE = helper.DEFAULT_MIDDLEWARE;
const wrap = helper.wrap;
const transform = helper.transform;

module.exports = (app, routes, middleware, options = {}) => {
  const endpoints = transform(routes);

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

  options = _.defaults(options, DEFAULT_OPTIONS);

  if (options.verbose) options.verbose(`express-router: add routes`);

  for (const endpoint in endpoints) {
    for (const method in endpoints[endpoint]) {
      const controller = endpoints[endpoint][method];
      const fn = options.asyncWrapper ? wrap(controller) : controller;
      app[method](endpoint, middleware, fn);

      if (options.verbose) options.verbose(`${endpoint} ${_.upperCase(method)}`);
    }
  }
}

const { upperCase } = require('lodash');
const { wrap } = require('./defaults');

module.exports = (app, routes, middleware, options = {}) => {
  if (options.verbose) options.verbose(`express-router: add routes`);
  for (const endpoint in routes) {
    for (const method in routes[endpoint]) {
      const controller = routes[endpoint][method].controller();
      const fn = options.asyncWrapper ? wrap(controller) : controller;
      app[method](endpoint, middleware, fn);

      if (options.verbose) options.verbose(`${endpoint} ${upperCase(method)}`);
    }
  }
};

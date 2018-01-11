const _ = require('lodash');

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

module.exports = transform = (routes) => {
  if (!_.isPlainObject(routes)) {
    throw new Error('routes is not an object.');
  }

  if (_.keys(routes).length === 0) {
    throw new Error('routes is an empty object.')
  }

  const transformed = {}

  const transformRecursive = (routes, route, transformed) => {
    if (_.isPlainObject(routes)) {
      if (_.keys(routes).length === 0) {
        throw new Error(`route '${route}' has an empty object.`);
      } else {
        for (const key in routes) {
          if (METHODS.indexOf(key) !== -1) {
            if (!_.isFunction(routes[key])) {
              throw new Error(`endpoint '${route} ${_.upperCase(key)}' has no function.`);
            } else {
              if (!_.has(transformed, route)) {
                transformed[route] = {};
              }
              if (!_.has(transformed[route], key)) {
                transformed[route][key] = routes[key];
              } else {
                throw new Error(`endpoint '${route}' is a duplicate.`);
              }
            }
          } else if (_.startsWith(key, '/')) {
            transformRecursive(routes[key], `${route}${key}`, transformed)
          } else {
            throw new Error(`'${key}' has no leading slash.`);
          }
        }
      }
    } else {
      throw new Error(`route '${route}' is not an object.`);
    }
  }

  transformRecursive(routes, '', transformed);

  return transformed;
}

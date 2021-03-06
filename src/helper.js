const {
  isFunction,
  isObject,
  upperCase,
  startsWith,
  has,
  isPlainObject,
  keys,
} = require('lodash');
const { EndpointFactory } = require('./endpoint');

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

const transformToEndpoint = (route, method, endpoint) => {
  if (isFunction(endpoint)) {
    return EndpointFactory(endpoint);
  }
  if (isObject(endpoint) && endpoint.constructor.name === 'Endpoint') {
    return endpoint;
  }

  throw new Error(
    `endpoint '${route} ${upperCase(
      method
    )}' has no function or endpoint object.`
  );
};

const validateRoute = (string) => {
  const parts = string.split('/');
  parts.shift();
  for (const part of parts) {
    if (startsWith(part, ':')) {
      if (part.match(/^:\w+$/) === null) {
        throw new Error(
          `'/${part}' contains other characters than (a-z, A-Z, 0-9, _).`
        );
      }
    } else if (part.match(/^[a-z0-9-/]+$/) === null) {
      throw new Error(
        `'/${part}' contains other characters than (a-z, 0-9, -).`
      );
    }
  }
};

const addEndpoint = (transformed, route, method, endpoint) => {
  if (!has(transformed, route)) {
    transformed[route] = {};
  }
  if (!has(transformed[route], method)) {
    transformed[route][method] = endpoint;
  } else {
    throw new Error(`endpoint '${route}' is a duplicate.`);
  }
};

const transformRecursive = (routes, route, transformed, options) => {
  if (!isPlainObject(routes)) {
    throw new Error(`route '${route}' is not an object.`);
  }
  if (keys(routes).length === 0) {
    throw new Error(`route '${route}' has an empty object.`);
  }

  for (const key in routes) {
    if (METHODS.indexOf(key) !== -1) {
      const endpoint = transformToEndpoint(route, key, routes[key]);
      addEndpoint(transformed, route, key, endpoint);
    } else if (startsWith(key, '/')) {
      if (options.strict) validateRoute(key);
      transformRecursive(routes[key], `${route}${key}`, transformed, options);
    } else {
      throw new Error(`'${key}' has no leading slash.`);
    }
  }
};
exports.transformRecursive = transformRecursive;

exports.transform = (routes, options = {}) => {
  if (!isPlainObject(routes)) {
    throw new Error('routes is not an object.');
  }

  if (keys(routes).length === 0) {
    throw new Error('routes is an empty object.');
  }

  const transformed = {};
  transformRecursive(routes, '', transformed, options);

  return transformed;
};

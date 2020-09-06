const {
  isPlainObject,
  isBoolean,
  isArray,
  isFunction,
  clone,
  assign,
  cloneDeep,
} = require('lodash');

const isFunctionOrPlainObject = (data, allowArray) => {
  if (isArray(data)) {
    if (allowArray) {
      return data.map((o) => isFunctionOrPlainObject(o, false));
    } else {
      throw new Error('must be function or plain object');
    }
  }

  if (!isFunction(data) && !isPlainObject(data)) {
    throw new Error('must be function or plain object');
  }

  return data;
};
exports.isFunctionOrPlainObject = isFunctionOrPlainObject;

const _private = Symbol('Private variables');

class Endpoint {
  constructor(controller, request, responses, security) {
    if (!isFunction(controller)) throw new Error('must be function');
    this[_private] = {};
    this[_private].controller = controller;
    this[_private].request = request
      ? isFunctionOrPlainObject(request, false)
      : request;
    this[_private].responses = responses
      ? isFunctionOrPlainObject(responses, true)
      : responses;
    this[_private].security = isFunctionOrPlainObject(security, true);
  }

  controller() {
    return this[_private].controller;
  }

  description(text) {
    this[_private].description = text;
    return this;
  }

  request(schema) {
    this[_private].request = isFunctionOrPlainObject(schema, false);
    return this;
  }

  response(...schemes) {
    this[_private].responses.push(...isFunctionOrPlainObject(schemes, true));
    return this;
  }

  security(...schemes) {
    if (schemes.length === 1 && isBoolean(schemes[0]) && schemes[0] === false) {
      this[_private].securityEnabled = false;
    } else {
      this[_private].security.push(...isFunctionOrPlainObject(schemes, true));
    }
    return this;
  }

  toObject(options = {}) {
    const object = {};

    if (this[_private].description)
      object.description = this[_private].description;

    if (this[_private].request) {
      let request;
      if (isFunction(this[_private].request)) {
        request = this[_private].request(options);
        if (!isPlainObject(request))
          throw new Error('request function does not return plain object');
      } else {
        request = clone(this[_private].request);
      }
      assign(object, request);
    }

    const endpointResponses = cloneDeep(this[_private].responses);

    if (options.errors && options.errors.length > 0) {
      endpointResponses.push(...options.errors);
    }

    if (endpointResponses.length > 0) {
      const responses = {};
      endpointResponses.map((o) => {
        let response;
        if (isFunction(o)) {
          response = o(options);
          if (!isPlainObject(response))
            throw new Error('response function does not return plain object');
        } else {
          response = clone(o);
        }
        assign(responses, response);
        return o;
      });

      object.responses = responses;
    }

    if (
      this[_private].securityEnabled !== false &&
      this[_private].security.length > 0
    ) {
      const securitySchemes = {};
      this[_private].security.map((o) => {
        let schema;
        if (isFunction(o)) {
          schema = o(options);
          if (!isPlainObject(schema))
            throw new Error('security function does not return plain object');
        } else {
          schema = clone(o);
        }
        assign(securitySchemes, schema);
        return o;
      });

      object.securedBy = securitySchemes;
    }

    return object;
  }
}

const EndpointFactory = (
  controller,
  request = null,
  responses = [],
  security = []
) => new Endpoint(controller, request, responses, security);

exports.EndpointFactory = EndpointFactory;

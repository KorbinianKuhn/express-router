const should = require('should');
const {
  isFunctionOrPlainObject,
  EndpointFactory
} = require('../src/endpoint');
const utils = require('./utils');

describe('endpoint', () => {
  describe('isFunctionOrPlainObject()', () => {
    it('string should throw', () => {
      utils.test.throw('must be function or plain object', isFunctionOrPlainObject, 'string', false);
    });

    it('array should throw', () => {
      utils.test.throw('must be function or plain object', isFunctionOrPlainObject, [], false);
    });

    it('object should verify', () => {
      const expected = {};
      const actual = isFunctionOrPlainObject(expected, false);
      actual.should.deepEqual(expected);
    });

    it('function should verify', () => {
      const expected = () => {};
      const actual = isFunctionOrPlainObject(expected, false);
      actual.should.equal(expected);
    });

    it('array of objects should verify', () => {
      const expected = [{}, {}];
      const actual = isFunctionOrPlainObject(expected, true);
      actual.should.deepEqual(expected);
    });

    it('array of functions should verify', () => {
      const expected = [() => {}, () => {}];
      const actual = isFunctionOrPlainObject(expected, true);
      actual.should.deepEqual(expected);
    });

    it('mixed array should verify', () => {
      const expected = [{}, () => {}];
      const actual = isFunctionOrPlainObject(expected, true);
      actual.should.deepEqual(expected);
    });

    it('array with string should throw', () => {
      utils.test.throw('must be function or plain object', isFunctionOrPlainObject, ['test'], true);
    });
  });

  describe('EndpointFactory()', () => {
    it('wrong controller function should throw', () => {
      utils.test.throw('must be function', EndpointFactory, 'invalid');
    });

    it('correct controller function should verify', () => {
      const func = () => {};
      EndpointFactory(func);
    });

    it('full defined endpoint function should verify', () => {
      const func = () => {};
      EndpointFactory(func, {}, [], [func]);
    });

    it('toObject() should return correct object', () => {
      const controller = () => {};
      const request = {
        uriParameters: {
          userid: 'Id of user'
        }
      };
      const response = () => ({
        200: {
          description: 'Success'
        }
      });
      const security = {
        oauth2: 'OAuth2'
      };
      const endpoint = EndpointFactory(controller, request, [response], [security]).toObject();
      endpoint.should.deepEqual({
        responses: { 200: { description: 'Success' } },
        uriParameters: { userid: 'Id of user' },
        securedBy: { oauth2: 'OAuth2' }
      });
    });
  });
});

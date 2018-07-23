const { isFunctionOrPlainObject, EndpointFactory } = require('../src/endpoint');

describe('endpoint', () => {
  describe('isFunctionOrPlainObject()', () => {
    it('string should throw', () => {
      expect(() => {
        isFunctionOrPlainObject('string', false);
      }).toThrowError('must be function or plain object');
    });

    it('array should throw', () => {
      expect(() => {
        isFunctionOrPlainObject([], false);
      }).toThrowError('must be function or plain object');
    });

    it('object should verify', () => {
      const expected = {};
      const actual = isFunctionOrPlainObject(expected, false);
      expect(actual).toEqual(expected);
    });

    it('function should verify', () => {
      const expected = () => {};
      const actual = isFunctionOrPlainObject(expected, false);
      expect(actual).toEqual(expected);
    });

    it('array of objects should verify', () => {
      const expected = [{}, {}];
      const actual = isFunctionOrPlainObject(expected, true);
      expect(actual).toEqual(expected);
    });

    it('array of functions should verify', () => {
      const expected = [() => {}, () => {}];
      const actual = isFunctionOrPlainObject(expected, true);
      expect(actual).toEqual(expected);
    });

    it('mixed array should verify', () => {
      const expected = [{}, () => {}];
      const actual = isFunctionOrPlainObject(expected, true);
      expect(actual).toEqual(expected);
    });

    it('array with string should throw', () => {
      expect(() => {
        isFunctionOrPlainObject(['test'], true);
      }).toThrowError('must be function or plain object');
    });
  });

  describe('EndpointFactory()', () => {
    it('wrong controller function should throw', () => {
      expect(() => {
        EndpointFactory('invalid');
      }).toThrowError('must be function');
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
      const endpoint = EndpointFactory(
        controller,
        request,
        [response],
        [security]
      ).toObject();

      expect(endpoint).toEqual({
        responses: { 200: { description: 'Success' } },
        uriParameters: { userid: 'Id of user' },
        securedBy: { oauth2: 'OAuth2' }
      });
    });
  });
});

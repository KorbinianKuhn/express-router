const helper = require('../src/helper');
const { EndpointFactory } = require('../src/endpoint');

describe('helper()', () => {
  describe('transform()', () => {
    it('valid object should verify', () => {
      const fn = () => {};
      const routes = {
        '/a': {
          get: EndpointFactory(fn)
        },
        '/b/c': {
          put: EndpointFactory(fn)
        },
        '/c': {
          post: EndpointFactory(fn),
          '/d': {
            delete: EndpointFactory(fn),
            patch: EndpointFactory(fn)
          }
        }
      };
      const expected = {
        '/a': {
          get: EndpointFactory(fn)
        },
        '/b/c': {
          put: EndpointFactory(fn)
        },
        '/c': {
          post: EndpointFactory(fn)
        },
        '/c/d': {
          delete: EndpointFactory(fn),
          patch: EndpointFactory(fn)
        }
      };
      const actual = helper.transform(routes);
      expect(actual).toEqual(expected);
    });

    it('invalid object type should throw', () => {
      expect(() => {
        helper.transform([]);
      }).toThrowError('routes is not an object.');

      expect(() => {
        helper.transform({
          '/a': null
        });
      }).toThrowError(`route '/a' is not an object.`);
    });

    it('empty object should throw', () => {
      expect(() => {
        helper.transform({});
      }).toThrowError('routes is an empty object.');

      expect(() => {
        helper.transform({
          '/a': {}
        });
      }).toThrowError(`route '/a' has an empty object.`);
    });

    it('endpoint with no function should throw', () => {
      expect(() => {
        helper.transform({
          '/a': {
            get: null
          }
        });
      }).toThrowError(`endpoint '/a GET' has no function or endpoint object.`);

      expect(() => {
        helper.transform({
          '/a': {
            get: {}
          }
        });
      }).toThrowError(`endpoint '/a GET' has no function or endpoint object.`);
    });

    it('duplicate endpoint should throw', () => {
      expect(() => {
        helper.transform({
          '/a': {
            '/b': {
              get: () => {}
            }
          },
          '/a/b': {
            get: () => {}
          }
        });
      }).toThrowError(`endpoint '/a/b' is a duplicate.`);
    });

    it('key without leading slash should throw', () => {
      expect(() => {
        helper.transform({
          test: {
            get: () => {}
          }
        });
      }).toThrowError(`'test' has no leading slash.`);
    });

    it('invalid characters should throw', () => {
      expect(() => {
        helper.transform(
          {
            '/te.st': {
              get: () => {}
            }
          },
          {
            strict: true
          }
        );
      }).toThrowError(`'/te.st' contains other characters than (a-z, 0-9, -).`);
    });

    it('invalid characters should throw', () => {
      expect(() => {
        helper.transform(
          {
            '/TEST': {
              get: () => {}
            }
          },
          {
            strict: true
          }
        );
      }).toThrowError(`'/TEST' contains other characters than (a-z, 0-9, -).`);
    });

    it('invalid characters should throw', () => {
      expect(() => {
        helper.transform(
          {
            '/:test-b': {
              get: () => {}
            }
          },
          {
            strict: true
          }
        );
      }).toThrowError(
        `'/:test-b' contains other characters than (a-z, A-Z, 0-9, _).`
      );
    });
  });
});

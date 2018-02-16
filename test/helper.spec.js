const should = require('should');
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
      actual.should.deepEqual(expected);
    });

    it('invalid object type should throw', () => {
      (() => {
        helper.transform([]);
      }).should.throw('routes is not an object.');

      (() => {
        helper.transform({
          '/a': null
        });
      }).should.throw(`route '/a' is not an object.`);
    });

    it('empty object should throw', () => {
      (() => {
        helper.transform({});
      }).should.throw('routes is an empty object.');

      (() => {
        helper.transform({
          '/a': {}
        });
      }).should.throw(`route '/a' has an empty object.`);
    });

    it('endpoint with no function should throw', () => {
      (() => {
        helper.transform({
          '/a': {
            get: null
          }
        });
      }).should.throw(`endpoint '/a GET' has no function or endpoint object.`);

      (() => {
        helper.transform({
          '/a': {
            get: {}
          }
        });
      }).should.throw(`endpoint '/a GET' has no function or endpoint object.`);
    });

    it('duplicate endpoint should throw', () => {
      (() => {
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
      }).should.throw(`endpoint '/a/b' is a duplicate.`);
    });

    it('key without leading slash should throw', () => {
      (() => {
        helper.transform({
          test: {
            get: () => {}
          }
        });
      }).should.throw(`'test' has no leading slash.`);
    });

    it('invalid characters should throw', () => {
      (() => {
        helper.transform({
          '/te.st': {
            get: () => {}
          }
        }, {
          strict: true
        });
      }).should.throw(`'/te.st' contains other characters than (a-z, 0-9, -).`);
    });

    it('invalid characters should throw', () => {
      (() => {
        helper.transform({
          '/TEST': {
            get: () => {}
          }
        }, {
          strict: true
        });
      }).should.throw(`'/TEST' contains other characters than (a-z, 0-9, -).`);
    });

    it('invalid characters should throw', () => {
      (() => {
        helper.transform({
          '/:test-b': {
            get: () => {}
          }
        }, {
          strict: true
        });
      }).should.throw(`'/:test-b' contains other characters than (a-z, A-Z, 0-9, _).`);
    });
  });
});

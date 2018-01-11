const should = require('should');
const transform = require('../src/transform');


describe('transform()', () => {
  it('valid object should verify', () => {
    const fn = () => {};
    const routes = {
      '/a': {
        get: fn
      },
      '/b/c': {
        put: fn
      },
      '/c': {
        post: fn,
        '/d': {
          delete: fn,
          patch: fn
        }
      }
    }
    const expected = {
      '/a': {
        get: fn
      },
      '/b/c': {
        put: fn
      },
      '/c': {
        post: fn
      },
      '/c/d': {
        delete: fn,
        patch: fn
      }
    };
    const actual = transform(routes);
    actual.should.deepEqual(expected);
  });

  it('invalid object type should throw', () => {
    (() => {
      transform([])
    }).should.throw('routes is not an object.');

    (() => {
      transform({
        '/a': null
      })
    }).should.throw(`route '/a' is not an object.`);
  });

  it('empty object should throw', () => {
    (() => {
      transform({})
    }).should.throw('routes is an empty object.');

    (() => {
      transform({
        '/a': {}
      })
    }).should.throw(`route '/a' has an empty object.`);
  });

  it('endpoint with no function should throw', () => {
    (() => {
      transform({
        '/a': {
          get: null
        }
      })
    }).should.throw(`endpoint '/a GET' has no function.`);

    (() => {
      transform({
        '/a': {
          get: {}
        }
      })
    }).should.throw(`endpoint '/a GET' has no function.`);
  });

  it('duplicate endpoint should throw', () => {
    (() => {
      transform({
        '/a': {
          '/b': {
            get: () => {}
          }
        },
        '/a/b': {
          get: () => {}
        }
      })
    }).should.throw(`endpoint '/a/b' is a duplicate.`);
  });

  it('key without leading slash should throw', () => {
    (() => {
      transform({
        'test': {
          get: () => {}
        }
      })
    }).should.throw(`'test' has no leading slash.`);
  });
});

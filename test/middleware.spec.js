const should = require('should');
const middleware = require('../src/middleware');

class Response {
  constructor() {

  }

  status(number) {
    this._status = number;
    return this;
  }

  json(object) {
    this._json = object;
    return object;
  }
}

describe('middleware()', () => {
  it('complete invalid route should return empty valid part', () => {
    const routes = {
      '/a': {
        get: () => {}
      }
    }
    const req = {
      url: '/invalid/route',
      method: 'GET'
    }
    const res = new Response();
    const next = () => {};

    middleware(routes)(req, res, next);
    res._status.should.equal(404);
    res._json.should.deepEqual({
      error: 'Not found.',
      requested: '/invalid/route (GET)',
      valid: '',
      endpoints: ['/a (GET)']
    });
  });

  it('partly valid route should return suggestions', () => {
    const routes = {
      '/a': {
        get: () => {},
        '/c': {
          get: () => {}
        },
        '/d/:variable': {
          get: () => {}
        }
      },
      '/b': {
        get: () => {}
      }
    }
    const req = {
      url: '/a/b',
      method: 'GET'
    }
    const res = new Response();
    const next = () => {};

    middleware(routes)(req, res, next);
    res._status.should.equal(404);
    res._json.should.deepEqual({
      error: 'Not found.',
      requested: '/a/b (GET)',
      valid: '/a',
      endpoints: ['/a (GET)', '/a/c (GET)', '/a/d/:variable (GET)']
    });
  });

  it('should return multiple methods in suggestions', () => {
    const routes = {
      '/a': {
        get: () => {},
        post: () => {},
        '/b': {
          patch: () => {}
        }
      },
      '/c': {
        delete: () => {},
        put: () => {}
      }
    }
    const req = {
      url: '',
      method: 'GET'
    }
    const res = new Response();
    const next = () => {};

    middleware(routes)(req, res, next);
    res._status.should.equal(404);
    res._json.should.deepEqual({
      error: 'Not found.',
      requested: `'' (GET)`,
      valid: '',
      endpoints: ['/a (GET,POST)', '/a/b (PATCH)', '/c (DELETE,PUT)']
    });
  });

  it('should return custom error message', () => {
    const routes = {
      '/a': {
        get: () => {}
      }
    }
    const req = {
      url: '/invalid/route',
      method: 'GET'
    }
    const res = new Response();
    const next = () => {};

    middleware(routes, {
      message: 'Custom message.'
    })(req, res, next);
    res._status.should.equal(404);
    res._json.should.have.property('error', 'Custom message.')
  });

  it('should next error', () => {
    const routes = {
      '/a': {
        get: () => {}
      }
    }
    const req = {
      url: '/invalid/route',
      method: 'GET'
    }
    const res = new Response();
    const next = () => {};

    middleware(routes, {
      next: true
    })(req, res, (err) => {
      err.message.should.equal('Not found.');
      err.details.should.deepEqual({
        requested: '/invalid/route (GET)',
        valid: '',
        endpoints: ['/a (GET)']
      });
    });
  });
});

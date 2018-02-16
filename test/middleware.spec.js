const should = require('should');
const utils = require('./utils');
const Router = require('../src/router').RouterFactory;

describe('middleware()', () => {
  it('complete invalid route should return empty valid part', () => {
    const routes = {
      '/a': {
        get: () => {}
      }
    };
    const req = {
      url: '/invalid/route',
      method: 'GET'
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);
    res._status.should.equal(404);
    res._json.should.deepEqual({
      error: true,
      name: 'not_found',
      message: 'Not found.',
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
    };
    const req = {
      url: '/a/b',
      method: 'GET'
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);
    res._status.should.equal(404);
    res._json.should.deepEqual({
      error: true,
      name: 'not_found',
      message: 'Not found.',
      requested: '/a/b (GET)',
      valid: '/a',
      endpoints: ['/a (GET)', '/a/c (GET)', '/a/d/:variable (GET)']
    });
  });

  it('wrong method should return MethodNotAllowed', () => {
    const routes = {
      '/a': {
        get: () => {},
        patch: () => {},
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
    };
    const req = {
      url: '/a',
      method: 'POST'
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);
    res._status.should.equal(405);
    res._json.should.deepEqual({
      error: true,
      name: 'method_not_allowed',
      message: 'Method not allowed.',
      requested: 'POST',
      allowed: 'GET,PATCH'
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
    };
    const req = {
      url: '',
      method: 'GET'
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);
    res._status.should.equal(404);
    res._json.should.deepEqual({
      error: true,
      name: 'not_found',
      message: 'Not found.',
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
    };
    const req = {
      url: '/invalid/route',
      method: 'GET'
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware({
      messageNotFound: 'Custom message.',
      nameNotFound: 'custom_name'
    })(req, res, next);
    res._status.should.equal(404);
    res._json.should.have.property('message', 'Custom message.');
    res._json.should.have.property('name', 'custom_name');
  });

  it('should next error', () => {
    const routes = {
      '/a': {
        get: () => {}
      }
    };
    const req = {
      url: '/invalid/route',
      method: 'GET'
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware({
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

  it('should next method not allowed error', () => {
    const routes = {
      '/a': {
        get: () => {}
      }
    };
    const req = {
      url: '/a',
      method: 'POST'
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware({
      next: true
    })(req, res, (err) => {
      err.message.should.equal('Method not allowed.');
      err.details.should.deepEqual({
        requested: 'POST',
        allowed: 'GET'
      });
    });
  });
});

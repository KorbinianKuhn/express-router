const utils = require('./utils');
const Router = require('../src/router').RouterFactory;

describe('middleware()', () => {
  it('complete invalid route should return empty valid part', () => {
    const routes = {
      '/a': {
        get: () => {},
      },
    };
    const req = {
      url: '/invalid/route',
      method: 'GET',
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);

    expect(res._status).toEqual(404);
    expect(res._json).toEqual({
      error: true,
      name: 'not_found',
      message: 'Not found.',
      requested: '/invalid/route (GET)',
      valid: '',
      endpoints: ['/a (GET)'],
    });
  });

  it('partly valid route should return suggestions', () => {
    const routes = {
      '/a': {
        get: () => {},
        '/c': {
          get: () => {},
        },
        '/d/:variable': {
          get: () => {},
        },
      },
      '/b': {
        get: () => {},
      },
    };
    const req = {
      url: '/a/b',
      method: 'GET',
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);
    expect(res._status).toEqual(404);
    expect(res._json).toEqual({
      error: true,
      name: 'not_found',
      message: 'Not found.',
      requested: '/a/b (GET)',
      valid: '/a',
      endpoints: ['/a (GET)', '/a/c (GET)', '/a/d/:variable (GET)'],
    });
  });

  it('wrong method should return MethodNotAllowed', () => {
    const routes = {
      '/a': {
        get: () => {},
        patch: () => {},
        '/c': {
          get: () => {},
        },
        '/d/:variable': {
          get: () => {},
        },
      },
      '/b': {
        get: () => {},
      },
    };
    const req = {
      url: '/a',
      method: 'POST',
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);

    expect(res._status).toEqual(405);
    expect(res._json).toEqual({
      error: true,
      name: 'method_not_allowed',
      message: 'Method not allowed.',
      requested: 'POST',
      allowed: 'GET,PATCH',
    });
  });

  it('should return multiple methods in suggestions', () => {
    const routes = {
      '/a': {
        get: () => {},
        post: () => {},
        '/b': {
          patch: () => {},
        },
      },
      '/c': {
        delete: () => {},
        put: () => {},
      },
    };
    const req = {
      url: '',
      method: 'GET',
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware()(req, res, next);

    expect(res._status).toEqual(404);
    expect(res._json).toEqual({
      error: true,
      name: 'not_found',
      message: 'Not found.',
      requested: `'' (GET)`,
      valid: '',
      endpoints: ['/a (GET,POST)', '/a/b (PATCH)', '/c (DELETE,PUT)'],
    });
  });

  it('should return custom error message', () => {
    const routes = {
      '/a': {
        get: () => {},
      },
    };
    const req = {
      url: '/invalid/route',
      method: 'GET',
    };
    const res = utils.Response();
    const next = () => {};

    Router(routes).middleware({
      messageNotFound: 'Custom message.',
      nameNotFound: 'custom_name',
    })(req, res, next);

    expect(res._status).toEqual(404);
    expect(res._json).toMatchObject({
      message: 'Custom message.',
      name: 'custom_name',
    });
  });

  it('should next error', () => {
    const routes = {
      '/a': {
        get: () => {},
      },
    };
    const req = {
      url: '/invalid/route',
      method: 'GET',
    };
    const res = utils.Response();
    Router(routes).middleware({
      next: true,
    })(req, res, (err) => {
      expect(err).toMatchObject({
        message: 'Not found.',
        details: {
          requested: '/invalid/route (GET)',
          valid: '',
          endpoints: ['/a (GET)'],
        },
      });
    });
  });

  it('should next method not allowed error', () => {
    const routes = {
      '/a': {
        get: () => {},
      },
    };
    const req = {
      url: '/a',
      method: 'POST',
    };
    const res = utils.Response();

    Router(routes).middleware({
      next: true,
    })(req, res, (err) => {
      expect(err).toMatchObject({
        message: 'Method not allowed.',
        details: {
          requested: 'POST',
          allowed: 'GET',
        },
      });
    });
  });
});

const Router = require('../src/router').RouterFactory;
const utils = require('./utils');
const Endpoint = require('../src/endpoint').EndpointFactory;

describe('Router()', () => {
  it('should add correct routes', () => {
    const controller = () => {};
    const routes = {
      '/a': {
        get: controller
      },
      '/b': {
        get: controller,
        post: controller
      }
    };
    const app = utils.App();
    Router(routes).create(app, {
      asyncWrapper: false
    });

    app.routes.get.should.have.property('/a');
    app.routes.get['/a'].controller.should.equal(controller);
    app.routes.get.should.have.property('/b');
    app.routes.get['/b'].controller.should.equal(controller);
    app.routes.post.should.have.property('/b');
    app.routes.post['/b'].controller.should.equal(controller);
  });

  it('should add custom middleware', () => {
    const controller = () => {};
    const middleware = () => {};
    const routes = {
      '/a': {
        get: controller
      },
    };
    const app = utils.App();
    Router(routes).create(app, middleware, {
      asyncWrapper: false
    });

    app.routes.get.should.have.property('/a');
    app.routes.get['/a'].controller.should.equal(controller);
    app.routes.get['/a'].middleware.should.equal(middleware);
  });

  it('should add async wrapper', () => {
    const controller = () => {};
    const routes = {
      '/a': {
        get: controller
      },
    };
    const app = utils.App();
    Router(routes).create(app);

    app.routes.get.should.have.property('/a');
    app.routes.get['/a'].controller.should.not.equal(controller);
  });

  it('should verbose output', () => {
    const controller = () => {};
    let verbosed = '';
    const verbose = (text) => {
      verbosed += text;
    };
    const routes = {
      '/a': {
        get: controller
      },
    };
    const app = utils.App();
    Router(routes).create(app, {
      verbose,
      asyncWrapper: false
    });

    app.routes.get.should.have.property('/a');
    app.routes.get['/a'].controller.should.equal(controller);
    verbosed.should.equal('express-router: add routes/a GET');
  });

  describe.skip('toObject()', () => {
    it('should return routes as object', () => {
      const controller = () => {};
      const routes = {
        '/users': {
          get: Endpoint(controller).description('List all users').response({ 200: 'Success' })
        },
      };
      const metadata = {
        title: 'Automatic RAML',
        version: 'v1',
        baseUri: 'https://api.example.com/{version}',
        mediaType: 'application/json',
      };
      const errors = [{ 400: 'Bad Request' }, { 401: 'Unauthorized' }, { 403: 'Forbidden' }, { 500: 'Internal Server Error' }];
      const object = Router(routes).metadata(metadata).errors(errors).toObject();
      console.log(JSON.stringify(object, 2));
    });
  });
});

const should = require('should');
const router = require('../src/router');

class App {
  constructor() {
    this.routes = {
      get: {},
      post: {}
    };
  }

  get(route, middleware, controller) {
    this.routes.get[route] = {
      middleware,
      controller
    };
  }

  post(route, middleware, controller) {
    this.routes.post[route] = {
      middleware,
      controller
    };
  }
}
describe('router()', () => {
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
    }
    const app = new App();
    router(app, routes, {
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
    }
    const app = new App();
    router(app, routes, middleware, {
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
    }
    const app = new App();
    router(app, routes);

    app.routes.get.should.have.property('/a');
    app.routes.get['/a'].controller.should.not.equal(controller);
  });

  it('should verbose output', () => {
    const controller = () => {};
    let verbosed = '';
    const verbose = (text) => {
      verbosed += text;
    }
    const routes = {
      '/a': {
        get: controller
      },
    }
    const app = new App();
    router(app, routes, {
      verbose: verbose,
      asyncWrapper: false
    });

    app.routes.get.should.have.property('/a');
    app.routes.get['/a'].controller.should.equal(controller);
    verbosed.should.equal('express-router: add routes/a GET')
  });
});

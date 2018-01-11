const should = require('should');
const middleware = require('../src/middleware');
const router = require('../src/router');

describe('index.js', () => {
  it('should load correctly', () => {
    const lib = require('../index');
    lib.create.should.equal(router);
    lib.middleware.should.equal(middleware);
  });
});

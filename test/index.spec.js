const Endpoint = require('../src/endpoint').EndpointFactory;
const Router = require('../src/router').RouterFactory;

describe('index.js', () => {
  it('should load correctly', () => {
    const lib = require('../index');
    lib.Router.should.equal(Router);
    lib.Endpoint.should.equal(Endpoint);
  });
});

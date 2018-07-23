const Endpoint = require('../src/endpoint').EndpointFactory;
const Router = require('../src/router').RouterFactory;

describe('index.js', () => {
  it('should load correctly', () => {
    const lib = require('../index');
    expect(lib.Router).toEqual(Router);
    expect(lib.Endpoint).toEqual(Endpoint);
  });
});

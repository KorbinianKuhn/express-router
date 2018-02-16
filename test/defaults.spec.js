const {
  middleware,
  wrap
} = require('../src/defaults');

describe('defaults', () => {
  it('default middleware should next', () => {
    let executed = false;
    middleware(null, null, () => {
      executed = true;
    });
    executed.should.be.ok();
  });

  it('wrap function should catch exception', async () => {
    const throwFunction = async (req, res, next) => {
      throw 'test';
    };
    let error = null;
    await wrap(throwFunction)(null, null, (err) => {
      error = err;
    });
    error.should.equal('test');
  });
});

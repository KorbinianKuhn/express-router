const { middleware, wrap } = require('../src/defaults');

describe('defaults', () => {
  it('default middleware should next', () => {
    let executed = false;
    middleware(null, null, () => {
      executed = true;
    });
    expect(executed).toBe(true);
  });

  it('wrap function should catch exception', async () => {
    const throwFunction = async () => {
      throw 'test';
    };
    let error = null;
    await wrap(throwFunction)(null, null, err => {
      error = err;
    });
    expect(error).toEqual('test');
  });
});

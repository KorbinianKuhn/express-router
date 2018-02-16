exports.MIDDLEWARE_OPTIONS = {
  next: false,
  messageNotFound: 'Not found.',
  nameNotFound: 'not_found',
  messageMethodNotAllowed: 'Method not allowed.',
  nameMethodNotAllowed: 'method_not_allowed',
  strict: true
};

exports.ROUTING_OPTIONS = {
  asyncWrapper: true,
  verbose: null,
  strict: true
};

exports.middleware = (req, res, next) => {
  next();
};

exports.wrap = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

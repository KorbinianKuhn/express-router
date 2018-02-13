const _ = require('lodash');
const transform = require('./helper').transform;
const {
  NotFoundError,
  MethodNotAllowedError
} = require('./error');

const DEFAULTS = {
  next: false,
  messageNotFound: 'Not found.',
  nameNotFound: 'not_found',
  messageMethodNotAllowed: 'Method not allowed.',
  nameMethodNotAllowed: 'method_not_allowed',
  strict: true
}

module.exports = (routes, options = {}) => {
  options = _.defaults(options, DEFAULTS);

  const transformedRoutes = transform(routes, options);

  const allRoutes = [];
  for (const key in transformedRoutes) {
    allRoutes.push({
      route: key,
      params: _.compact(key.split('/')),
      methods: transformedRoutes[key]
    })
  }

  const middleware = (req, res, next) => {
    const params = _.compact(req.url.split('/'));
    let possibleRoutes = _.cloneDeep(allRoutes);
    let possibleMethods = {};
    let validRoute = '';
    const length = params.length;
    for (let i = 0; i < length; i++) {
      const param = params[i];
      const remainingRoutes = [];
      for (const route of possibleRoutes) {
        if (_.startsWith(route.params[0], '/:') || route.params[0] === param) {
          route.params.shift();
          remainingRoutes.push(route);
        }
      }
      if (remainingRoutes.length > 0) {
        possibleRoutes = remainingRoutes;
        validRoute += `/${param}`;
      } else {
        break;
      }

      if (i === length - 1) {
        possibleMethods = _.flatten(possibleRoutes.filter(o => o.params.length === 0).map(o => {
          return _.keys(o.methods).map(key => key.toUpperCase())
        }));
      }
    }

    if (_.isEmpty(possibleMethods)) {
      const requested = req.url === '' ? `'' (GET)` : `${req.url} (${req.method})`;
      const message = options.messageNotFound;
      const valid = validRoute;
      const endpoints = possibleRoutes.map(o => {
        return `${o.route} (${_.keys(o.methods).map(m => _.upperCase(m)).join(',')})`
      });

      res.status(404).json({
        error: true,
        message,
        name: options.nameNotFound,
        requested,
        valid,
        endpoints
      });

      if (options.next) {
        next(new NotFoundError(message, {
          requested,
          valid,
          endpoints
        }));
      }
    } else {
      const requested = req.method;
      const message = options.messageMethodNotAllowed;
      const allowed = possibleMethods.join(',');

      res.status(405).json({
        error: true,
        message,
        name: options.nameMethodNotAllowed,
        requested,
        allowed
      });

      if (options.next) {
        next(new MethodNotAllowedError(message, {
          requested,
          allowed
        }));
      }
    }
  }
  return middleware;
}

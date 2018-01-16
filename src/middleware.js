const _ = require('lodash');
const transform = require('./helper').transform;
const NotFoundError = require('./error');

const DEFAULTS = {
  next: false,
  message: 'Not found.',
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

    let validRoute = '';
    for (const param of params) {
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
    }

    const error = options.message;
    const requested = req.url === '' ? `'' (GET)` : `${req.url} (${req.method})`;
    const valid = validRoute;
    const endpoints = possibleRoutes.map(o => {
      return `${o.route} (${_.keys(o.methods).map(m => _.upperCase(m)).join(',')})`
    })

    res.status(404).json({
      error,
      requested,
      valid,
      endpoints
    });

    if (options.next) {
      next(new NotFoundError(error, {
        requested,
        valid,
        endpoints
      }));
    }
  }
  return middleware;
}

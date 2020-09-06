const {
  compact,
  cloneDeep,
  startsWith,
  keys,
  flatten,
  isEmpty,
  upperCase,
} = require('lodash');
const { NotFoundError, MethodNotAllowedError } = require('./error');

module.exports = (routes, options = {}) => {
  const allRoutes = [];
  for (const key in routes) {
    allRoutes.push({
      route: key,
      params: compact(key.split('/')),
      methods: routes[key],
    });
  }

  const middleware = (req, res, next) => {
    const params = compact(req.url.split('/'));
    let possibleRoutes = cloneDeep(allRoutes);
    let possibleMethods = {};
    let validRoute = '';
    const length = params.length;
    for (let i = 0; i < length; i++) {
      const param = params[i];
      const remainingRoutes = [];
      for (const route of possibleRoutes) {
        if (startsWith(route.params[0], '/:') || route.params[0] === param) {
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
        possibleMethods = flatten(
          possibleRoutes
            .filter((o) => o.params.length === 0)
            .map((o) => keys(o.methods).map((key) => key.toUpperCase()))
        );
      }
    }

    if (isEmpty(possibleMethods)) {
      const requested =
        req.url === '' ? `'' (GET)` : `${req.url} (${req.method})`;
      const message = options.messageNotFound;
      const valid = validRoute;
      const endpoints = possibleRoutes.map(
        (o) =>
          `${o.route} (${keys(o.methods)
            .map((m) => upperCase(m))
            .join(',')})`
      );

      res.status(404).json({
        error: true,
        message,
        name: options.nameNotFound,
        requested,
        valid,
        endpoints,
      });

      if (options.next) {
        next(
          new NotFoundError(message, {
            requested,
            valid,
            endpoints,
          })
        );
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
        allowed,
      });

      if (options.next) {
        next(
          new MethodNotAllowedError(message, {
            requested,
            allowed,
          })
        );
      }
    }
  };
  return middleware;
};

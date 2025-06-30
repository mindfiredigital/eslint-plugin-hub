const httpStatusCode = require('./plugin/http-status-code');
const consistentRouteFormat = require('./plugin/consistent-route-format'); // Add this line

module.exports = {
  rules: {
    ...httpStatusCode.rules,
    ...consistentRouteFormat.rules,
  },
};

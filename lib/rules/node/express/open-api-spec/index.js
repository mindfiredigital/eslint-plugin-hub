const httpStatusCode = require('./plugin/http-status-code');
const consistentRouteFormat = require('./plugin/consistent-route-format'); // Add this line
const pluralResourcePaths = require('./plugin/plural-resource-paths');
const verbConsistency = require('./plugin/verb-consistency');

module.exports = {
  rules: {
    ...httpStatusCode.rules,
    ...consistentRouteFormat.rules,
    ...pluralResourcePaths.rules,
    ...verbConsistency.rules,
    // ...add other express rules here in the future
  },
};

const httpStatusCode = require('./plugin/http-status-code');
const pluralResourcePaths = require('./plugin/plural-resource-paths');

module.exports = {
  rules: {
    ...httpStatusCode.rules,
    ...pluralResourcePaths.rules,
    // ...add other express rules here in the future
  },
};

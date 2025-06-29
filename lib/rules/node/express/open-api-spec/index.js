const httpStatusCode = require('./plugin/http-status-code');
const pluralResourcePaths = require('./plugin/plural-resource-paths');
const verbConsistency = require('./plugin/verb-consistency');

module.exports = {
  rules: {
    ...httpStatusCode.rules,
    ...pluralResourcePaths.rules,
    ...verbConsistency.rules,
    // ...add other express rules here in the future
  },
};

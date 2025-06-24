const httpStatusCode = require('./plugin/http-status-code');

module.exports = {
  rules: {
    ...httpStatusCode.rules,
    // ...add other express rules here in the future
  },
};

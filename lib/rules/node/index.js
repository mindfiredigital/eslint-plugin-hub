const limitDataScope = require('../node/plugin/limit-data-scope');

module.exports = {
  rules: {
    ...limitDataScope.rules,
  },
};

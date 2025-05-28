const limitDataScope = require('../node/plugin/limit-data-scope');
const keepFunctionsConcise = require('../node/plugin/keep-functions-concise');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...keepFunctionsConcise.rules,
  },
};

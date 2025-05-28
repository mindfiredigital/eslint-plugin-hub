const limitDataScope = require('../node/plugin/limit-data-scope');
const keepFunctionsConcise = require('../node/plugin/keep-functions-concise');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...keepFunctionsConcise.rules,
    ...fixedLoopBounds.rules,
  },
};

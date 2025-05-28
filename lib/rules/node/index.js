const limitDataScope = require('../node/plugin/limit-data-scope');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');
const compilerlinterRules = require('./plugin/compiler-linter-warning');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...fixedLoopBounds.rules,
    ...compilerlinterRules.rules,
  },
};

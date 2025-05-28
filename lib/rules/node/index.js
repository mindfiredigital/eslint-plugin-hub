const limitDataScope = require('../node/plugin/limit-data-scope');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');
const checkReturnValues = require('./plugin/check-return-values');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...fixedLoopBounds.rules,
    ...checkReturnValues.rules,
  },
};

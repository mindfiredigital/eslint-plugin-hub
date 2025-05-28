const limitDataScope = require('../node/plugin/limit-data-scope');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...fixedLoopBounds.rules,
  },
};

const limitDataScope = require('../node/plugin/limit-data-scope');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');
const minimizeComplexflows = require('./plugin/minimize-complexflows');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...fixedLoopBounds.rules,
    ...minimizeComplexflows.rules,
  },
};

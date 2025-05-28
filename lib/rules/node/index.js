const limitDataScope = require('../node/plugin/limit-data-scope');
const keepFunctionsConcise = require('../node/plugin/keep-functions-concise');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');
const checkReturnValues = require('./plugin/check-return-values');
const minimizeComplexflows = require('./plugin/minimize-complexflows');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...keepFunctionsConcise.rules,
    ...fixedLoopBounds.rules,
    ...checkReturnValues.rules,
    ...minimizeComplexflows.rules,
  },
};

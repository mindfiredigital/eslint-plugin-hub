const limitDataScope = require('../node/plugin/limit-data-scope');
const keepFunctionsConcise = require('../node/plugin/keep-functions-concise');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');
const limitReferenceDepth = require('./plugin/limit-reference-depth');
const checkReturnValues = require('./plugin/check-return-values');
const minimizeComplexflows = require('./plugin/minimize-complexflows');
const avoidRuntimeHeapAllocation = require('./plugin/avoid-runtime-heap-allocation');
const useRuntimeAssesrtion = require('./plugin/use-runtime-assertions');
const compilerlinterRules = require('./plugin/compiler-linter-warning');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...keepFunctionsConcise.rules,
    ...fixedLoopBounds.rules,
    ...limitReferenceDepth.rules,
    ...checkReturnValues.rules,
    ...minimizeComplexflows.rules,
    ...avoidRuntimeHeapAllocation.rules,
    ...useRuntimeAssesrtion.rules,
    ...compilerlinterRules.rules,
  },
};

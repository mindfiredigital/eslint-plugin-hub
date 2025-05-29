const limitDataScope = require('../node/plugin/limit-data-scope');
const keepFunctionsConcise = require('../node/plugin/keep-functions-concise');
const fixedLoopBounds = require('./plugin/fixed-loop-bounds');
const limitReferenceDepth = require('./plugin/limit-reference-depth');
const checkReturnValues = require('./plugin/check-return-values');
const minimizeComplexflows = require('./plugin/minimize-complexflows');
const useRuntimeAssesrtion = require('./plugin/use-runtime-assertions');
const compilerlinterRules = require('./plugin/compiler-linter-warning');
const noBuildEnvInSource = require('./plugin/no-build-env-in-source');

module.exports = {
  rules: {
    ...limitDataScope.rules,
    ...keepFunctionsConcise.rules,
    ...fixedLoopBounds.rules,
    ...limitReferenceDepth.rules,
    ...checkReturnValues.rules,
    ...minimizeComplexflows.rules,
    ...useRuntimeAssesrtion.rules,
    ...compilerlinterRules.rules,
    ...noBuildEnvInSource.rules,
  },
};

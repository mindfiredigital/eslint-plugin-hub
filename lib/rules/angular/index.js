const angularNoForbiddenServices = require('./plugin/angular-no-forbidden-services');
const angularNoUnusedInputs = require('./plugin/angular-no-unused-inputs');
const angularNoDirectDomManipulation = require('./plugin/angular-no-direct-dom-manipulation');
const angularLimitInput = require('./plugin/angular-limit-input');
const angularFilenaming = require('./plugin/angular-filenaming');

module.exports = {
  rules: {
    ...angularNoForbiddenServices.rules,
    ...angularNoUnusedInputs.rules,
    ...angularNoDirectDomManipulation.rules,
    ...angularLimitInput.rules,
    ...angularFilenaming.rules,
  },
};

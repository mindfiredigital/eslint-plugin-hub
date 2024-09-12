const generalRules = require('./lib/rules/general/index');
const reactRules = require('./lib/rules/react/index');
const angularRules = require('./lib/rules/angular/index');

module.exports = {
  pluginHub: generalRules,
  reactHub: reactRules,
  angularHub: angularRules,
};

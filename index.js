const generalRules = require('./lib/rules/general/index.js');
const reactRules = require('./lib/rules/react/index.js');
const angularRules = require('./lib/rules/angular/index.js');
const flatConfigBase = require('./configs/flat-config-base.js');
const legacyConfigBase = require('./configs/legacy-config-base.js');
const { name, version } = require('./package.json');

// Flatten and prefix rules
const prefixRules = (rules, prefix) =>
  Object.fromEntries(
    Object.entries(rules.rules).map(([key, value]) => [
      `${prefix}/${key}`,
      value,
    ])
  );

// Meta information for the plugin
const hub = {
  meta: {
    name,
    version,
  },
  rules: {
    ...prefixRules(generalRules, 'general'),
    ...prefixRules(reactRules, 'react'),
    ...prefixRules(angularRules, 'angular'),
  },
};

// Create configurations for flat or legacy formats
const createConfig = (rules, isFlatConfig = false) => ({
  ...(isFlatConfig ? { ...flatConfigBase } : legacyConfigBase),
  rules,
});

// Configurations for flat and legacy, including recommended
const configs = {
  // Legacy format
  all: createConfig(hub.rules),
  general: createConfig(prefixRules(generalRules, 'general')),
  react: createConfig(prefixRules(reactRules, 'react')),
  angular: createConfig(prefixRules(angularRules, 'angular')),

  // Flat format
  'flat/all': createConfig(hub.rules, true),
  'flat/general': createConfig(prefixRules(generalRules, 'general'), true),
  'flat/react': createConfig(prefixRules(reactRules, 'react'), true),
  'flat/angular': createConfig(prefixRules(angularRules, 'angular'), true),

  // Recommended rules
  recommended: createConfig(
    {
      'general/file-kebabcase': 'error',
      // Add more recommended rules as necessary
    },
    false // Whether flat or not depends on how you want the recommended config to be
  ),
};

module.exports = { ...hub, configs };

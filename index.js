const generalRules = require('./lib/rules/general/index.js');
const reactRules = require('./lib/rules/react/index.js');
const angularRules = require('./lib/rules/angular/index.js');
const advancedRules = require('./lib/rules/advanced/index.js');
const flatConfigBase = require('./configs/flat-config-base.js');
const legacyConfigBase = require('./configs/legacy-config-base.js');
const { name, version } = require('./package.json');

// Helper function to convert rule definitions to rule configurations for legacy config
const convertRulesToLegacyConfig = rules => {
  const config = {};
  Object.entries(rules).forEach(([key, rule]) => {
    config[`@mindfiredigital/hub/${key}`] = ['error', rule];
  });
  return config;
};

// Helper function to convert rule definitions to rule configurations for flat config
const convertRulesToFlatConfig = rules => {
  const config = {};
  Object.entries(rules).forEach(([key]) => {
    config[`hub/${key}`] = 'error';
  });
  return config;
};

// Recommended rules for MERN in legacy (with @mindfiredigital prefix)
const mernRecommendedRulesLegacy = {
  '@mindfiredigital/hub/file-kebabcase': 'error',
  '@mindfiredigital/hub/vars-camelcase': 'error',
  '@mindfiredigital/hub/class-pascalcase': 'error',
  '@mindfiredigital/hub/function-camelcase': 'error',
  '@mindfiredigital/hub/function-descriptive': 'warn',
  '@mindfiredigital/hub/react-component-name-match-filename': 'error',
  '@mindfiredigital/hub/react-filename-pascalcase': 'error',
};

// Recommended rules for MERN in flat config (no need for @mindfiredigital prefix)
const mernRecommendedRulesFlat = {
  'hub/file-kebabcase': 'error',
  'hub/vars-camelcase': 'error',
  'hub/class-pascalcase': 'error',
  'hub/function-camelcase': 'error',
  'hub/function-descriptive': 'warn',
  'hub/react-component-name-match-filename': 'error',
  'hub/react-filename-pascalcase': 'error',
};

// Create configuration (legacy or flat)
const createConfig = (rules, flatConfigName = false) => ({
  ...(flatConfigName
    ? { ...flatConfigBase, name: flatConfigName, plugins: { hub } }
    : { ...legacyConfigBase, plugins: ['@mindfiredigital/eslint-plugin-hub'] }),
  rules: { ...rules },
});

// Define the hub object with meta information and rules
const hub = {
  meta: {
    name,
    version,
  },
  rules: {
    ...generalRules.rules,
    ...reactRules.rules,
    ...angularRules.rules,
    ...advancedRules.rules,
  },
};

// Configurations for flat and legacy, including recommended rules
const configs = {
  // Legacy format configurations
  all: createConfig(convertRulesToLegacyConfig(hub.rules)),
  general: createConfig(convertRulesToLegacyConfig(generalRules.rules)),
  react: createConfig(convertRulesToLegacyConfig(reactRules.rules)),
  angular: createConfig(convertRulesToLegacyConfig(angularRules.rules)),
  advanced: createConfig(convertRulesToLegacyConfig(advancedRules.rules)),
  mern: createConfig(mernRecommendedRulesLegacy),

  // Flat format configurations
  'flat/all': createConfig(convertRulesToFlatConfig(hub.rules), 'hub/flat/all'),
  'flat/general': createConfig(
    convertRulesToFlatConfig(generalRules.rules),
    'hub/flat/general'
  ),
  'flat/react': createConfig(
    convertRulesToFlatConfig(reactRules.rules),
    'hub/flat/react'
  ),
  'flat/angular': createConfig(
    convertRulesToFlatConfig(angularRules.rules),
    'hub/flat/angular'
  ),
  'flat/advanced': createConfig(
    convertRulesToFlatConfig(advancedRules.rules),
    'hub/flat/advanced'
  ),
  'flat/mern': createConfig(mernRecommendedRulesFlat, 'hub/flat/mern'),
};

// Export the hub and its configurations
module.exports = { ...hub, configs };

const generalRules = require('./lib/rules/general/index.js');
const reactRules = require('./lib/rules/react/index.js');
const angularRules = require('./lib/rules/angular/index.js');
const flatConfigBase = require('./configs/flat-config-base.js');
const legacyConfigBase = require('./configs/legacy-config-base.js');
const { name, version } = require('./package.json');

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
  },
};

// Configurations for flat and legacy, including recommended rules
const configs = {
  // Legacy format configurations
  all: createConfig(hub.rules),
  general: createConfig(generalRules.rules),
  react: createConfig(reactRules.rules),
  angular: createConfig(angularRules.rules),
  mern: createConfig(mernRecommendedRulesLegacy),

  // Flat format configurations
  'flat/all': createConfig(hub.rules, 'hub/flat/all'),
  'flat/general': createConfig(generalRules.rules, 'hub/flat/general'),
  'flat/react': createConfig(reactRules.rules, 'hub/flat/react'),
  'flat/angular': createConfig(angularRules.rules, 'hub/flat/angular'),
  'flat/mern': createConfig(mernRecommendedRulesFlat, 'hub/flat/mern'),
};

// Export the hub and its configurations
module.exports = { ...hub, configs };

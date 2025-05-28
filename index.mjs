/* eslint-disable hub/vars-camelcase */
import generalRules from './lib/rules/general/index.js';
import reactRules from './lib/rules/react/index.js';
import angularRules from './lib/rules/angular/index.js';
import nodeRules from './lib/rules/node/index.js';
import nodeRules from './lib/rules/node/index.js';
import flatConfigBase from './configs/flat-config-base.mjs';
import legacyConfigBase from './configs/legacy-config-base.mjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(
  readFileSync(join(__dirname, 'package.json'), 'utf8')
);

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
    name: packageJson.name,
    version: packageJson.version,
  },
  rules: {
    ...generalRules.rules,
    ...reactRules.rules,
    ...angularRules.rules,
    ...nodeRules.rules,
  },
};

// Configurations for flat and legacy, including recommended rules
const configs = {
  // Legacy format configurations
  all: createConfig(convertRulesToLegacyConfig(hub.rules)),
  general: createConfig(convertRulesToLegacyConfig(generalRules.rules)),
  react: createConfig(convertRulesToLegacyConfig(reactRules.rules)),
  angular: createConfig(convertRulesToLegacyConfig(angularRules.rules)),
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
  'flat/mern': createConfig(mernRecommendedRulesFlat, 'hub/flat/mern'),
};

// Export the hub and its configurations
export { hub, configs };
export default { ...hub, configs };

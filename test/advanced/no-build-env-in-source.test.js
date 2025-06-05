const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

const ruleName = 'no-build-env-in-source';
const rule = rules[ruleName];

if (!rule) {
  throw new Error(`Rule "${ruleName}" not found. Check plugin export.`);
}

const defaultMessage =
  "Consider using a dedicated configuration module or runtime flags instead of branching directly on this build/environment variable. (found: process.env.NODE_ENV === (or !==) 'development').";
const debugMessage =
  'Consider using a dedicated configuration module or runtime flags instead of branching directly on this build/environment variable. (found: process.env.DEBUG).';
const customMessage = 'Use config module. (found: process.env.CUSTOM_FLAG).';

ruleTester.run(ruleName, rule, {
  valid: [
    // Not using process.env in if
    { code: 'if (someOtherVar) {}' },
    { code: 'if (true) {}' },
    // Using allowed process.env vars (not in disallowed list by default)
    { code: 'if (process.env.PORT === "8080") {}' },
    // Using disallowed var but with allowed comparison
    {
      code: "if (process.env.NODE_ENV === 'production') {}",
      options: [
        {
          disallowedEnvVariables: ['NODE_ENV'],
          allowedComparisons: { NODE_ENV: ['production'] },
        },
      ],
    },
    {
      code: "if (process.env.API_ENDPOINT === 'prod_url') {}",
      options: [
        {
          disallowedEnvVariables: ['API_ENDPOINT'],
          allowedComparisons: { API_ENDPOINT: ['prod_url', 'beta_url'] },
        },
      ],
    },
    // Direct usage of allowed process.env (not in disallowed)
    { code: 'if (process.env.LOG_LEVEL) {}' },
    // Default disallowed are NODE_ENV, DEBUG
    {
      code: "if (process.env.NODE_ENV === 'production') {}",
      options: [
        {
          // disallowedEnvVariables defaults to ['NODE_ENV', 'DEBUG']
          allowedComparisons: { NODE_ENV: ['production'] },
        },
      ],
    },
    // Logical expressions where none of the process.env are disallowed
    { code: 'if (process.env.A === "a" && process.env.B === "b") {}' },
    // Use of process.env outside of an IfStatement condition
    { code: 'const env = process.env.NODE_ENV;' },
    {
      code: 'function getConfig() { return process.env.NODE_ENV === "test"; }',
    },
  ],
  invalid: [
    // Default disallowed: NODE_ENV (comparison not in allowed list)
    {
      code: "if (process.env.NODE_ENV === 'development') {}",
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: "process.env.NODE_ENV === (or !==) 'development'",
          },
        },
      ],
    },
    // Default disallowed: DEBUG (direct usage)
    {
      code: 'if (process.env.DEBUG) {}',
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: 'process.env.DEBUG',
          },
        },
      ],
    },
    {
      code: 'if (!process.env.DEBUG) {}',
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: '!process.env.DEBUG',
          },
        },
      ],
    },
    // Custom disallowed
    {
      code: "if (process.env.FEATURE_FLAG_X === 'true') {}",
      options: [{ disallowedEnvVariables: ['FEATURE_FLAG_X'] }],
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: "process.env.FEATURE_FLAG_X === (or !==) 'true'",
          },
        },
      ],
    },
    // Custom disallowed with custom message
    {
      code: 'if (process.env.CUSTOM_FLAG) {}',
      options: [
        {
          disallowedEnvVariables: ['CUSTOM_FLAG'],
          suggestAlternative: 'Use config module.',
        },
      ],
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative: 'Use config module.',
            envVarUsage: 'process.env.CUSTOM_FLAG',
          },
        },
      ],
    },
    // Disallowed comparison even if var itself has other allowed comparisons
    {
      code: "if (process.env.NODE_ENV === 'staging') {}",
      options: [
        {
          disallowedEnvVariables: ['NODE_ENV'],
          allowedComparisons: { NODE_ENV: ['production', 'test'] }, // 'staging' is not allowed
        },
      ],
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: "process.env.NODE_ENV === (or !==) 'staging'",
          },
        },
      ],
    },
    // Direct usage of a var that has some allowed comparisons (implies direct usage itself is not allowed)
    {
      code: 'if (process.env.NODE_ENV) {}',
      options: [
        {
          disallowedEnvVariables: ['NODE_ENV'],
          allowedComparisons: { NODE_ENV: ['production'] },
        },
      ],
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: 'process.env.NODE_ENV',
          },
        },
      ],
    },
    // Logical OR expression
    {
      code: "if (process.env.NODE_ENV === 'development' || 외부조건) {}",
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: "process.env.NODE_ENV === (or !==) 'development'",
          },
        },
      ],
    },
    // Logical AND expression
    {
      code: 'if (process.env.DEBUG && someFlag) {}',
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: 'process.env.DEBUG',
          },
        },
      ],
    },
    // Swapped order in comparison
    {
      code: "if ('development' === process.env.NODE_ENV) {}",
      errors: [
        {
          messageId: 'noBuildEnvInSource',
          data: {
            alternative:
              rule.meta.schema[0].properties.suggestAlternative.default,
            envVarUsage: "process.env.NODE_ENV === (or !==) 'development'",
          },
        },
      ],
    },
  ],
});

const angularTestTemplate = ruleName => `
const { RuleTester } = require('eslint');
const rules = require('../index').rules;
const tsParser = require('@typescript-eslint/parser');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run('${ruleName}', rules['${ruleName}'], {
  valid: [
    // Add valid test cases here
  ],
  invalid: [
    {
      // Add Invalid test cases here
    },
  ],
});
`;
module.exports = { angularTestTemplate };

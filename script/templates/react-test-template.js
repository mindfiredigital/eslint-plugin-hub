const reactTestTemplate = ruleName => `
const { RuleTester } = require('eslint');
const rules = require('../../index').reactHub.rules;
const babelParser = require('@babel/eslint-parser');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: babelParser,
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
module.exports = { reactTestTemplate };

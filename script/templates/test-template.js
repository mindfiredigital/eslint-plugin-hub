const testTemplate = ruleName => `
const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

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
module.exports = { testTemplate };

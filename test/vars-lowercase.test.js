const { RuleTester } = require('eslint');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('vars-lowercase', rules['vars-lowercase'], {
  valid: [
    {
      code: 'var lowercase = 3;',
    },
  ],

  invalid: [
    {
      code: 'const InvalidName = 1;',
      errors: [{ messageId: 'notLowerCase', data: { name: 'InvalidName' } }],
    },
    {
      code: 'let AnotherInvalidName = 2;',
      errors: [
        { messageId: 'notLowerCase', data: { name: 'AnotherInvalidName' } },
      ],
    },
    {
      code: 'var MIXED_CASE = 3;',
      errors: [{ messageId: 'notLowerCase', data: { name: 'MIXED_CASE' } }],
    },
  ],
});

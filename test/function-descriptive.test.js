const { RuleTester } = require('eslint');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('function-descriptive', rules['function-descriptive'], {
  valid: [
    { code: 'function fetchData() {}' },
    { code: 'const processOrder = function() {};' },
    { code: 'const calculateTotal = () => {};' },
    { code: 'function getUserInfo() {}' },
    { code: 'function sendEmail() {}' },
  ],
  invalid: [
    {
      code: 'function Data() {}',
      errors: [
        {
          message:
            "Function name 'Data' should start with a verb and be descriptive.",
        },
      ],
    },
    {
      code: 'function User() {}',
      errors: [
        {
          message:
            "Function name 'User' should start with a verb and be descriptive.",
        },
      ],
    },
  ],
});

const { RuleTester } = require('eslint');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('vars-snakecase', rules['vars-snakecase'], {
  valid: [
    // Add valid test cases here
  ],
  invalid: [
    {
      // Add Invalid test cases here
    },
  ],
});

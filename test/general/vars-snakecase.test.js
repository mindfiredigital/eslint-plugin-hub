const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('vars-snakecase', rules['vars-snakecase'], {
  valid: [
    // Valid test cases where variable names follow the snake_case convention
    {
      code: 'let my_variable = 1;',
    },
    {
      code: 'const another_variable = "test";',
    },
    {
      code: 'var some_var = true;',
    },
    {
      code: 'const snake_case_variable = 10;',
    },
  ],
  invalid: [
    // Invalid test cases where variable names don't follow the snake_case convention
    {
      code: 'let myVariable = 1;',
      errors: [{ message: "Variable 'myVariable' should be in snake_case." }],
      output: 'let my_variable = 1;',
    },
    {
      code: 'const anotherVariable = "test";',
      errors: [
        { message: "Variable 'anotherVariable' should be in snake_case." },
      ],
      output: 'const another_variable = "test";',
    },
    {
      code: 'var SomeVar = true;',
      errors: [{ message: "Variable 'SomeVar' should be in snake_case." }],
      output: 'var some_var = true;',
    },
    {
      code: 'let leadingUnderscoreVariable = 5;',
      errors: [
        {
          message:
            "Variable 'leadingUnderscoreVariable' should be in snake_case.",
        },
      ],
      output: 'let leading_underscore_variable = 5;',
    },
    {
      code: 'const camelCaseVar = 10;',
      errors: [{ message: "Variable 'camelCaseVar' should be in snake_case." }],
      output: 'const camel_case_var = 10;',
    },
  ],
});

const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('vars-pascalcase', rules['vars-pascalcase'], {
  valid: [
    // Add cases that should not trigger the rule
    'const MyVariable = 10;',
    'let AnotherVariable = 20;',
    'var SomeVariable = "test";',
  ],
  invalid: [
    {
      code: 'const myVariable = 10;',
      output: 'const MyVariable = 10;',
      errors: [{ message: "Variable 'myVariable' should be in PascalCase." }],
    },
    {
      code: 'let another_variable = 20;',
      output: 'let AnotherVariable = 20;',
      errors: [
        { message: "Variable 'another_variable' should be in PascalCase." },
      ],
    },
    {
      code: 'var somevar = "test";',
      output: 'var Somevar = "test";',
      errors: [{ message: "Variable 'somevar' should be in PascalCase." }],
    },
  ],
});

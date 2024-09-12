const { RuleTester } = require('eslint');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('vars-camelcase', rules['vars-camelcase'], {
  valid: [
    // Valid variable declarations
    { code: 'var myVariable = 1;' },
    { code: 'let anotherVariable = 2;' },
    { code: 'const someValue = 3;' },
    { code: 'var validName = "text";' },
    { code: 'let alsoValid = [1, 2, 3];' },
    { code: 'const myArray = [];' },
    { code: 'const camelCaseName = "example";' },
  ],
  invalid: [
    // Invalid variable declarations
    {
      code: 'var InvalidName = 1;',
      errors: [{ message: "Variable 'InvalidName' should be in camelCase." }],
    },
    {
      code: 'let Another_Variable = 2;',
      errors: [
        { message: "Variable 'Another_Variable' should be in camelCase." },
      ],
    },
    {
      code: 'const NonCamelCase = 3;',
      errors: [{ message: "Variable 'NonCamelCase' should be in camelCase." }],
    },
    {
      code: 'var invalid_name = "text";',
      errors: [{ message: "Variable 'invalid_name' should be in camelCase." }],
    },
    {
      code: 'const _nonCamelCase = 4;',
      errors: [{ message: "Variable '_nonCamelCase' should be in camelCase." }],
    },
  ],
});

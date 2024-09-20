const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('function-pascalcase', rules['function-pascalcase'], {
  valid: [
    { code: 'function MyFunction() {}' },
    { code: 'function AnotherFunction123() {}' },
    { code: 'const MyFunction = function() {};' },
    { code: 'const AnotherFunction123 = function() {};' },
    { code: 'const MyFunction = () => {};' },
    { code: 'const AnotherFunction123 = () => {};' },
  ],
  invalid: [
    {
      code: 'function myFunction() {}',
      errors: [
        { message: "Function name 'myFunction' should be in PascalCase." },
      ],
    },
    {
      code: 'function another_function() {}',
      errors: [
        {
          message: "Function name 'another_function' should be in PascalCase.",
        },
      ],
    },
    {
      code: 'const myFunction = function() {};',
      errors: [
        { message: "Function name 'myFunction' should be in PascalCase." },
      ],
    },
    {
      code: 'const another_function = function() {};',
      errors: [
        {
          message: "Function name 'another_function' should be in PascalCase.",
        },
      ],
    },
    {
      code: 'const myFunction = () => {};',
      errors: [
        { message: "Function name 'myFunction' should be in PascalCase." },
      ],
    },
    {
      code: 'const another_function = () => {};',
      errors: [
        {
          message: "Function name 'another_function' should be in PascalCase.",
        },
      ],
    },
  ],
});

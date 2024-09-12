const { RuleTester } = require('eslint');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('function-camelcase', rules['function-camelcase'], {
  valid: [
    { code: 'function myFunction() {}' },
    { code: 'function anotherFunction123() {}' },
    { code: 'const myFunction = function() {};' },
    { code: 'const anotherFunction123 = function() {};' },
    { code: 'const myFunction = () => {};' },
    { code: 'const anotherFunction123 = () => {};' },
  ],
  invalid: [
    {
      code: 'function MyFunction() {}',
      errors: [
        { message: "Function name 'MyFunction' should be in camelCase." },
      ],
    },
    {
      code: 'function another_class() {}',
      errors: [
        { message: "Function name 'another_class' should be in camelCase." },
      ],
    },
    {
      code: 'const MyFunction = function() {};',
      errors: [
        { message: "Function name 'MyFunction' should be in camelCase." },
      ],
    },
    {
      code: 'const another_class = function() {};',
      errors: [
        { message: "Function name 'another_class' should be in camelCase." },
      ],
    },
    {
      code: 'const MyFunction = () => {};',
      errors: [
        { message: "Function name 'MyFunction' should be in camelCase." },
      ],
    },
    {
      code: 'const another_class = () => {};',
      errors: [
        { message: "Function name 'another_class' should be in camelCase." },
      ],
    },
  ],
});

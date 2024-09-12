const { RuleTester } = require('eslint');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('class-pascalcase', rules['class-pascalcase'], {
  valid: [{ code: 'class MyClass {}' }, { code: 'class PascalCaseName {}' }],
  invalid: [
    {
      code: 'class myClass {}',
      errors: [{ message: 'Class name "myClass" must be in PascalCase.' }],
    },
    {
      code: 'class another_class {}',
      errors: [
        { message: 'Class name "another_class" must be in PascalCase.' },
      ],
    },
  ],
});

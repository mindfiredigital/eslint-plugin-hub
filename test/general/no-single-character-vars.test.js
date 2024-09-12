const { RuleTester } = require('eslint');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('no-single-character-vars', rules['no-single-character-vars'], {
  valid: [
    {
      code: 'const validName = 1;',
    },
    {
      code: 'let anotherValidName = 2;',
    },
    {
      code: 'var validVariable = 3;',
    },
  ],

  invalid: [
    {
      code: 'const x = 1;',
      errors: [{ messageId: 'singleCharVar', data: { name: 'x' } }],
    },
    {
      code: 'let a = 2;',
      errors: [{ messageId: 'singleCharVar', data: { name: 'a' } }],
    },
    {
      code: 'var b = 3;',
      errors: [{ messageId: 'singleCharVar', data: { name: 'b' } }],
    },
  ],
});

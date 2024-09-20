const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('consistent-return', rules['consistent-return'], {
  valid: [
    {
      code: 'function validFunction(a) { return a; }',
    },
    {
      code: 'const validArrowFunction = (a) => { return a; };',
    },
    {
      code: 'function validFunctionWithMultipleReturns(a) { if (a) return a; else return; }',
    },
    {
      code: 'function validFunctionWithReturnInConditional(a) { if (a) return a; }',
    },
  ],

  invalid: [
    {
      code: 'function invalidFunction(a) { const b = a + 1; }',
      errors: [
        { messageId: 'missingReturn', data: { name: 'invalidFunction' } },
      ],
    },
    {
      code: 'const invalidArrowFunction = (a) => { const b = a + 1; };',
      errors: [{ messageId: 'missingReturn', data: { name: 'function' } }],
    },
    {
      code: 'function anotherInvalidFunction(a) { let b = a + 1; if (b > 10) { b += 10; } }',
      errors: [
        {
          messageId: 'missingReturn',
          data: { name: 'anotherInvalidFunction' },
        },
      ],
    },
  ],
});

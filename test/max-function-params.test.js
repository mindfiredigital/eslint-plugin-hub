const { RuleTester } = require('eslint');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('max-function-params', rules['max-function-params'], {
  valid: [
    {
      code: 'function validFunction(a, b) {}',
      options: [{ max: 2 }],
    },
    {
      code: 'function validFunction(a) {}',
      options: [{ max: 3 }],
    },
    {
      code: 'const validArrowFunction = (a, b) => {};',
      options: [{ max: 2 }],
    },
    {
      code: 'const validArrowFunction = (a) => {};',
      options: [{ max: 3 }],
    },
    {
      code: 'function validFunction(a, b, c) {}',
      options: [{ max: 3 }],
    },
  ],

  invalid: [
    {
      code: 'function invalidFunction(a, b, c, d) {}',
      options: [{ max: 2 }],
      errors: [
        {
          messageId: 'tooManyParameters',
          data: { name: 'invalidFunction', count: 4, max: 2 },
        },
      ],
    },
    {
      code: 'const invalidArrowFunction = (a, b, c, d) => {};',
      options: [{ max: 2 }],
      errors: [
        {
          messageId: 'tooManyParameters',
          data: { name: 'Anonymous function', count: 4, max: 2 },
        },
      ],
    },
    {
      code: 'function anotherInvalidFunction(a, b, c, d, e) {}',
      options: [{ max: 4 }],
      errors: [
        {
          messageId: 'tooManyParameters',
          data: { name: 'anotherInvalidFunction', count: 5, max: 4 },
        },
      ],
    },
  ],
});

const { RuleTester } = require('eslint');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('max-lines-per-function', rules['max-lines-per-function'], {
  valid: [
    {
      code: `
        function shortFunction() {
          const a = 1;
          const b = 2;
          return a + b;
        }
      `,
      options: [{ max: 5 }],
    },
    {
      code: `
        const arrowFunction = () => {
          // This is a short arrow function
          return 'Hello, World!';
        };
      `,
      options: [{ max: 4 }],
    },
    {
      code: `
        function exactlyAtLimit() {
          const line1 = 1;
          const line2 = 2;
          const line3 = 3;
          return line1 + line2 + line3;
        }
      `,
      options: [{ max: 6 }],
    },
    {
      code: `
        // Should ignore single-line functions
        const singleLine = () => 'Hello';
      `,
      options: [{ max: 1 }],
    },
  ],
  invalid: [
    {
      code: `
        function tooLongFunction() {
          const a = 1;
          const b = 2;
          const c = 3;
          return a + b + c;
        }
      `,
      options: [{ max: 5 }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: { name: 'tooLongFunction', max: 5, lines: 6 },
        },
      ],
    },
    {
      code: `
        const longArrowFunction = () => {
          const line1 = 'This is line 1';
          const line2 = 'This is line 2';
          const line3 = 'This is line 3';
          const line4 = 'This is line 4';
          return line1 + line2 + line3 + line4;
        };
      `,
      options: [{ max: 6 }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: { name: 'Anonymous function', max: 6, lines: 7 },
        },
      ],
    },
    {
      code: `
        function barelyOverLimit() {
          const line1 = 1;
          const line2 = 2;
          const line3 = 3;
          const line4 = 4;
          return line1 + line2 + line3 + line4;
        }
      `,
      options: [{ max: 6 }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: { name: 'barelyOverLimit', max: 6, lines: 7 },
        },
      ],
    },
  ],
});

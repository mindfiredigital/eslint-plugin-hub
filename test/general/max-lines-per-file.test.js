const { RuleTester } = require('eslint');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('max-lines-per-file', rules['max-lines-per-file'], {
  valid: [
    {
      filename: 'short-file.js',
      code: Array(5).fill('uniqueVar1 = 1;').join('\n'), // 5 lines, valid
    },
    {
      filename: 'another-valid-file.js',
      code: Array(10).fill('uniqueVar2 = 2;').join('\n'), // 10 lines, valid
    },
  ],
  invalid: [
    {
      filename: 'long-file.js',
      code: Array(15).fill('uniqueinvalidVar1 = 3;').join('\n'), // 15 lines, invalid
      options: [{ max: 10 }], // Set max to 10 lines
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'long-file.js',
            max: 10,
            lines: 15,
          },
        },
      ],
    },
    {
      filename: 'another-long-file.js',
      code: Array(20).fill(' uniqueinvalidVar2 = 4;').join('\n'), // 20 lines, invalid
      options: [{ max: 15 }], // Set max to 15 lines
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'another-long-file.js',
            max: 15,
            lines: 20,
          },
        },
      ],
    },
  ],
});

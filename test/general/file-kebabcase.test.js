const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('file-kebabcase', rules['file-kebabcase'], {
  valid: [
    {
      filename: path.join(__dirname, 'valid-file-name.js'),
      code: 'console.log("Valid file name");',
    },
    {
      filename: path.join(__dirname, 'short.js'),
      code: 'console.log("Short file name");',
    },
    {
      filename: path.join(__dirname, 'some-dir', 'valid-file-name.ts'),
      code: 'console.log("Valid file name in directory");',
    },
    {
      filename: path.join(__dirname, 'shortdir', 'valid-file-name.json'),
      code: 'console.log("Valid file name with short directory");',
    },
  ],

  invalid: [
    {
      filename: path.join(__dirname, 'InvalidFileName.js'),
      code: 'console.log("Invalid file name");',
      errors: [
        { messageId: 'invalidFileName', data: { name: 'InvalidFileName.js' } },
      ],
    },
    {
      filename: path.join(__dirname, 'INVALID.js'),
      code: 'console.log("Invalid short file name");',
      errors: [{ messageId: 'invalidFileName', data: { name: 'INVALID.js' } }],
    },
  ],
});

const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('file-pascalcase', rules['file-pascalcase'], {
  valid: [
    {
      filename: path.join(__dirname, 'ValidFileName.js'),
      code: 'console.log("Valid file name");',
    },
    {
      filename: path.join(__dirname, 'Short.js'),
      code: 'console.log("Short file name");',
    },
    {
      filename: path.join(__dirname, 'SomeDir', 'ValidFileName.ts'),
      code: 'console.log("Valid file name in directory");',
    },
    {
      filename: path.join(__dirname, 'ShortDir', 'ValidFileName.json'),
      code: 'console.log("Valid file name with short directory");',
    },
  ],

  invalid: [
    {
      filename: path.join(__dirname, 'invalidFileName.js'),
      code: 'console.log("Invalid file name");',
      errors: [
        { messageId: 'invalidFileName', data: { name: 'invalidFileName.js' } },
      ],
    },
    {
      filename: path.join(__dirname, 'invalid.js'),
      code: 'console.log("Invalid short file name");',
      errors: [{ messageId: 'invalidFileName', data: { name: 'invalid.js' } }],
    },
  ],
});

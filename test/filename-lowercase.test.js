const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('filename-lowercase', rules['filename-lowercase'], {
  valid: [
    {
      filename: path.join(__dirname, 'validfile.js'),
      code: 'console.log("Valid lowercase file name");',
    },
    {
      filename: path.join(__dirname, 'short.js'),
      code: 'console.log("Short lowercase file name");',
    },
    {
      filename: path.join(__dirname, 'folder', 'validfile.js'),
      code: 'console.log("Valid lowercase file name in folder");',
    },
    {
      filename: path.join(__dirname, 'folder', 'short.js'),
      code: 'console.log("Short lowercase file name in folder");',
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
      filename: path.join(__dirname, 'Invalid.js'),
      code: 'console.log("Invalid file name");',
      errors: [{ messageId: 'invalidFileName', data: { name: 'Invalid.js' } }],
    },
    {
      filename: path.join(__dirname, 'Folder', 'InvalidFileName.js'),
      code: 'console.log("Invalid file name in folder");',
      errors: [
        { messageId: 'invalidFileName', data: { name: 'InvalidFileName.js' } },
      ],
    },
    {
      filename: path.join(__dirname, 'Folder', 'Invalid.js'),
      code: 'console.log("Invalid file name in folder");',
      errors: [{ messageId: 'invalidFileName', data: { name: 'Invalid.js' } }],
    },
  ],
});

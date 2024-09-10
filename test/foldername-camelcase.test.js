const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('foldername-camelcase', rules['foldername-camelcase'], {
  valid: [
    {
      filename: path.join(__dirname, 'validDirName', 'file.js'),
      code: 'console.log("Valid directory name");',
    },
    {
      filename: path.join(__dirname, 'shortdir', 'file.js'),
      code: 'console.log("Short directory name");',
    },
  ],

  invalid: [
    {
      filename: path.join(__dirname, 'Invalid-Dir-Name', 'file.js'),
      code: 'console.log("Invalid directory name");',
      errors: [
        { messageId: 'invalidFolderName', data: { name: 'Invalid-Dir-Name' } },
      ],
    },
    {
      filename: path.join(__dirname, 'invalid-dir-name', 'file.js'),
      code: 'console.log("Invalid directory name");',
      errors: [
        { messageId: 'invalidFolderName', data: { name: 'invalid-dir-name' } },
      ],
    },
  ],
});

const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('folder-pascalcase', rules['folder-pascalcase'], {
  valid: [
    {
      filename: path.join(__dirname, 'ValidDirName', 'File.js'),
      code: 'console.log("Valid directory name");',
    },
    {
      filename: path.join(__dirname, 'ShortDir', 'file.js'),
      code: 'console.log("Short directory name");',
    },
  ],

  invalid: [
    {
      filename: path.join(__dirname, 'invalid-dir-name', 'ValidFileName.js'),
      code: 'console.log("Valid file name in invalid directory");',
      errors: [
        { messageId: 'invalidFolderName', data: { name: 'invalid-dir-name' } },
      ],
    },
    {
      filename: path.join(__dirname, 'invalidDirName', 'file.js'),
      code: 'console.log("Invalid directory name");',
      errors: [
        { messageId: 'invalidFolderName', data: { name: 'invalidDirName' } },
      ],
    },
  ],
});

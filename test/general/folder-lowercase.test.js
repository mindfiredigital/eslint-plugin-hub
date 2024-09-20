const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('folder-lowercase', rules['folder-lowercase'], {
  valid: [
    {
      filename: path.join(__dirname, 'validfolder', 'validfile.js'),
      code: 'console.log("Valid lowercase folder and file names");',
    },
    {
      filename: path.join(__dirname, 'shortfolder', 'shortfile.js'),
      code: 'console.log("Valid lowercase folder and file names");',
    },
    {
      filename: path.join(__dirname, 'anotherfolder', 'validfile.js'),
      code: 'console.log("Valid lowercase folder and file names");',
    },
  ],

  invalid: [
    {
      filename: path.join(__dirname, 'InvalidFolder', 'validfile.js'),
      code: 'console.log("Invalid folder name");',
      errors: [
        { messageId: 'invalidFolderName', data: { name: 'InvalidFolder' } },
      ],
    },
    {
      filename: path.join(__dirname, 'AnotherInvalidFolder', 'file.js'),
      code: 'console.log("Invalid folder name");',
      errors: [
        {
          messageId: 'invalidFolderName',
          data: { name: 'AnotherInvalidFolder' },
        },
      ],
    },
  ],
});

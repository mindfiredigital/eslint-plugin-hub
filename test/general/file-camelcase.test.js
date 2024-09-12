const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('file-camelcase', rules['file-camelcase'], {
  valid: [
    {
      filename: path.join(__dirname, 'validFileName.js'),
      code: 'console.log("Valid file name");',
    },
    {
      filename: path.join(__dirname, 'short.js'),
      code: 'console.log("Short file name");',
    },
    {
      filename: path.join(__dirname, 'someDir', 'validFileName.ts'),
      code: 'console.log("Valid file name in directory");',
    },
    {
      filename: path.join(__dirname, 'shortdir', 'validFileName.json'),
      code: 'console.log("Valid file name with short directory");',
    },
    {
      filename: path.join(__dirname, 'validDirName', 'file.js'),
      code: 'console.log("Valid directory name");',
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

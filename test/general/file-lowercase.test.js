const { RuleTester } = require('eslint');
const path = require('path');
const rules = require('../../index').pluginHub.rules;

const ruleTester = new RuleTester();

ruleTester.run('file-lowercase', rules['file-lowercase'], {
  valid: [
    {
      filename: path.join(__dirname, 'validfile.js'),
      code: 'console.log("Valid lowercase filename");',
    },
    {
      filename: path.join(__dirname, 'short.js'),
      code: 'console.log("Valid lowercase filename");',
    },
    {
      filename: path.join(__dirname, 'some-dir', 'validfile.js'),
      code: 'console.log("Valid lowercase filename");',
    },
    {
      filename: path.join(__dirname, 'valid-file-name.js'),
      code: 'console.log("Valid lowercase filename with hyphens");',
    },
  ],

  invalid: [
    {
      filename: path.join(__dirname, 'InvalidFileName.js'),
      code: 'console.log("Invalid filename");',
      errors: [
        { messageId: 'invalidFileName', data: { name: 'InvalidFileName.js' } },
      ],
    },
    {
      filename: path.join(__dirname, 'INVALID.js'),
      code: 'console.log("Invalid filename");',
      errors: [{ messageId: 'invalidFileName', data: { name: 'INVALID.js' } }],
    },
    {
      filename: path.join(__dirname, 'Invalid-File-Name.js'),
      code: 'console.log("Invalid filename");',
      errors: [
        {
          messageId: 'invalidFileName',
          data: { name: 'Invalid-File-Name.js' },
        },
      ],
    },
  ],
});

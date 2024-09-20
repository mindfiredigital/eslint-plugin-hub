const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester();

ruleTester.run('vars-descriptive', rules['vars-descriptive'], {
  valid: [
    // Valid variable declarations (starting with verbs)
    { code: 'let calculateTotal = 100;' },
    { code: 'const fetchData = [];' },
    { code: 'var updateUser = "John";' },
    { code: 'let processOrder = 1;' },
    { code: 'const generateReport = {};' },
    { code: 'var checkStatus = true;' },
    { code: 'let handleError = function() {};' },
    { code: 'const logMessage = "Log";' },
  ],
  invalid: [
    // Invalid variable declarations (not starting with verbs)
    {
      code: 'const userInfo = [];',
      errors: [
        {
          message:
            "Variable name 'userInfo' should start with a verb and be descriptive.",
        },
      ],
    },

    {
      code: 'const statusFlag = {};',
      errors: [
        {
          message:
            "Variable name 'statusFlag' should start with a verb and be descriptive.",
        },
      ],
    },
    {
      code: 'var errorHandler = true;',
      errors: [
        {
          message:
            "Variable name 'errorHandler' should start with a verb and be descriptive.",
        },
      ],
    },
  ],
});

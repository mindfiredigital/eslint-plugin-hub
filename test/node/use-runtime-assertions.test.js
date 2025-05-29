// test/general/use-runtime-assertions.test.js
const { RuleTester } = require('eslint');
const rule = require('../../lib/rules/node/plugin/use-runtime-assertions')
  .rules['use-runtime-assertions'];

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('use-runtime-assertions', rule, {
  valid: [
    // Default minAssertions: 2
    {
      code: `
        function calculate(price, rate) {
          if (typeof price !== 'number') throw new Error('Invalid price');
          if (typeof rate !== 'number') throw new Error('Invalid rate');
          return price * rate;
        }
      `,
    },
    {
      code: `
        function processData(data) {
          console.assert(data !== null, 'Data cannot be null');
          if (!data.id) {
            throw new Error('Data must have an ID');
          }
          // ...
        }
      `,
    },
    {
      code: `
        function checkUser(user) {
          if (!user) throw new Error('User undefined');
          console.assert(user.active, 'User must be active');
        }
      `,
    },
    // Custom minAssertions
    {
      code: `
        function simpleCheck(value) {
          if (value < 0) throw new Error('Value must be non-negative');
        }
      `,
      options: [{ minAssertions: 1 }],
    },
    // Custom assertion utility
    {
      code: `
        function customAssertTest(a, b) {
          myCustomAssert(typeof a === 'string', 'A must be a string');
          if (b < 0) {
              throw new Error('B must be positive');
          }
        }
      `,
      options: [{ assertionUtilityNames: ['myCustomAssert'] }],
    },
    {
      code: `
        function nestedIfThrow(value) {
          if (value === null) {
            if (true) { // simplified nested
                throw new Error('Value is critically null');
            }
          }
          if (value < 0) {
            throw new Error('Value is negative');
          }
        }
      `, // This counts as 2: the outer if-containing-a-throw, and the second direct if-throw
    },
    {
      // Arrow function
      code: `
        const arrowAssert = (val) => {
          if (!val) throw new Error('No val');
          console.assert(val > 0, 'Val not positive');
        }
      `,
    },
    {
      // Function expression
      code: `
          const exprAssert = function(val) {
            if (!val) throw new Error('No val');
            console.assert(val > 0, 'Val not positive');
          }
        `,
    },
    {
      code: `function noBody() {}`, // Valid: empty function should be ignored by default
    },
    {
      // Arrow function with implicit return
      code: `const implicit = (a) => a + 1;`,
    },
    {
      // Function with only return statement - this should be valid only if minAssertions is 0
      code: `function simpleReturn(x) { return x * 2; }`,
      options: [{ minAssertions: 0 }],
    },
    {
      // Empty functions should be ignored when ignoreEmptyFunctions is false but minAssertions is 0
      code: `function empty() {}`,
      options: [{ minAssertions: 0, ignoreEmptyFunctions: false }],
    },
  ],
  invalid: [
    // Default minAssertions: 2
    {
      code: `
        function calculate(price, rate) {
          if (typeof price !== 'number') throw new Error('Invalid price');
          // Only one assertion
          return price * rate;
        }
      `,
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'calculate', minCount: 2, foundCount: 1 },
        },
      ],
    },
    {
      code: `
        function noAsserts(value) {
          return value * 2;
        }
      `,
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'noAsserts', minCount: 2, foundCount: 0 },
        },
      ],
    },
    // Custom minAssertions
    {
      code: `
        function needsThree(a, b, c) {
          if (!a) throw new Error('a is required');
          console.assert(b, 'b is required');
          // Only two assertions
        }
      `,
      options: [{ minAssertions: 3 }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'needsThree', minCount: 3, foundCount: 2 },
        },
      ],
    },
    // Custom assertion utility name not used
    {
      code: `
        function usesWrongAssert(value) {
          // console.assert would be counted if 'assert' is in utility names (default)
          // but if we override and don't include 'assert', it won't.
          console.assert(value, 'Value is present');
          if (value < 0) throw new Error('Negative');
        }
      `,
      // Here, 'assert' is not in assertionUtilityNames, so console.assert isn't counted.
      options: [{ assertionUtilityNames: ['myOrgChecker'], minAssertions: 2 }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'usesWrongAssert', minCount: 2, foundCount: 1 }, // Only the 'throw' is counted
        },
      ],
    },
    {
      // Arrow function
      code: `
        const arrowNoAssert = (val) => {
          return val;
        }
      `,
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'arrowNoAssert', minCount: 2, foundCount: 0 },
        },
      ],
    },
    {
      // Your example from the proposal
      code: `
        function calculateDiscount(price, discountRate) {
          // No input or output validation
          return price - (price * discountRate);
        }
      `,
      errors: [
        {
          messageId: 'missingAssertions',
          data: {
            functionName: 'calculateDiscount',
            minCount: 2,
            foundCount: 0,
          },
        },
      ],
    },
    {
      // Your example from the proposal - slightly modified to have one assertion
      code: `
        function calculateDiscountOne(price, discountRate) {
          if (typeof price !== 'number' || price <= 0) {
            throw new Error('Price must be a positive number');
          }
          return price - (price * discountRate);
        }
      `,
      errors: [
        {
          messageId: 'missingAssertions',
          data: {
            functionName: 'calculateDiscountOne',
            minCount: 2,
            foundCount: 1,
          },
        },
      ],
    },
    // Test case where empty functions should trigger error when ignoreEmptyFunctions is false
    {
      code: `function empty() {}`,
      options: [{ ignoreEmptyFunctions: false }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'empty', minCount: 2, foundCount: 0 },
        },
      ],
    },
  ],
});

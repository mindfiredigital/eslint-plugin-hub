// test/general/use-runtime-assertions.test.js
const { RuleTester } = require('eslint');
// Adjust the path to your rule file
const rule = require('../../lib/rules/advanced/plugin/use-runtime-assertions').rules['use-runtime-assertions'];

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
      options: [
        { assertionUtilityNames: ['myCustomAssert'], minAssertions: 2 },
      ],
    },
    {
      code: `
        function nestedIfThrow(value) {
          if (value === null) {
            if (true) { // simplified nested
                throw new Error('Value is critically null'); // Assertion 1
            }
          }
          if (value < 0) {
            throw new Error('Value is negative'); // Assertion 2
          }
        }
      `, // Counts 2
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
      code: `function noBody() {}`, // Valid: empty function, ignoreEmptyFunctions=true (default), minAssertions=2 (default)
      options: [{ ignoreEmptyFunctions: true }], // Explicit for clarity, matches default
    },
    {
      code: `function noBodyMinZero() {}`,
      options: [{ minAssertions: 0, ignoreEmptyFunctions: true }],
    },
    {
      // Arrow function with implicit return
      code: `const implicit = (a) => a + 1;`,
      options: [{ minAssertions: 0 }], // Valid because minAssertions is 0
    },
    {
      // Function with only return statement - this should be valid only if minAssertions is 0
      code: `function simpleReturn(x) { return x * 2; }`,
      options: [{ minAssertions: 0 }],
    },
    {
      // Empty functions should be valid when ignoreEmptyFunctions is false but minAssertions is 0
      code: `function emptyMinZeroNoIgnore() {}`,
      options: [{ minAssertions: 0, ignoreEmptyFunctions: false }],
    },
    // NEW TEST CASE for nested custom assertion
    {
      code: `
        function readFileWithOptions_Good(options) {
          customAppAssert(
            typeof options.filePath === 'string' && options.filePath.length > 0,
            'filePath must be a non-empty string.',
          ); // Assertion 1

          if (options.encoding !== undefined) {
            customAppAssert(
              options.encoding === 'utf-8' || options.encoding === 'ascii',
              'Unsupported encoding specified.',
            ); // Assertion 2
          }
        }
      `,
      options: [
        { assertionUtilityNames: ['customAppAssert'], minAssertions: 2 },
      ],
    },
    {
      // Test case with a try-catch where assertion is in try
      code: `
        function tryCatchAssert(data) {
          try {
            if (!data) throw new Error("Data is required in try"); // Assertion 1
            console.assert(data.value > 0, "Data value must be positive"); // Assertion 2
          } catch (e) {
            // handle error
          }
        }
      `,
      // Default minAssertions: 2. Both should be found.
    },
    {
      // Test case with a switch statement
      code: `
        function switchAssert(value) {
          switch(value) {
            case 1:
              if (value !== 1) throw new Error("Impossible"); // Assertion 1
              break;
            default:
              console.assert(value > 1, "Value should be greater than 1 or not 1"); // Assertion 2
          }
        }
      `,
      // Default minAssertions: 2. Both should be found.
    },
  ],
  invalid: [
    // Default minAssertions: 2
    {
      code: `
        function calculateOne(price, rate) {
          if (typeof price !== 'number') throw new Error('Invalid price');
          // Only one assertion
          return price * rate;
        }
      `,
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'calculateOne', minCount: 2, foundCount: 1 },
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
          if (!a) throw new Error('a is required'); // 1
          console.assert(b, 'b is required');    // 2
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
          console.assert(value, 'Value is present'); // Not counted
          if (value < 0) throw new Error('Negative');   // Counted (1)
        }
      `,
      options: [{ assertionUtilityNames: ['myOrgChecker'], minAssertions: 2 }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'usesWrongAssert', minCount: 2, foundCount: 1 },
        },
      ],
    },
    {
      // Arrow function with block body and no asserts
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
      // Arrow function with implicit return and minAssertions > 0
      code: `const implicitFail = (a) => a + 1;`,
      options: [{ minAssertions: 1 }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'implicitFail', minCount: 1, foundCount: 0 },
        },
      ],
    },
    {
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
      code: `
        function calculateDiscountOne(price, discountRate) {
          if (typeof price !== 'number' || price <= 0) {
            throw new Error('Price must be a positive number'); // 1
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
    {
      code: `function emptyFail() {}`,
      options: [{ ignoreEmptyFunctions: false, minAssertions: 2 }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'emptyFail', minCount: 2, foundCount: 0 },
        },
      ],
    },
    {
      code: `function emptyFailOneAssert() {}`,
      options: [{ ignoreEmptyFunctions: false, minAssertions: 1 }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: {
            functionName: 'emptyFailOneAssert',
            minCount: 1,
            foundCount: 0,
          },
        },
      ],
    },
    {
      // Test with a For loop that doesn't contain assertions
      code: `
        function loopNoAssert(arr) {
          for (let i = 0; i < arr.length; i++) {
            console.log(arr[i]);
          }
        }
      `,
      options: [{ minAssertions: 1 }],
      errors: [
        {
          messageId: 'missingAssertions',
          data: { functionName: 'loopNoAssert', minCount: 1, foundCount: 0 },
        },
      ],
    },
  ],
});

const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run('minimize-complexflows', rules['minimize-complexflows'], {
  valid: [
    // Valid: Simple function with shallow nesting
    {
      code: `
        function getUser(id) {
          if (!id) return null; // Nesting 1
          return database.find(user => user.id === id);
        }
      `,
      options: [{ maxNestingDepth: 3, allowRecursion: false }],
    },

    // Valid: Allowed recursion when configured
    {
      code: `
        function factorial(n) {
          if (n <= 1) return 1;
          return n * factorial(n - 1);
        }
      `,
      options: [{ allowRecursion: true }],
    },

    // Valid: Within nesting limit
    {
      code: `
        function processOrder(order) {
          if (order.isValid) { // Nesting 1
            for (const item of order.items) { // Nesting 2
              if (item.inStock) { // Nesting 3
                shipItem(item);
              }
            }
          }
        }
      `,
      options: [{ maxNestingDepth: 3 }],
    },

    // Valid: Iterative approach instead of recursion
    {
      code: `
        function traverseTree(root) {
          const stack = [root];
          while (stack.length) { // Nesting 1
            const node = stack.pop();
            // process(node);
            // stack.push(...node.children);
          }
        }
      `,
    },
    // Valid: Lexical recursion allowed
    {
      code: `
          function outerFunc(n) {
            function innerFunc() {
              if (n > 0) {
                outerFunc(n - 1); // Lexical recursion
              }
            }
            innerFunc();
          }
        `,
      options: [{ allowRecursion: true }],
    },
  ],

  invalid: [
    // Invalid: Excessive nesting
    {
      code: `
        function handleRequest(req) {
          if (req.authenticated) { // Nesting 1
            if (req.hasPermission) { // Nesting 2
              if (req.isValid) { // Nesting 3
                if (req.meetsCriteria) { // Nesting 4 - Exceeds
                  return process(req);
                }
              }
            }
          }
        }
      `,
      options: [{ maxNestingDepth: 3 }],
      errors: [
        {
          messageId: 'excessiveNesting',
          data: { maxDepth: 3, currentDepth: 4 },
          type: 'IfStatement', // The node that caused the depth to exceed
          line: 6, // Line of the 4th if
        },
      ],
    },

    // Invalid: Direct recursion when not allowed
    {
      code: `
        function traverse(node) {
          // process(node);
          traverse(node.next); // Direct recursion
        }
      `,
      options: [{ allowRecursion: false }], // Default is false, but explicit for clarity
      errors: [
        {
          messageId: 'unsafeRecursion',
          data: { functionName: 'traverse' },
          type: 'CallExpression',
          line: 4,
        },
      ],
    },

    // Invalid: Lexical recursion (inner function calls outer containing function)
    {
      code: `
        function outerFunc(n) {
          function innerFunc() {
            if (n > 0) {
              outerFunc(n - 1); // Lexical recursion
            }
          }
          innerFunc();
          return n;
        }
      `,
      options: [{ allowRecursion: false }],
      errors: [
        {
          messageId: 'lexicalRecursion',
          data: {
            calledFunctionName: 'outerFunc',
            currentFunctionName: 'innerFunc',
          },
          type: 'CallExpression',
          line: 5,
        },
      ],
    },

    // Invalid: Multiple issues (Nesting and Direct Recursion)
    {
      code: `
        function complexFlow(data, condition, modified) {
          if (data) { // Nesting 1
            while (condition) { // Nesting 2
              if (checkSomething()) { // Nesting 3 - Exceeds
                return complexFlow(modified); // Direct recursion
              }
            }
          }
        }
      `,
      options: [{ maxNestingDepth: 2, allowRecursion: false }],
      errors: [
        {
          messageId: 'excessiveNesting',
          data: { maxDepth: 2, currentDepth: 3 },
          type: 'IfStatement', // The node that caused the depth to exceed
          line: 5,
        },
        {
          messageId: 'unsafeRecursion',
          data: { functionName: 'complexFlow' },
          type: 'CallExpression',
          line: 6,
        },
      ],
    },
  ],
});

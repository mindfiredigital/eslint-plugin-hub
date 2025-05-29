// lib/rules/general/plugin/use-runtime-assertions.js
module.exports = {
  rules: {
    'use-runtime-assertions': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce the presence of a minimum number of runtime assertions in functions to validate inputs and critical intermediate values.',
          category: 'Best Practices',
          recommended: false,
          url: 'https://your-documentation-site.com/rules/use-runtime-assertions',
        },
        fixable: null,
        schema: [
          {
            type: 'object',
            properties: {
              minAssertions: {
                type: 'integer',
                minimum: 0,
                default: 2,
              },
              assertionUtilityNames: {
                type: 'array',
                items: {
                  type: 'string',
                },
                default: ['assert'],
              },
              ignoreEmptyFunctions: {
                type: 'boolean',
                default: true,
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          missingAssertions:
            'Function "{{functionName}}" should have at least {{minCount}} runtime assertions, but found {{foundCount}}.',
        },
      },
      create: function (context) {
        const options = context.options[0] || {};
        const minAssertions =
          options.minAssertions === undefined ? 2 : options.minAssertions;
        const assertionUtilityNames = new Set(
          options.assertionUtilityNames || ['assert']
        );
        const ignoreEmptyFunctions =
          options.ignoreEmptyFunctions === undefined
            ? true
            : options.ignoreEmptyFunctions;

        function getFunctionName(node) {
          if (node.id && node.id.name) {
            return node.id.name;
          }
          if (
            node.parent &&
            node.parent.type === 'VariableDeclarator' &&
            node.parent.id &&
            node.parent.id.name
          ) {
            return node.parent.id.name;
          }
          if (
            node.parent &&
            node.parent.type === 'Property' &&
            node.parent.key &&
            node.parent.key.name
          ) {
            return node.parent.key.name;
          }
          if (
            node.parent &&
            node.parent.type === 'AssignmentExpression' &&
            node.parent.left &&
            node.parent.left.name
          ) {
            return node.parent.left.name;
          }
          return 'anonymous';
        }

        function isAssertionLike(statementNode) {
          // 1. If statement that throws
          if (statementNode.type === 'IfStatement') {
            let foundThrow = false;
            function checkForThrow(node) {
              if (!node) return;
              if (node.type === 'BlockStatement') {
                node.body.forEach(stmt => {
                  if (stmt.type === 'ThrowStatement') {
                    foundThrow = true;
                  }
                  // Check nested structures
                  if (stmt.type === 'IfStatement') {
                    checkForThrow(stmt.consequent);
                    if (stmt.alternate) checkForThrow(stmt.alternate);
                  }
                });
              } else if (node.type === 'ThrowStatement') {
                foundThrow = true;
              }
            }
            checkForThrow(statementNode.consequent);
            if (statementNode.alternate) {
              checkForThrow(statementNode.alternate);
            }
            return foundThrow;
          }

          // 2. Direct ThrowStatement
          if (statementNode.type === 'ThrowStatement') {
            return true;
          }

          // 3. Call to console.assert or custom assertion utilities
          if (
            statementNode.type === 'ExpressionStatement' &&
            statementNode.expression.type === 'CallExpression'
          ) {
            const callee = statementNode.expression.callee;
            // console.assert() - only count if 'assert' is in assertionUtilityNames
            if (
              callee.type === 'MemberExpression' &&
              callee.object.type === 'Identifier' &&
              callee.object.name === 'console' &&
              callee.property.type === 'Identifier' &&
              callee.property.name === 'assert' &&
              assertionUtilityNames.has('assert')
            ) {
              return true;
            }
            // customAssert()
            if (
              callee.type === 'Identifier' &&
              assertionUtilityNames.has(callee.name)
            ) {
              return true;
            }
          }
          return false;
        }

        function isEmpty(functionBody) {
          return !functionBody || functionBody.length === 0;
        }

        function checkFunction(node) {
          // Skip if no body (for function declarations) or not a block statement
          if (!node.body) {
            return; // Arrow functions with implicit return
          }

          if (node.body.type !== 'BlockStatement') {
            return; // Arrow functions with expression body
          }

          const functionBody = node.body.body;

          // Skip empty functions if configured to do so
          if (ignoreEmptyFunctions && isEmpty(functionBody)) {
            return;
          }

          let assertionCount = 0;

          for (const statement of functionBody) {
            if (isAssertionLike(statement)) {
              assertionCount++;
            }
          }

          if (assertionCount < minAssertions) {
            context.report({
              node: node,
              messageId: 'missingAssertions',
              data: {
                functionName: getFunctionName(node),
                minCount: minAssertions,
                foundCount: assertionCount,
              },
            });
          }
        }

        return {
          FunctionDeclaration: checkFunction,
          FunctionExpression: checkFunction,
          ArrowFunctionExpression: checkFunction,
        };
      },
    },
  },
};

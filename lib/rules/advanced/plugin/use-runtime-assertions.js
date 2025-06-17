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
            node.parent.left.type === 'Identifier' && // Ensure left is an Identifier
            node.parent.left.name
          ) {
            return node.parent.left.name;
          }
          return 'anonymous';
        }

        function isEmpty(functionBodyStatements) {
          return !functionBodyStatements || functionBodyStatements.length === 0;
        }

        function checkFunction(node) {
          // Skip if no body (for function declarations with no body, rare in JS, or arrow functions with implicit return)
          if (!node.body) {
            return;
          }

          // Arrow functions with expression body (e.g. `() => x`) don't have a BlockStatement body
          if (node.body.type !== 'BlockStatement') {
            // If minAssertions is 0, these are fine. Otherwise, they have 0 assertions.
            if (minAssertions > 0) {
              context.report({
                node: node,
                messageId: 'missingAssertions',
                data: {
                  functionName: getFunctionName(node),
                  minCount: minAssertions,
                  foundCount: 0,
                },
              });
            }
            return;
          }

          const functionBodyStatements = node.body.body;

          if (ignoreEmptyFunctions && isEmpty(functionBodyStatements)) {
            // If minAssertions is 0 and ignoreEmptyFunctions is true, it's still fine.
            // If ignoreEmptyFunctions is false, the check proceeds below.
            // If minAssertions > 0 and ignoreEmptyFunctions is true, this is fine.
            if (minAssertions > 0) {
              return;
            }
            // If minAssertions is 0, and ignoreEmptyFunctions is true, we can return.
            // If ignoreEmptyFunctions is false, we let it proceed to count (which will be 0)
            // and then it will correctly report if minAssertions is > 0 (covered by the final check).
            // This ensures that { ignoreEmptyFunctions: false, minAssertions: 0 } is valid.
            if (minAssertions === 0) {
              return;
            }
          }

          let assertionCount = 0;

          function findAssertionsRecursive(currentNode) {
            if (!currentNode) {
              return;
            }

            // Check if the current node itself is an assertion primitive
            if (currentNode.type === 'ThrowStatement') {
              assertionCount++;
            } else if (
              currentNode.type === 'ExpressionStatement' &&
              currentNode.expression.type === 'CallExpression'
            ) {
              const callee = currentNode.expression.callee;
              if (
                callee.type === 'MemberExpression' &&
                callee.object.type === 'Identifier' &&
                callee.object.name === 'console' &&
                callee.property.type === 'Identifier' &&
                callee.property.name === 'assert' &&
                assertionUtilityNames.has('assert')
              ) {
                assertionCount++;
              } else if (
                callee.type === 'Identifier' &&
                assertionUtilityNames.has(callee.name)
              ) {
                assertionCount++;
              }
            }

            switch (currentNode.type) {
              case 'BlockStatement':
                currentNode.body.forEach(findAssertionsRecursive);
                break;
              case 'IfStatement':
                findAssertionsRecursive(currentNode.consequent);
                if (currentNode.alternate) {
                  findAssertionsRecursive(currentNode.alternate);
                }
                break;
              case 'ForStatement':
                if (currentNode.init) findAssertionsRecursive(currentNode.init);
                findAssertionsRecursive(currentNode.body);
                break;
              case 'ForInStatement':
              case 'ForOfStatement':
                // left and right are expressions or declarations
                findAssertionsRecursive(currentNode.body);
                break;
              case 'WhileStatement':
              case 'DoWhileStatement':
                // test is an expression
                findAssertionsRecursive(currentNode.body);
                break;
              case 'SwitchStatement':
                // discriminant is an expression
                currentNode.cases.forEach(switchCase => {
                  // switchCase.test is an expression
                  switchCase.consequent.forEach(findAssertionsRecursive);
                });
                break;
              case 'TryStatement':
                findAssertionsRecursive(currentNode.block);
                if (currentNode.handler) {
                  // CatchClause
                  findAssertionsRecursive(currentNode.handler.body);
                }
                if (currentNode.finalizer) {
                  findAssertionsRecursive(currentNode.finalizer);
                }
                break;
              case 'LabeledStatement':
              case 'WithStatement':
                findAssertionsRecursive(currentNode.body);
                break;
            }
          }

          // For functions with BlockStatement bodies (already checked earlier)
          // Start traversal from the function's BlockStatement node (node.body)
          findAssertionsRecursive(node.body);

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

module.exports = {
  rules: {
    'minimize-deep-asynchronous-chains': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Limits the depth of Promise chains and the number of await expressions in async functions.',
          category: 'Best Practices',
          recommended: false,
          url: 'https://your-doc-site.com/rules/minimize-deep-asynchronous-chains',
        },
        fixable: null,
        schema: [
          {
            type: 'object',
            properties: {
              maxPromiseChainLength: {
                type: 'integer',
                minimum: 1,
                default: 3,
              },
              maxAwaitExpressions: {
                type: 'integer',
                minimum: 1,
                default: 3,
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          tooManyThenCalls:
            'Promise chain starting at {{functionName}} has {{count}} .then/.catch/.finally calls, exceeding the maximum of {{maxCount}}.',
          tooManyAwaitExpressions:
            'Async function "{{functionName}}" has {{count}} await expressions, exceeding the maximum of {{maxCount}}.',
        },
      },
      create: function (context) {
        const options = context.options[0] || {};
        const maxPromiseChainLength =
          options.maxPromiseChainLength === undefined
            ? 3
            : options.maxPromiseChainLength;
        const maxAwaitExpressions =
          options.maxAwaitExpressions === undefined
            ? 3
            : options.maxAwaitExpressions;

        function getFunctionName(node) {
          if (node.id && node.id.name) return node.id.name;
          if (
            node.parent &&
            node.parent.type === 'VariableDeclarator' &&
            node.parent.id.name
          )
            return node.parent.id.name;
          if (
            node.parent &&
            node.parent.type === 'Property' &&
            node.parent.key.name
          )
            return node.parent.key.name;
          if (
            node.parent &&
            node.parent.type === 'AssignmentExpression' &&
            node.parent.left.name
          )
            return node.parent.left.name;
          return 'anonymous function';
        }

        // Track processed chains to avoid duplicate reports
        const processedChains = new Set();

        function getChainIdentifier(node) {
          // Create a unique identifier for the chain based on location
          return `${node.loc.start.line}:${node.loc.start.column}-${node.loc.end.line}:${node.loc.end.column}`;
        }

        function getPromiseOriginName(node) {
          // Navigate to the root of the promise chain
          let current = node;

          // Go up the chain to find the original promise
          while (
            current.callee &&
            current.callee.type === 'MemberExpression' &&
            ['then', 'catch', 'finally'].includes(current.callee.property.name)
          ) {
            if (current.callee.object.type === 'CallExpression') {
              // Check if this is still part of the chain
              if (
                current.callee.object.callee.type === 'MemberExpression' &&
                ['then', 'catch', 'finally'].includes(
                  current.callee.object.callee.property.name
                )
              ) {
                current = current.callee.object;
              } else {
                // This is the original function call that returns a promise
                break;
              }
            } else {
              // Reached the base promise
              break;
            }
          }

          // Extract the name from the original promise
          const originalPromise = current.callee.object;

          if (originalPromise.type === 'Identifier') {
            return originalPromise.name;
          } else if (originalPromise.type === 'CallExpression') {
            if (originalPromise.callee.type === 'Identifier') {
              return originalPromise.callee.name + '()';
            } else if (
              originalPromise.callee.type === 'MemberExpression' &&
              originalPromise.callee.property.name
            ) {
              return originalPromise.callee.property.name + '()';
            }
          } else if (originalPromise.type === 'NewExpression') {
            if (originalPromise.callee.type === 'Identifier') {
              return 'new ' + originalPromise.callee.name + '()';
            }
          }

          return 'a Promise';
        }

        function analyzePromiseChain(startNode) {
          let current = startNode;
          let chainLength = 0;
          const chainNodes = [];

          // Count the chain length starting from this node
          while (
            current &&
            current.type === 'CallExpression' &&
            current.callee.type === 'MemberExpression' &&
            ['then', 'catch', 'finally'].includes(current.callee.property.name)
          ) {
            chainLength++;
            chainNodes.push(current);
            current = current.callee.object;
          }

          return { chainLength, chainNodes, rootPromise: current };
        }

        // Simplified approach: Count chain length from each .then/.catch/.finally
        function checkPromiseChain(node) {
          const chainId = getChainIdentifier(node);
          if (processedChains.has(chainId)) {
            return; // Already processed this exact node
          }

          const { chainLength } = analyzePromiseChain(node);

          if (chainLength > maxPromiseChainLength) {
            processedChains.add(chainId);

            const originName = getPromiseOriginName(node);

            context.report({
              node: node,
              messageId: 'tooManyThenCalls',
              data: {
                functionName: originName,
                count: chainLength,
                maxCount: maxPromiseChainLength,
              },
            });
          }
        }

        // --- Async/Await Logic ---
        const functionAwaitCounts = new Map();

        function enterAsyncFunction(node) {
          functionAwaitCounts.set(node, 0);
        }

        function exitAsyncFunction(node) {
          const awaitCount = functionAwaitCounts.get(node) || 0;

          if (awaitCount > maxAwaitExpressions) {
            context.report({
              node: node,
              messageId: 'tooManyAwaitExpressions',
              data: {
                functionName: getFunctionName(node),
                count: awaitCount,
                maxCount: maxAwaitExpressions,
              },
            });
          }

          functionAwaitCounts.delete(node);
        }

        function findContainingAsyncFunction(node) {
          let parent = node.parent;
          while (parent) {
            if (
              (parent.type === 'FunctionDeclaration' ||
                parent.type === 'FunctionExpression' ||
                parent.type === 'ArrowFunctionExpression') &&
              parent.async
            ) {
              return parent;
            }
            parent = parent.parent;
          }
          return null;
        }

        return {
          // For Promise chains - target the outermost .then/.catch/.finally calls
          'CallExpression[callee.type="MemberExpression"][callee.property.name=/^(then|catch|finally)$/]':
            function (node) {
              checkPromiseChain(node);
            },

          // For async/await
          'FunctionDeclaration[async=true]': enterAsyncFunction,
          'FunctionDeclaration[async=true]:exit': exitAsyncFunction,
          'ArrowFunctionExpression[async=true]': enterAsyncFunction,
          'ArrowFunctionExpression[async=true]:exit': exitAsyncFunction,
          'FunctionExpression[async=true]': enterAsyncFunction,
          'FunctionExpression[async=true]:exit': exitAsyncFunction,

          AwaitExpression(node) {
            const containingFunction = findContainingAsyncFunction(node);
            if (
              containingFunction &&
              functionAwaitCounts.has(containingFunction)
            ) {
              const currentCount = functionAwaitCounts.get(containingFunction);
              functionAwaitCounts.set(containingFunction, currentCount + 1);
            }
          },
        };
      },
    },
  },
};

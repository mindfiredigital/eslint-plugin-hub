module.exports = {
  rules: {
    'minimize-complexflows': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforces simplified control flow by limiting recursion and nesting depth, and detecting direct or lexically scoped recursion.',
          recommended: 'warn',
        },
        messages: {
          excessiveNesting:
            'Avoid nesting control structures deeper than {{maxDepth}} levels. Current depth: {{currentDepth}}.',
          unsafeRecursion:
            'Direct recursion detected in function `{{functionName}}`. Consider iteration or ensure a clear, bounded termination condition if recursion is intended and allowed.',
          lexicalRecursion:
            'Lexical recursion: function `{{calledFunctionName}}` is called from an inner scope of `{{currentFunctionName}}`, creating a recursive call pattern.',
        },
        schema: [
          {
            type: 'object',
            properties: {
              maxNestingDepth: {
                type: 'number',
                minimum: 1,
                default: 3,
              },
              allowRecursion: {
                type: 'boolean',
                default: false,
              },
            },
            additionalProperties: false,
          },
        ],
      },

      create(context) {
        const options = context.options[0] || {};
        const maxNestingDepth = options.maxNestingDepth ?? 3;
        const allowRecursion = options.allowRecursion ?? false;

        const nestingStack = [0]; // Initial global depth (not used for reporting)
        const functionNameStack = []; // Stores names of functions currently in the definition call stack

        function getFunctionNameForNode(node) {
          if (node.id && node.id.name) {
            return node.id.name;
          }
          if (
            (node.type === 'FunctionExpression' ||
              node.type === 'ArrowFunctionExpression') &&
            node.parent &&
            node.parent.type === 'VariableDeclarator' &&
            node.parent.id &&
            node.parent.id.type === 'Identifier'
          ) {
            return node.parent.id.name;
          }
          if (
            (node.type === 'FunctionExpression' ||
              node.type === 'ArrowFunctionExpression') &&
            node.parent &&
            node.parent.type === 'MethodDefinition' &&
            node.parent.key &&
            node.parent.key.type === 'Identifier'
          ) {
            return node.parent.key.name;
          }
          return null;
        }

        function checkNesting(node) {
          const currentFunctionNestingDepth =
            nestingStack[nestingStack.length - 1];
          if (currentFunctionNestingDepth > maxNestingDepth) {
            context.report({
              node: node,
              messageId: 'excessiveNesting',
              data: {
                maxDepth: maxNestingDepth,
                currentDepth: currentFunctionNestingDepth,
              },
            });
          }
        }

        // Common logic for when exiting any function node
        function handleFunctionExit() {
          // These variables (nestingStack, functionNameStack) are from the create() scope (closure)
          if (nestingStack.length > 1) {
            // Ensure we don't pop the global base
            nestingStack.pop();
          }
          if (functionNameStack.length > 0) {
            functionNameStack.pop();
          }
        }

        // --- AST Traversal ---
        return {
          // 1. Function Entry and Nesting Depth Management
          'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression'(
            node
          ) {
            nestingStack.push(0); // Each function gets its own nesting counter

            const name = getFunctionNameForNode(node);
            functionNameStack.push(name || '<anonymous>'); // Push name or placeholder
          },

          // Function Exit (using the common handler)
          'FunctionDeclaration:exit': handleFunctionExit,
          'FunctionExpression:exit': handleFunctionExit,
          'ArrowFunctionExpression:exit': handleFunctionExit, // This was where the ReferenceError occurred

          // Control structures that increase nesting depth
          'IfStatement, ForStatement, ForInStatement, ForOfStatement, WhileStatement, DoWhileStatement, SwitchStatement'(
            node
          ) {
            if (nestingStack.length > 1) {
              // Ensure we are inside a function
              nestingStack[nestingStack.length - 1]++;
              checkNesting(node);
            }
          },

          // 2. Recursion Checks
          CallExpression(node) {
            if (allowRecursion || functionNameStack.length === 0) {
              return;
            }

            let calledFunctionName = null;
            if (node.callee.type === 'Identifier') {
              calledFunctionName = node.callee.name;
            } else if (
              node.callee.type === 'MemberExpression' &&
              node.callee.property.type === 'Identifier'
            ) {
              calledFunctionName = node.callee.property.name;
            }

            if (!calledFunctionName) {
              return;
            }

            const currentFunctionName =
              functionNameStack[functionNameStack.length - 1];

            // Direct recursion
            if (
              currentFunctionName &&
              currentFunctionName !== '<anonymous>' &&
              calledFunctionName === currentFunctionName
            ) {
              context.report({
                node: node,
                messageId: 'unsafeRecursion',
                data: { functionName: currentFunctionName },
              });
              return;
            }

            // Lexical recursion
            if (
              currentFunctionName &&
              functionNameStack.slice(0, -1).includes(calledFunctionName)
            ) {
              context.report({
                node: node,
                messageId: 'lexicalRecursion',
                data: {
                  calledFunctionName: calledFunctionName,
                  currentFunctionName: currentFunctionName,
                },
              });
            }
          },
        };
      },
    },
  },
};

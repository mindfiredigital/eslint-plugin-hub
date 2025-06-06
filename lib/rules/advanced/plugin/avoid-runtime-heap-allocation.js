module.exports = {
  rules: {
    'avoid-runtime-heap-allocation': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Discourages heap allocation of common data structures (arrays, objects, Maps, Sets) within function bodies, especially in loops, to promote reuse of pre-allocated structures and reduce garbage collection pressure.',
          recommended: 'warn',
          url: '', // TODO: Add a URL to your rule's documentation
        },
        messages: {
          allocationInFunction:
            "Runtime allocation of '{{constructType}}' ({{nodeText}}) detected in function '{{functionName}}'. Consider pre-allocating and reusing, especially if this function is called frequently or is performance-sensitive.",
          allocationInLoop:
            "Runtime allocation of '{{constructType}}' ({{nodeText}}) detected inside a loop within function '{{functionName}}'. This can severely impact performance. Pre-allocate and reuse this structure.",
        },
        schema: [
          {
            type: 'object',
            properties: {
              checkLoopsOnly: {
                type: 'boolean',
                default: false,
                description:
                  'If true, only flags allocations found inside loops within functions.',
              },
              allowedConstructs: {
                type: 'array',
                items: {
                  type: 'string',
                  enum: ['Array', 'Object', 'Map', 'Set', 'WeakMap', 'WeakSet'],
                },
                default: [],
                description:
                  "List of constructor names (e.g., 'Map', 'Set') to allow even if allocated at runtime within functions/loops.",
              },
            },
            additionalProperties: false,
          },
        ],
        fixable: null,
      },
      create(context) {
        const options = context.options[0] || {};
        const checkLoopsOnly = options.checkLoopsOnly ?? false;
        const allowedConstructs = new Set(options.allowedConstructs || []);

        const sourceCode = context.getSourceCode();

        const functionStack = [];
        let loopDepth = 0;

        function getFunctionName(node) {
          if (node.type === 'FunctionDeclaration' && node.id) {
            return node.id.name;
          }
          if (
            node.type === 'FunctionExpression' ||
            node.type === 'ArrowFunctionExpression'
          ) {
            if (
              node.parent.type === 'VariableDeclarator' &&
              node.parent.id &&
              node.parent.id.type === 'Identifier'
            ) {
              return node.parent.id.name;
            }
            if (
              node.parent.type === 'MethodDefinition' &&
              node.parent.key &&
              node.parent.key.type === 'Identifier'
            ) {
              return node.parent.key.name;
            }
            if (
              node.parent.type === 'Property' &&
              node.parent.key &&
              node.parent.key.type === 'Identifier'
            ) {
              return node.parent.key.name;
            }
          }
          return '<anonymous>';
        }

        function reportAllocation(node, constructType) {
          if (allowedConstructs.has(constructType)) {
            return;
          }
          if (functionStack.length === 0) {
            return; // Not inside a function (module scope)
          }

          const currentFunctionName = functionStack[functionStack.length - 1];
          const nodeTextFull = sourceCode.getText(node);
          const nodeText =
            nodeTextFull.length > 25
              ? nodeTextFull.slice(0, 25) + '...'
              : nodeTextFull;

          if (loopDepth > 0) {
            context.report({
              node,
              messageId: 'allocationInLoop',
              data: {
                constructType,
                nodeText,
                functionName: currentFunctionName,
              },
            });
          } else if (!checkLoopsOnly) {
            context.report({
              node,
              messageId: 'allocationInFunction',
              data: {
                constructType,
                nodeText,
                functionName: currentFunctionName,
              },
            });
          }
        }

        return {
          ':function'(node) {
            functionStack.push(getFunctionName(node));
          },
          ':function:exit'() {
            functionStack.pop();
          },

          ForStatement() {
            loopDepth++;
          },
          ForInStatement() {
            loopDepth++;
          },
          ForOfStatement() {
            loopDepth++;
          },
          WhileStatement() {
            loopDepth++;
          },
          DoWhileStatement() {
            loopDepth++;
          },
          'ForStatement:exit'() {
            loopDepth--;
          },
          'ForInStatement:exit'() {
            loopDepth--;
          },
          'ForOfStatement:exit'() {
            loopDepth--;
          },
          'WhileStatement:exit'() {
            loopDepth--;
          },
          'DoWhileStatement:exit'() {
            loopDepth--;
          },

          ArrayExpression(node) {
            if (
              node.elements.length === 0 &&
              node.parent &&
              node.parent.type === 'AssignmentPattern' &&
              node.parent.right === node
            ) {
              return;
            }
            reportAllocation(node, 'Array');
          },
          ObjectExpression(node) {
            if (
              node.properties.length === 0 &&
              node.parent &&
              node.parent.type === 'AssignmentPattern' &&
              node.parent.right === node
            ) {
              return;
            }
            reportAllocation(node, 'Object');
          },
          NewExpression(node) {
            if (node.callee.type === 'Identifier') {
              const constructorName = node.callee.name;
              if (
                [
                  'Array',
                  'Object',
                  'Map',
                  'Set',
                  'WeakMap',
                  'WeakSet',
                ].includes(constructorName)
              ) {
                reportAllocation(node, constructorName);
              }
            }
          },
        };
      },
    },
  },
};

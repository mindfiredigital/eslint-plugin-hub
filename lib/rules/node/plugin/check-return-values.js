'use strict';

const consoleMethods = new Set([
  'log',
  'warn',
  'error',
  'info',
  'debug',
  'table',
  'trace',
  'dir',
  'dirxml',
  'group',
  'groupCollapsed',
  'groupEnd',
  'time',
  'timeLog',
  'timeEnd',
  'clear',
  'count',
  'countReset',
  'assert',
  'profile',
  'profileEnd',
  'timeStamp',
]);

module.exports = {
  rules: {
    'check-return-values': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce handling of return values from non-void functions. If the return value is intentionally not used, it should be explicitly ignored.',
          category: 'Best Practices',
          recommended: false,
        },
        fixable: null,
        schema: [
          {
            type: 'object',
            properties: {
              requireExplicitIgnore: {
                type: 'boolean',
                default: true,
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          returnValueNotHandled:
            "Return value of function '{{functionName}}' should be handled or explicitly ignored.",
        },
      },
      create: function (context) {
        const options = context.options[0] || {};
        const requireExplicitIgnore =
          options.requireExplicitIgnore !== undefined
            ? options.requireExplicitIgnore
            : true;

        const sourceCode = context.getSourceCode();

        function getFunctionName(callExprNode) {
          const callee = callExprNode.callee;
          if (callee.type === 'Identifier') {
            return callee.name;
          }
          if (callee.type === 'MemberExpression') {
            return sourceCode.getText(callee);
          }
          // Avoid overly complex names for IIFEs or deeply nested calls in the message
          if (
            callee.type === 'FunctionExpression' ||
            callee.type === 'ArrowFunctionExpression'
          ) {
            return callee.id ? callee.id.name : '(anonymous function)';
          }
          return sourceCode.getText(callee).slice(0, 50); // Cap length for very long textual representations
        }

        function isConsoleCall(node) {
          const callee = node.callee;
          return (
            callee.type === 'MemberExpression' &&
            callee.object.type === 'Identifier' &&
            callee.object.name === 'console' &&
            callee.property.type === 'Identifier' &&
            consoleMethods.has(callee.property.name)
          );
        }

        return {
          CallExpression(node) {
            const parent = node.parent;

            // 1. Check if the return value is "used" in common ways
            if (
              (parent.type === 'VariableDeclarator' && parent.init === node) ||
              (parent.type === 'AssignmentExpression' &&
                parent.right === node &&
                !(
                  parent.left.type === 'Identifier' && parent.left.name === '_'
                )) ||
              (parent.type === 'Property' && parent.value === node) ||
              (parent.type === 'ReturnStatement' && parent.argument === node) ||
              (parent.type === 'ArrowFunctionExpression' &&
                parent.body === node) || // Implicit return
              (parent.type === 'ConditionalExpression' &&
                (parent.test === node ||
                  parent.consequent === node ||
                  parent.alternate === node)) ||
              (parent.type === 'IfStatement' && parent.test === node) ||
              (parent.type === 'SwitchStatement' &&
                parent.discriminant === node) ||
              (parent.type === 'CallExpression' &&
                parent.arguments.includes(node)) ||
              (parent.type === 'NewExpression' &&
                parent.arguments.includes(node)) ||
              (parent.type === 'ArrayExpression' &&
                parent.elements.includes(node)) ||
              parent.type === 'BinaryExpression' || // e.g., x + foo(), foo() > 0
              parent.type === 'LogicalExpression' || // e.g., foo() && bar()
              (parent.type === 'UnaryExpression' &&
                parent.operator !== 'void') || // e.g., !foo(), await foo() but not void foo()
              parent.type === 'UpdateExpression' || // e.g. ++foo()
              parent.type === 'YieldExpression' || // e.g. yield foo()
              parent.type === 'AwaitExpression' || // e.g. await foo()
              parent.type === 'TaggedTemplateExpression' || // e.g. a` ${foo()} `
              parent.type === 'SpreadElement' // e.g. [...foo()]
            ) {
              return;
            }

            // 2. Check for explicit `void` operator
            if (
              parent.type === 'UnaryExpression' &&
              parent.operator === 'void' &&
              parent.argument === node
            ) {
              return;
            }

            // 3. Check for explicit ignore: `_ = foo();` as a statement
            if (
              parent.type === 'AssignmentExpression' &&
              parent.right === node &&
              parent.left.type === 'Identifier' &&
              parent.left.name === '_' &&
              parent.parent.type === 'ExpressionStatement' &&
              parent.parent.expression === parent
            ) {
              return;
            }

            // 4. If we reach here, the CallExpression's value might be discarded.
            // This typically happens if it's the main expression in an ExpressionStatement.
            if (
              parent.type === 'ExpressionStatement' &&
              parent.expression === node
            ) {
              // 4a. Exempt console calls
              if (isConsoleCall(node)) {
                return;
              }

              // 4b. If explicit ignore is not required, allow it
              if (!requireExplicitIgnore) {
                return;
              }

              // 4c. Check for ignoring comments
              let commentIgnored = false;
              const statementNode = parent; // The ExpressionStatement

              // Check for a comment on the line immediately preceding the statement
              const commentsBefore =
                sourceCode.getCommentsBefore(statementNode);
              for (const comment of commentsBefore) {
                if (
                  comment.value.trim().toLowerCase() ===
                    'return value intentionally ignored' &&
                  comment.loc.end.line === statementNode.loc.start.line - 1
                ) {
                  commentIgnored = true;
                  break;
                }
              }

              if (!commentIgnored) {
                // Check for a trailing comment on the same line as the CallExpression's statement
                // Get all comments associated with the statementNode itself might be more robust
                const commentsInStatement =
                  sourceCode.getCommentsInside(statementNode);
                const trailingComments =
                  sourceCode.getCommentsAfter(statementNode); // or node
                const allPotentialTrailingComments = [
                  ...commentsInStatement,
                  ...trailingComments,
                ];

                for (const comment of allPotentialTrailingComments) {
                  // Ensure comment is on the same line the statement ends or CallExpression ends
                  if (
                    comment.loc.start.line === statementNode.loc.end.line ||
                    comment.loc.start.line === node.loc.end.line
                  ) {
                    if (
                      comment.value.trim().toLowerCase() ===
                      'return value intentionally ignored'
                    ) {
                      commentIgnored = true;
                      break;
                    }
                  }
                }
              }

              if (!commentIgnored) {
                context.report({
                  node: node,
                  messageId: 'returnValueNotHandled',
                  data: { functionName: getFunctionName(node) },
                });
              }
            }
          },
        };
      },
    },
  },
};

module.exports = {
  rules: {
    'consistent-return': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Require return statements to either always or never specify values',
          category: 'Best Practices',
          recommended: false,
        },
        schema: [],
        messages: {
          missingReturn: 'Expected {{name}} to return a value.',
          inconsistentReturn:
            'Function {{name}} should either always return a value or never return a value.',
        },
      },
      create(context) {
        function checkFunction(node) {
          let hasReturnWithValue = false;
          let hasReturnWithoutValue = false;
          let hasAnyReturn = false;
          let isConsistent = true;

          function checkReturnStatement(returnNode, inConditional) {
            hasAnyReturn = true;
            if (returnNode.argument) {
              hasReturnWithValue = true;
            } else {
              hasReturnWithoutValue = true;
            }
            if (!inConditional && hasReturnWithValue && hasReturnWithoutValue) {
              isConsistent = false;
            }
          }

          function checkBody(body, inConditional = false) {
            if (body.type === 'BlockStatement') {
              body.body.forEach(statement => {
                if (statement.type === 'ReturnStatement') {
                  checkReturnStatement(statement, inConditional);
                } else if (statement.type === 'IfStatement') {
                  checkBody(statement.consequent, true);
                  if (statement.alternate) {
                    checkBody(statement.alternate, true);
                  }
                }
              });
            } else if (body.type === 'ReturnStatement') {
              checkReturnStatement(body, inConditional);
            }
          }

          checkBody(node.body);

          if (!hasAnyReturn) {
            context.report({
              node,
              messageId: 'missingReturn',
              data: {
                name: node.id ? node.id.name : 'function',
              },
            });
          } else if (!isConsistent) {
            context.report({
              node,
              messageId: 'inconsistentReturn',
              data: {
                name: node.id ? node.id.name : 'function',
              },
            });
          }
        }

        return {
          FunctionDeclaration: checkFunction,
          FunctionExpression: checkFunction,
          ArrowFunctionExpression(node) {
            if (node.body.type !== 'BlockStatement') {
              // Implicit return, always consistent
              return;
            }
            checkFunction(node);
          },
        };
      },
    },
  },
};

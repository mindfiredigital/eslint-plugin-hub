const camelCase = /^[a-z][a-zA-Z0-9]*$/;

module.exports = {
  rules: {
    'function-camelcase': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce camelCase naming convention for function names',
        },
        schema: [], // No options needed
        messages: {
          notCamelCase: "Function name '{{name}}' should be in camelCase.",
        },
      },
      create(context) {
        function checkFunctionName(node) {
          const functionName = node.id && node.id.name;

          // Ensure functionName is a string before proceeding
          if (typeof functionName !== 'string') {
            return;
          }

          // Check if function name is in camelCase
          if (!camelCase.test(functionName)) {
            context.report({
              node: node.id,
              messageId: 'notCamelCase',
              data: { name: functionName },
            });
          }
        }

        return {
          FunctionDeclaration(node) {
            checkFunctionName(node);
          },
          FunctionExpression(node) {
            if (
              node.parent &&
              node.parent.type === 'VariableDeclarator' &&
              node.parent.id
            ) {
              checkFunctionName(node.parent);
            }
          },
          ArrowFunctionExpression(node) {
            if (
              node.parent &&
              node.parent.type === 'VariableDeclarator' &&
              node.parent.id
            ) {
              checkFunctionName(node.parent);
            }
          },
        };
      },
    },
  },
};

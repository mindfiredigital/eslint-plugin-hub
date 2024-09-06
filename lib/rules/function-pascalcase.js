const pascalCase = /^[A-Z][a-zA-Z0-9]*$/;

module.exports = {
  rules: {
    'function-pascalcase': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce PascalCase naming convention for function names',
        },
        schema: [], // No options needed
        messages: {
          notPascalCase: "Function name '{{name}}' should be in PascalCase.",
        },
      },
      create(context) {
        function checkFunctionName(node) {
          const functionName = node.id && node.id.name;

          // Ensure functionName is a string before proceeding
          if (typeof functionName !== 'string') {
            return;
          }

          // Check if function name is in PascalCase
          if (!pascalCase.test(functionName)) {
            context.report({
              node: node.id,
              messageId: 'notPascalCase',
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

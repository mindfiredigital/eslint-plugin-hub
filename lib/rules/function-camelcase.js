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
        return {
          FunctionDeclaration(node) {
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
          },
        };
      },
    },
  },
};

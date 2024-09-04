const { isVerb } = require('../utils/check-verb');

module.exports = {
  rules: {
    'function-descriptive': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce function names to start with a verb and be descriptive',
        },
        schema: [], // No options needed
        messages: {
          notDescriptive:
            "Function name '{{name}}' should start with a verb and be descriptive.",
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

            // Check if the first word in the camelCase function name is a verb
            const firstWord = functionName.split(/(?=[A-Z])/)[0];
            if (!isVerb(firstWord)) {
              context.report({
                node: node.id,
                messageId: 'notDescriptive',
                data: { name: functionName },
              });
            }
          },
        };
      },
    },
  },
};

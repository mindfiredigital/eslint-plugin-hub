const { isVerb } = require('../../../utils/check-verb');

module.exports = {
  rules: {
    'vars-descriptive': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce variable names to start with a verb and be descriptive',
        },
        schema: [], // No options needed
        messages: {
          notDescriptive:
            "Variable name '{{name}}' should start with a verb and be descriptive.",
        },
      },
      create(context) {
        return {
          VariableDeclarator(node) {
            const variableName = node.id && node.id.name;

            // Ensure variableName is a string before proceeding
            if (typeof variableName !== 'string') {
              return;
            }

            // Check if the first word in the camelCase variable is a verb
            const firstWord = variableName.split(/(?=[A-Z])/)[0];
            if (!isVerb(firstWord)) {
              context.report({
                node: node.id,
                messageId: 'notDescriptive',
                data: { name: variableName },
              });
            }
          },
        };
      },
    },
  },
};

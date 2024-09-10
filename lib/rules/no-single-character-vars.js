module.exports = {
  rules: {
    'no-single-character-vars': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow single-character variable names declared with var, let, or const',
        },
        schema: [], // No options needed
        messages: {
          singleCharVar:
            "Variable '{{name}}' should not be a single character.",
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

            // Check if variable name is a single character
            if (variableName.length === 1) {
              context.report({
                node: node.id,
                messageId: 'singleCharVar',
                data: { name: variableName },
              });
            }
          },
        };
      },
    },
  },
};

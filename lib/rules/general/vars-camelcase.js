const camelCase = /^[a-z][a-zA-Z0-9]*$/;

module.exports = {
  rules: {
    'vars-camelcase': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce camelCase naming convention for variables declared with var, let, or const',
        },
        schema: [], // No options needed
        messages: {
          notCamelCase: "Variable '{{name}}' should be in camelCase.",
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

            // Check if variable name is in camelCase
            if (!camelCase.test(variableName)) {
              context.report({
                node: node.id,
                messageId: 'notCamelCase',
                data: { name: variableName },
              });
            }
          },
        };
      },
    },
  },
};

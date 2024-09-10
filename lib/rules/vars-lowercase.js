const lowerCaseRegex = /^[a-z][a-z0-9]*$/;

module.exports = {
  rules: {
    'vars-lowercase': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce lowercase naming convention for variables declared with var, let, or const',
        },
        schema: [], // No options needed
        messages: {
          notLowerCase: "Variable '{{name}}' should be in lowercase.",
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

            // Check if variable name is in lowercase
            if (!lowerCaseRegex.test(variableName)) {
              context.report({
                node: node.id,
                messageId: 'notLowerCase',
                data: { name: variableName },
              });
            }
          },
        };
      },
    },
  },
};

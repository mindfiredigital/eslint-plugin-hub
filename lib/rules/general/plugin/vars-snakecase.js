const snakeCasePattern = /^[a-z][a-z0-9_]*$/;

module.exports = {
  rules: {
    'vars-snakecase': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce snake_case naming convention for variables declared with var, let, or const',
        },
        fixable: 'code',
        schema: [], // No options needed
        messages: {
          notSnakeCase: "Variable '{{name}}' should be in snake_case.",
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

            // Check if variable name is in snake_case
            if (!snakeCasePattern.test(variableName)) {
              context.report({
                node: node.id,
                messageId: 'notSnakeCase',
                data: { name: variableName },
                fix(fixer) {
                  // Automatically fix the variable name to snake_case
                  const snakeCaseName = variableName
                    .replace(/([A-Z])/g, '_$1') // Add underscores before uppercase letters
                    .toLowerCase() // Convert to lowercase
                    .replace(/^_/, ''); // Remove leading underscore if present

                  return fixer.replaceText(node.id, snakeCaseName);
                },
              });
            }
          },
        };
      },
    },
  },
};

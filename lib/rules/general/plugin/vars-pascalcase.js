module.exports = {
  rules: {
    'vars-pascalcase': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforce PascalCase naming convention for variables declared with var, let, or const',
        },
        fixable: 'code',
        schema: [],
        messages: {
          notPascalCase: "Variable '{{name}}' should be in PascalCase.",
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

            // Regular expression to check if the variable name is in PascalCase
            const pascalCase = /^[A-Z][a-zA-Z0-9]*$/;

            // Check if the variable name is not in PascalCase
            if (!pascalCase.test(variableName)) {
              context.report({
                node: node.id,
                messageId: 'notPascalCase',
                data: { name: variableName },
                fix: function (fixer) {
                  // Suggest a fix by converting the variable name to PascalCase
                  const pascalCaseName = variableName.replace(
                    /(^\w|_\w)/g,
                    match => match.replace('_', '').toUpperCase()
                  );
                  return fixer.replaceText(node.id, pascalCaseName);
                },
              });
            }
          },
        };
      },
    },
  },
};

module.exports = {
  rules: {
    'class-pascalcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce PascalCase for class names',
          category: 'Stylistic Issues',
          recommended: false,
        },
        schema: [], // Add schema if your rule has options
      },
      create: function (context) {
        return {
          ClassDeclaration(node) {
            // Check if the class name is not in PascalCase
            if (!/^[A-Z][A-Za-z]*$/.test(node.id.name)) {
              context.report({
                node: node.id,
                message: 'Class name "{{name}}" must be in PascalCase.',
                data: {
                  name: node.id.name,
                },
              });
            }
          },
        };
      },
    },
  },
};

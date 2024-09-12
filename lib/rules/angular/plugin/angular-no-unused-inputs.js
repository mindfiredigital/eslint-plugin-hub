const ts = require('@typescript-eslint/typescript-estree');

module.exports = {
  rules: {
    'angular-no-unused-inputs': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Warn if an @Input() property is declared but never used within the component',
        },
        messages: {
          unusedInput:
            'The @Input() property "{{property}}" is declared but never used in the component.',
        },
        schema: [], // No options for now
      },
      create(context) {
        const inputProperties = new Set();
        const usedProperties = new Set();

        function isInputDecorator(decorator) {
          return (
            decorator.expression &&
            decorator.expression.type === 'CallExpression' &&
            decorator.expression.callee &&
            decorator.expression.callee.type === 'Identifier' &&
            decorator.expression.callee.name === 'Input'
          );
        }

        return {
          Program(node) {
            // Parse the entire source code using TypeScript parser
            const ast = ts.parse(context.getSourceCode().text, {
              jsx: true,
              range: true,
              loc: true,
            });

            // Traverse the AST to find Input decorators and property usages
            ts.simpleTraverse(ast, {
              enter: node => {
                if (node.type === 'PropertyDefinition' && node.decorators) {
                  if (node.decorators.some(isInputDecorator)) {
                    inputProperties.add(node.key.name);
                  }
                } else if (
                  node.type === 'MemberExpression' &&
                  node.object.type === 'ThisExpression' &&
                  node.property.type === 'Identifier'
                ) {
                  usedProperties.add(node.property.name);
                }
              },
            });

            // Report unused inputs
            inputProperties.forEach(inputProp => {
              if (!usedProperties.has(inputProp)) {
                context.report({
                  node: ast,
                  messageId: 'unusedInput',
                  data: {
                    property: inputProp,
                  },
                });
              }
            });
          },
        };
      },
    },
  },
};

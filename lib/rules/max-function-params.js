module.exports = {
  rules: {
    'max-function-params': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Limit the number of function parameters to keep functions simple and readable',
          category: 'Best Practices',
          recommended: false,
        },
        schema: [
          {
            type: 'object',
            properties: {
              max: {
                type: 'integer',
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          tooManyParameters:
            'Function "{{name}}" has too many parameters ({{count}}). Maximum allowed is {{max}}.',
        },
      },
      create(context) {
        // Default max value
        const defaultMax = 3;

        // Get the max value from options or use default
        const options = context.options[0] || {};
        const max = options.max || defaultMax;

        return {
          FunctionDeclaration(node) {
            const parameterCount = node.params.length;

            if (parameterCount > max) {
              context.report({
                node,
                messageId: 'tooManyParameters',
                data: {
                  name: node.id ? node.id.name : 'Anonymous function',
                  count: parameterCount,
                  max: max,
                },
              });
            }
          },
          FunctionExpression(node) {
            const parameterCount = node.params.length;

            if (parameterCount > max) {
              context.report({
                node,
                messageId: 'tooManyParameters',
                data: {
                  name: 'Anonymous function',
                  count: parameterCount,
                  max: max,
                },
              });
            }
          },
          ArrowFunctionExpression(node) {
            const parameterCount = node.params.length;

            if (parameterCount > max) {
              context.report({
                node,
                messageId: 'tooManyParameters',
                data: {
                  name: 'Anonymous function',
                  count: parameterCount,
                  max: max,
                },
              });
            }
          },
        };
      },
    },
  },
};

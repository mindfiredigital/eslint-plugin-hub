module.exports = {
  rules: {
    'max-lines-per-function': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Restrict the length of functions to promote small, modular functions',
          category: 'Best Practices',
          recommended: false,
        },
        schema: [
          {
            type: 'object',
            properties: {
              max: {
                type: 'integer',
                default: 50,
                description: 'Maximum number of lines allowed in a function.',
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          tooManyLines:
            'Function "{{name}}" exceeds the maximum allowed number of {{max}} lines (actual: {{lines}}).',
        },
      },
      create(context) {
        const options = context.options[0] || {};
        const maxLines = options.max || 50;

        function checkFunction(node) {
          const functionBody = node.body;
          if (functionBody.type === 'BlockStatement') {
            const functionLines =
              functionBody.loc.end.line - functionBody.loc.start.line + 1;
            if (functionLines > maxLines) {
              context.report({
                node,
                messageId: 'tooManyLines',
                data: {
                  name: node.id ? node.id.name : 'Anonymous function',
                  max: maxLines,
                  lines: functionLines,
                },
              });
            }
          }
        }

        return {
          FunctionDeclaration: checkFunction,
          FunctionExpression: checkFunction,
          ArrowFunctionExpression: checkFunction,
        };
      },
    },
  },
};

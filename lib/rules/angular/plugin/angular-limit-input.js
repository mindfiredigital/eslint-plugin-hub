module.exports = {
  rules: {
    'angular-limit-input': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Limit the number of @Input() and @Output() properties in a component to a configurable number',
        },
        messages: {
          tooManyInputsOutputs:
            'Component "{{name}}" has too many @Input() or @Output() properties ({{count}}), limit is {{max}}.',
        },
        schema: [
          {
            type: 'object',
            properties: {
              max: {
                type: 'integer',
                minimum: 1,
                default: 5,
              },
            },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const { max = 5 } = context.options[0] || {};
        let inputOutputCount = 0;

        return {
          ClassDeclaration(node) {
            const className = node.id.name;
            inputOutputCount = 0;

            node.body.body.forEach(member => {
              if (member.decorators) {
                member.decorators.forEach(decorator => {
                  const decoratorName =
                    decorator.expression.callee.name ||
                    decorator.expression.callee.property.name;
                  if (decoratorName === 'Input' || decoratorName === 'Output') {
                    inputOutputCount += 1;
                  }
                });
              }
            });

            if (inputOutputCount > max) {
              context.report({
                node,
                messageId: 'tooManyInputsOutputs',
                data: { name: className, count: inputOutputCount, max },
              });
            }
          },
        };
      },
    },
  },
};

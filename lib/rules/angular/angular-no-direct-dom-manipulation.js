module.exports = {
  rules: {
    'angular-no-direct-dom-manipulation': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow direct DOM manipulation and enforce usage of Renderer2 for DOM manipulations in Angular',
        },
        messages: {
          avoidDirectDom:
            'Avoid direct DOM manipulation with "{{method}}". Use Angular\'s Renderer2 for DOM interactions.',
        },
        schema: [],
      },
      create(context) {
        const forbiddenMethods = [
          'getElementById',
          'querySelector',
          'querySelectorAll',
        ];
        const forbiddenObjects = ['document'];

        return {
          MemberExpression(node) {
            const { object, property } = node;

            // Check for forbidden document methods like document.getElementById()
            if (
              forbiddenObjects.includes(object.name) &&
              forbiddenMethods.includes(property.name)
            ) {
              context.report({
                node,
                messageId: 'avoidDirectDom',
                data: {
                  method: `${object.name}.${property.name}`,
                },
              });
            }

            // Check for ElementRef.nativeElement access pattern
            if (
              object.type === 'MemberExpression' &&
              object.property.name === 'nativeElement'
            ) {
              const identifier = object.object; // This will be 'elRef' or whatever the injected instance name is

              // Make sure the identifier is valid and being used with nativeElement
              if (identifier.type === 'Identifier') {
                context.report({
                  node,
                  messageId: 'avoidDirectDom',
                  data: {
                    method: `${identifier.name}.nativeElement`,
                  },
                });
              }
            }
          },
        };
      },
    },
  },
};

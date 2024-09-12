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
        schema: [], // No options for this rule
      },
      create(context) {
        const forbiddenMethods = [
          'getElementById',
          'querySelector',
          'querySelectorAll',
        ];
        return {
          MemberExpression(node) {
            const { object, property } = node;

            // Check if document methods like document.getElementById or querySelector are used
            if (
              object.name === 'document' &&
              forbiddenMethods.includes(property.name)
            ) {
              context.report({
                node,
                messageId: 'avoidDirectDom',
                data: {
                  method: `document.${property.name}`,
                },
              });
            }

            // Check if ElementRef.nativeElement is accessed
            if (
              object.type === 'MemberExpression' &&
              object.property.name === 'nativeElement' &&
              object.object.name === 'ElementRef'
            ) {
              context.report({
                node,
                messageId: 'avoidDirectDom',
                data: {
                  method: 'ElementRef.nativeElement',
                },
              });
            }
          },
        };
      },
    },
  },
};

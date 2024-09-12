const ts = require('@typescript-eslint/typescript-estree');

module.exports = {
  rules: {
    'angular-no-forbidden-services': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Disallow injection of certain services directly into components',
          category: 'Best Practices',
          recommended: true,
        },
        messages: {
          forbiddenService:
            "The service '{{ service }}' should not be injected directly into components. Consider moving it to a dedicated service or resolver.",
        },
        schema: [
          {
            type: 'object',
            properties: {
              forbiddenServices: {
                type: 'array',
                items: { type: 'string' },
              },
            },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const options = context.options[0] || {};
        const forbiddenServices = new Set(
          options.forbiddenServices || ['HttpClient']
        );

        function isComponent(node) {
          return (
            node.decorators &&
            node.decorators.some(
              decorator =>
                decorator.expression.type === 'CallExpression' &&
                decorator.expression.callee.name === 'Component'
            )
          );
        }

        function checkConstructorParameters(params) {
          params.forEach(param => {
            if (
              param.type === 'TSParameterProperty' &&
              param.parameter.type === 'Identifier'
            ) {
              const serviceType =
                param.parameter.typeAnnotation?.typeAnnotation?.typeName?.name;
              if (serviceType && forbiddenServices.has(serviceType)) {
                context.report({
                  node: param,
                  messageId: 'forbiddenService',
                  data: { service: serviceType },
                });
              }
            }
          });
        }

        return {
          Program(node) {
            const ast = ts.parse(context.getSourceCode().text, {
              jsx: true,
              range: true,
              loc: true,
            });

            ts.simpleTraverse(ast, {
              enter: node => {
                if (node.type === 'ClassDeclaration' && isComponent(node)) {
                  const constructor = node.body.body.find(
                    member =>
                      member.type === 'MethodDefinition' &&
                      member.kind === 'constructor'
                  );
                  if (constructor) {
                    checkConstructorParameters(constructor.value.params);
                  }
                }
              },
            });
          },
        };
      },
    },
  },
};

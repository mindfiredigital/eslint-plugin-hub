const defaultAllowedVerbs = ['get', 'post', 'put', 'delete', 'patch'];
const expressIdentifiers = new Set(['app', 'router']);

module.exports = {
  rules: {
    'verb-consistency': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Ensure Express routes use standard REST verbs only (GET, POST, PUT, DELETE, PATCH).',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [
          {
            type: 'object',
            properties: {
              allowedVerbs: {
                type: 'array',
                items: {
                  type: 'string',
                },
                uniqueItems: true,
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          uncommonVerb:
            '{{identifier}}.{{method}} uses an uncommon verb. Consider using one of: {{allowedVerbsList}}.',
        },
      },
      create: function (context) {
        const options = context.options[0] || {};
        const allowedVerbs = new Set(
          (options.allowedVerbs || defaultAllowedVerbs).map(v =>
            v.toLowerCase()
          )
        );

        return {
          CallExpression(node) {
            const callee = node.callee;

            if (callee.type !== 'MemberExpression') {
              return;
            }

            const method = callee.property;
            if (method.type !== 'Identifier') {
              return;
            }

            const methodName = method.name;
            const obj = callee.object;

            if (obj.type === 'Identifier' && expressIdentifiers.has(obj.name)) {
              if (!allowedVerbs.has(methodName.toLowerCase())) {
                context.report({
                  node: method,
                  messageId: 'uncommonVerb',
                  data: {
                    identifier: obj.name,
                    method: methodName,
                    allowedVerbsList: [...allowedVerbs]
                      .map(v => v.toUpperCase())
                      .join(', '),
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

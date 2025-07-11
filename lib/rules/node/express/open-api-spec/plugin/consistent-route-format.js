module.exports = {
  rules: {
    'consistent-route-format': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce consistent formatting for Express route paths: always start with a leading slash and disallow trailing slashes (unless it\'s the root "/").',
          category: 'Best Practices',
          recommended: false,
          url: 'https://mindfiredigital.github.io/eslint-plugin-hub/rules/consistent-route-format',
        },
        fixable: 'code',
        schema: [
          {
            type: 'object',
            properties: {
              allowTrailingSlash: {
                type: 'boolean',
                default: false,
                description:
                  'Whether to allow trailing slashes on all routes (except for the root "/").',
              },
              requireLeadingSlash: {
                type: 'boolean',
                default: true,
                description:
                  'Whether to require a leading slash for all non-empty route paths.',
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          missingLeadingSlash:
            'Route path "{{path}}" should start with a leading "/".',
          disallowedTrailingSlash:
            'Trailing slash in route path "{{path}}" is not allowed.',
        },
      },
      create(context) {
        const options = context.options[0] || {};
        const allowTrailingSlash = options.allowTrailingSlash ?? false;
        const requireLeadingSlash = options.requireLeadingSlash ?? true;

        const expressMethods = new Set([
          'get',
          'post',
          'put',
          'delete',
          'patch',
          'options',
          'head',
          'all',
          'use',
        ]);

        /**
         * Checks if a given node is an Express route or middleware definition.
         * Looks for patterns like `app.get('/path', handler)` or `router.post('/path', handler)`.
         * @param {ASTNode} node The node to check.
         * @returns {boolean} True if it's an Express route/middleware call, false otherwise.
         */
        function isExpressRouteCall(node) {
          // Ensure it's a CallExpression (e.g., `app.get(...)`)
          if (node.type !== 'CallExpression') {
            return false;
          }

          const callee = node.callee;

          if (callee.type === 'MemberExpression') {
            if (
              callee.property.type === 'Identifier' &&
              expressMethods.has(callee.property.name)
            ) {
              return true;
            }
          }
          return false;
        }

        /**
         * Processes a route path string to enforce consistency.
         * @param {ASTNode} node The AST node corresponding to the path string literal or template literal.
         * @param {string} pathValue The string value of the route path.
         */
        function checkRoutePath(node, pathValue) {
          if (typeof pathValue !== 'string' || pathValue.length === 0) {
            return;
          }

          let fixedPath = pathValue;
          let hasLeadingSlashError = false;
          let hasTrailingSlashError = false;

          if (requireLeadingSlash && !pathValue.startsWith('/')) {
            hasLeadingSlashError = true;
            fixedPath = '/' + fixedPath;
          }

          if (
            !allowTrailingSlash &&
            fixedPath !== '/' &&
            fixedPath.endsWith('/')
          ) {
            hasTrailingSlashError = true;
            fixedPath = fixedPath.slice(0, -1);
          }

          const finalFixedOutput =
            node.type === 'TemplateLiteral'
              ? `\`${fixedPath}\``
              : JSON.stringify(fixedPath);

          const reportAndFix = messageId => {
            context.report({
              node: node,
              messageId: messageId,
              data: { path: pathValue },
              fix(fixer) {
                return fixer.replaceText(node, finalFixedOutput);
              },
            });
          };

          if (hasLeadingSlashError) {
            reportAndFix('missingLeadingSlash');
          }
          if (hasTrailingSlashError) {
            reportAndFix('disallowedTrailingSlash');
          }
        }

        return {
          CallExpression(node) {
            if (isExpressRouteCall(node)) {
              const pathArgument = node.arguments[0];

              if (
                pathArgument &&
                pathArgument.type === 'Literal' &&
                typeof pathArgument.value === 'string'
              ) {
                checkRoutePath(pathArgument, pathArgument.value);
              } else if (
                pathArgument &&
                pathArgument.type === 'TemplateLiteral'
              ) {
                if (
                  pathArgument.quasis.length === 1 &&
                  pathArgument.expressions.length === 0
                ) {
                  checkRoutePath(
                    pathArgument,
                    pathArgument.quasis[0].value.cooked
                  );
                } else {
                  const firstQuasi = pathArgument.quasis[0];
                  if (
                    requireLeadingSlash &&
                    !firstQuasi.value.cooked.startsWith('/')
                  ) {
                    context.report({
                      node: firstQuasi,
                      messageId: 'missingLeadingSlash',
                      data: {
                        path: context.getSourceCode().getText(pathArgument),
                      },
                    });
                  }
                }
              }
            }
          },
        };
      },
    },
  },
};

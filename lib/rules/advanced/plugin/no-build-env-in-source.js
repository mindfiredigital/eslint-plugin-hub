module.exports = {
  rules: {
    'no-build-env-in-source': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Discourages direct conditional branching on `process.env` variables commonly used as build flags within source code, promoting configuration-driven behavior.',
          category: 'Best Practices',
          recommended: false,
        },
        fixable: null,
        schema: [
          {
            type: 'object',
            properties: {
              disallowedEnvVariables: {
                type: 'array',
                items: { type: 'string' },
                description:
                  "A list of `process.env` variable names (e.g., 'NODE_ENV', 'DEBUG') whose direct use in conditional statements is discouraged.",
                default: ['NODE_ENV', 'DEBUG'],
              },
              allowedComparisons: {
                type: 'object',
                description:
                  'An object where keys are disallowedEnvVariables and values are arrays of allowed comparison strings. E.g., {"NODE_ENV": ["production"]}',
                patternProperties: {
                  '^.+$': {
                    type: 'array',
                    items: { type: 'string' },
                  },
                },
                default: {},
              },
              suggestAlternative: {
                type: 'string',
                description:
                  'A message suggesting an alternative, like using a configuration module.',
                default:
                  'Consider using a dedicated configuration module or runtime flags instead of branching directly on this build/environment variable.',
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          noBuildEnvInSource: '{{alternative}} (found: {{envVarUsage}}).',
        },
      },
      create: function (context) {
        const options = context.options[0] || {};
        const disallowedEnvVariables = new Set(
          options.disallowedEnvVariables || ['NODE_ENV', 'DEBUG']
        );
        const allowedComparisons = options.allowedComparisons || {};
        const suggestAlternative =
          options.suggestAlternative ||
          'Consider using a dedicated configuration module or runtime flags instead of branching directly on this build/environment variable.';

        function getEnvVarUsageText(
          envVarName,
          comparedValue,
          isDirectUsage,
          expressionNode
        ) {
          if (isDirectUsage) {
            let prefix = '';
            // Check the original expressionNode passed to checkExpression,
            // which could be the UnaryExpression for '!'
            if (
              expressionNode.type === 'UnaryExpression' &&
              expressionNode.operator === '!'
            ) {
              prefix = '!';
            }
            return `${prefix}process.env.${envVarName}`;
          }
          if (comparedValue !== undefined) {
            return `process.env.${envVarName} === (or !==) '${String(comparedValue)}'`;
          }
          return `process.env.${envVarName}`; // Fallback
        }

        function checkExpression(expressionNode, ifStatementNode) {
          if (!expressionNode) return;

          if (expressionNode.type === 'LogicalExpression') {
            checkExpression(expressionNode.left, ifStatementNode);
            checkExpression(expressionNode.right, ifStatementNode);
            return;
          }

          let envVarName;
          let comparedValue;
          let isDirectUsage = false;

          if (
            expressionNode.type === 'BinaryExpression' &&
            (expressionNode.operator === '===' ||
              expressionNode.operator === '==' ||
              expressionNode.operator === '!==' ||
              expressionNode.operator === '!=')
          ) {
            let envAccessNode = null;
            let literalNode = null;

            const sides = [expressionNode.left, expressionNode.right];
            for (const side of sides) {
              if (
                side.type === 'MemberExpression' &&
                side.object.type === 'MemberExpression' &&
                side.object.object.type === 'Identifier' &&
                side.object.object.name === 'process' &&
                side.object.property.type === 'Identifier' &&
                side.object.property.name === 'env' &&
                side.property.type === 'Identifier'
              ) {
                envAccessNode = side;
                const otherSide =
                  side === expressionNode.left
                    ? expressionNode.right
                    : expressionNode.left;
                if (otherSide.type === 'Literal') {
                  literalNode = otherSide;
                }
                break;
              }
            }
            if (envAccessNode && literalNode) {
              envVarName = envAccessNode.property.name;
              comparedValue = literalNode.value;
            }
          } else if (
            expressionNode.type === 'MemberExpression' &&
            expressionNode.object.type === 'MemberExpression' &&
            expressionNode.object.object.type === 'Identifier' &&
            expressionNode.object.object.name === 'process' &&
            expressionNode.object.property.type === 'Identifier' &&
            expressionNode.object.property.name === 'env' &&
            expressionNode.property.type === 'Identifier'
          ) {
            envVarName = expressionNode.property.name;
            isDirectUsage = true;
          } else if (
            expressionNode.type === 'UnaryExpression' &&
            expressionNode.operator === '!' &&
            expressionNode.argument.type === 'MemberExpression' &&
            expressionNode.argument.object.type === 'MemberExpression' &&
            expressionNode.argument.object.object.type === 'Identifier' &&
            expressionNode.argument.object.object.name === 'process' &&
            expressionNode.argument.object.property.type === 'Identifier' &&
            expressionNode.argument.object.property.name === 'env' &&
            expressionNode.argument.property.type === 'Identifier'
          ) {
            envVarName = expressionNode.argument.property.name;
            isDirectUsage = true;
          }

          if (envVarName && disallowedEnvVariables.has(envVarName)) {
            const specificAllowedValues = allowedComparisons[envVarName];
            let reportError = false;

            if (isDirectUsage) {
              // Direct usage of a disallowed variable is always an error,
              // `allowedComparisons` is for specific value checks, not for allowing direct boolean usage.
              reportError = true;
            } else if (comparedValue !== undefined) {
              // It's a comparison, e.g., process.env.VAR === 'value'
              if (
                specificAllowedValues &&
                specificAllowedValues.includes(String(comparedValue))
              ) {
                // This specific comparison is allowed, so don't report.
                reportError = false;
              } else {
                // Comparison is not in the allowed list (or no allowed list for this var), so report.
                reportError = true;
              }
            }
            // else: Not direct usage and not a recognized comparison (e.g. process.env.VAR used in a function call within the if test)
            // This specific rule version doesn't deeply inspect those, so no error reported by this path.

            if (reportError) {
              context.report({
                node: ifStatementNode, // Report on the IfStatement
                messageId: 'noBuildEnvInSource',
                data: {
                  alternative: suggestAlternative,
                  envVarUsage: getEnvVarUsageText(
                    envVarName,
                    comparedValue,
                    isDirectUsage,
                    expressionNode
                  ),
                },
              });
            }
          }
        }

        return {
          IfStatement(node) {
            checkExpression(node.test, node);
          },
        };
      },
    },
  },
};

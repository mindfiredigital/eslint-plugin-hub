/**
 * Gets the name of a function node.
 * @param {ASTNode} node The function node.
 * @returns {string} The name of the function or '[anonymous_function]'.
 */
function getFunctionName(node) {
  if (node.id && node.id.name) {
    return node.id.name;
  }
  if (node.parent) {
    if (
      node.parent.type === 'VariableDeclarator' &&
      node.parent.id &&
      node.parent.id.name
    ) {
      return node.parent.id.name;
    }
    if (node.parent.type === 'Property' && node.parent.key) {
      return (
        node.parent.key.name || node.parent.key.value || '[anonymous_function]'
      );
    }
    if (
      node.parent.type === 'AssignmentExpression' &&
      node.parent.left &&
      node.parent.left.name
    ) {
      return node.parent.left.name;
    }
  }
  return '[anonymous_function]';
}

module.exports = {
  rules: {
    'keep-functions-concise': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforces a maximum number of lines per function, with options to skip blank lines and comments.',
          category: 'Best Practices',
          recommended: false,
        },
        schema: [
          {
            type: 'object',
            properties: {
              maxLines: {
                type: 'integer',
                minimum: 0,
                default: 60,
              },
              skipBlankLines: {
                type: 'boolean',
                default: false,
              },
              skipComments: {
                type: 'boolean',
                default: false,
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          tooManyLines:
            'Function "{{name}}" has {{actualLines}} lines (max {{maxLines}} allowed). {{skippedLineInfo}}',
        },
      },
      create(context) {
        const sourceCode = context.getSourceCode();
        const options = context.options[0] || {};
        const maxLines = options.maxLines !== undefined ? options.maxLines : 60;
        const skipBlankLines =
          options.skipBlankLines !== undefined ? options.skipBlankLines : false;
        const skipComments =
          options.skipComments !== undefined ? options.skipComments : false;

        /**
         * Checks a given function node for line count violations.
         * @param {ASTNode} node - The function node to check.
         */
        function checkFunction(node) {
          // Handle concise arrow functions (not enclosed in a block)
          if (node.body.type !== 'BlockStatement') {
            if (maxLines === 0) {
              context.report({
                node,
                messageId: 'tooManyLines',
                data: {
                  name: getFunctionName(node),
                  actualLines: 1,
                  maxLines: maxLines,
                  skippedLineInfo: `(concise body counted as 1 line)`,
                },
              });
            }
            return;
          }

          const body = node.body;
          const allLines = sourceCode.getLines();
          const startLineIndex = body.loc.start.line;
          const endLineIndex = body.loc.end.line - 2;

          let effectiveLineCount = 0;

          if (startLineIndex <= endLineIndex + 1) {
            for (let i = startLineIndex; i <= endLineIndex; i++) {
              const lineText = allLines[i];
              const trimmedLine = lineText.trim();

              if (skipBlankLines && trimmedLine === '') {
                continue;
              }

              if (skipComments) {
                if (
                  trimmedLine === '' ||
                  trimmedLine.startsWith('//') ||
                  (trimmedLine.startsWith('/*') && trimmedLine.endsWith('*/'))
                ) {
                  const tokensOnLine = sourceCode.getTokens(body, {
                    filter: token =>
                      token.loc.start.line === i + 1 &&
                      token.loc.end.line === i + 1,
                    includeComments: false,
                  });
                  if (tokensOnLine.length === 0) {
                    continue;
                  }
                }
              }
              effectiveLineCount++;
            }
          }

          let skippedLineInfoParts = [];
          if (skipBlankLines) skippedLineInfoParts.push('blank lines skipped');
          if (skipComments) skippedLineInfoParts.push('comment lines skipped');
          const skippedLineInfo =
            skippedLineInfoParts.length > 0
              ? `(${skippedLineInfoParts.join(', ')})`
              : '(no lines skipped by options)';

          if (effectiveLineCount > maxLines) {
            context.report({
              node,
              messageId: 'tooManyLines',
              data: {
                name: getFunctionName(node),
                actualLines: effectiveLineCount,
                maxLines: maxLines,
                skippedLineInfo: skippedLineInfo,
              },
            });
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

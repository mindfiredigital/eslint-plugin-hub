const path = require('path');

module.exports = {
  rules: {
    'max-lines-per-file': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Restrict the number of lines per file to promote readability and maintainability.',
          category: 'Best Practices',
          recommended: false,
        },
        schema: [
          {
            type: 'object',
            properties: {
              max: {
                type: 'integer',
                default: 500,
                description: 'Maximum number of lines allowed in a file.',
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          tooManyLines:
            'File "{{name}}" exceeds the maximum allowed number of {{max}} lines (actual: {{lines}}).',
        },
      },
      create(context) {
        const options = context.options[0] || {};
        const maxLines = options.max || 500;

        function checkFile() {
          const fileLines = context.getSourceCode().lines.length;

          if (fileLines > maxLines) {
            context.report({
              loc: {
                start: { line: 1, column: 0 },
                end: { line: fileLines, column: 0 },
              },
              messageId: 'tooManyLines',
              data: {
                name: path.basename(context.getFilename()),
                max: maxLines,
                lines: fileLines,
              },
            });
          }
        }

        return {
          Program: checkFile,
        };
      },
    },
  },
};

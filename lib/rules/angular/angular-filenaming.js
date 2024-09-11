const path = require('path');

module.exports = {
  rules: {
    'angular-filenaming': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforces user-defined naming conventions for Angular files (PascalCase, kebab-case, camelCase)',
        },
        messages: {
          invalidFileName:
            'File "{{name}}" does not follow the {{expected}} naming convention.',
        },
        schema: [
          {
            type: 'object',
            properties: {
              component: {
                enum: ['kebab-case', 'camelCase', 'PascalCase'],
                default: 'kebab-case',
              },
              service: {
                enum: ['kebab-case', 'camelCase', 'PascalCase'],
                default: 'camelCase',
              },
              module: {
                enum: ['kebab-case', 'camelCase', 'PascalCase'],
                default: 'PascalCase',
              },
            },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const options = context.options[0] || {};
        const componentConvention = options.component || 'kebab-case';
        const serviceConvention = options.service || 'camelCase';
        const moduleConvention = options.module || 'PascalCase';

        const namingPatterns = {
          'kebab-case': /^[a-z0-9]+(-[a-z0-9]+)*$/,
          PascalCase: /^[A-Z][a-zA-Z0-9]*$/,
          camelCase: /^[a-z][a-zA-Z0-9]*$/,
        };

        const componentPattern = /\.component\.ts$/;
        const servicePattern = /\.service\.ts$/;
        const modulePattern = /\.module\.ts$/;

        function checkFileName(fileName, pattern, convention) {
          const baseName = fileName.replace(pattern, '');
          return namingPatterns[convention].test(baseName);
        }

        return {
          Program(node) {
            const filePath = context.getFilename();
            const fileName = path.basename(filePath);
            let expectedConvention;

            if (componentPattern.test(fileName)) {
              expectedConvention = componentConvention;
              if (
                !checkFileName(fileName, componentPattern, componentConvention)
              ) {
                context.report({
                  node,
                  messageId: 'invalidFileName',
                  data: { name: fileName, expected: expectedConvention },
                });
              }
            } else if (servicePattern.test(fileName)) {
              expectedConvention = serviceConvention;
              if (!checkFileName(fileName, servicePattern, serviceConvention)) {
                context.report({
                  node,
                  messageId: 'invalidFileName',
                  data: { name: fileName, expected: expectedConvention },
                });
              }
            } else if (modulePattern.test(fileName)) {
              expectedConvention = moduleConvention;
              if (!checkFileName(fileName, modulePattern, moduleConvention)) {
                context.report({
                  node,
                  messageId: 'invalidFileName',
                  data: { name: fileName, expected: expectedConvention },
                });
              }
            }
          },
        };
      },
    },
  },
};

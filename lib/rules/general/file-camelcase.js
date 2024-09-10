const path = require('path');

module.exports = {
  rules: {
    'file-camelcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce camelCase naming convention for filenames',
        },
        messages: {
          invalidFileName:
            'Filename "{{name}}" should be in camelCase and follow the camelCase pattern.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const fileName = path.basename(filePath);

            // Regex for camelCase
            const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
            const allowedExtensions = /\.(js|ts|json|config\.mjs|config\.js)$/;

            const baseFileName = fileName.replace(allowedExtensions, '');

            // Validate the file name
            if (!camelCaseRegex.test(baseFileName)) {
              context.report({
                node,
                messageId: 'invalidFileName',
                data: { name: fileName },
              });
            }
          },
        };
      },
    },
  },
};

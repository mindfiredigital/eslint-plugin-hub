const path = require('path');

module.exports = {
  rules: {
    'filename-lowercase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce lowercase naming convention for filenames',
        },
        messages: {
          invalidFileName: 'Filename "{{name}}" should be in lowercase.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const fileName = path.basename(filePath);
            const allowedExtensions = /\.(js|ts|json|config\.mjs|config\.js)$/;

            const baseFileName = fileName.replace(allowedExtensions, '');

            // Regex for lowercase and allowed file name characters
            const lowerCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

            // Check if filename does not match the lowercase regex
            if (!lowerCaseRegex.test(baseFileName)) {
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

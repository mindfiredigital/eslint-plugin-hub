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

            // Check if filename is not lowercase
            if (baseFileName !== baseFileName.toLowerCase()) {
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

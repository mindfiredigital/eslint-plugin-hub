const path = require('path');

module.exports = {
  rules: {
    'file-pascalcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce PascalCase naming convention for filenames',
        },
        messages: {
          invalidFileName: 'Filename "{{name}}" should be in PascalCase.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const fileName = path.basename(filePath);

            // Regex for PascalCase
            const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
            const allowedExtensions = /\.(js|ts|json|config\.mjs|config\.js)$/;

            const baseFileName = fileName.replace(allowedExtensions, '');

            // Validate the file name
            const isFileNameInvalid = !pascalCaseRegex.test(baseFileName);

            if (isFileNameInvalid) {
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

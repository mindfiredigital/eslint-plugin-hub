const path = require('path');

module.exports = {
  rules: {
    'filename-kebabcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce lowercase and kebab-case naming for filenames',
        },
        messages: {
          invalidFileName:
            'Filename "{{name}}" should be lowercase and follow kebab-case if it has more than 10 characters.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const fileName = path.basename(filePath);

            // Regex for lowercase and kebab-case
            const lowerCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
            const allowedExtensions = /\.(js|ts|json|config\.mjs|config\.js)$/;

            const baseFileName = fileName.replace(allowedExtensions, '');

            // Validate the file name
            const isFileNameInvalid =
              (baseFileName.length > 10 &&
                !lowerCaseRegex.test(baseFileName)) ||
              (baseFileName.length <= 10 &&
                baseFileName !== baseFileName.toLowerCase());

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

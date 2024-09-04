const path = require('path');

module.exports = {
  rules: {
    'filename-kebabcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce specific naming conventions for files and folders',
        },
        messages: {
          invalidFileName:
            'Filename "{{name}}" should be lowercase and follow kebab-case if it has more than 10 characters.',
          invalidFolderName:
            'Folder "{{name}}" should be lowercase and follow kebab-case if it has more than 10 characters.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const fileName = path.basename(filePath);
            const dirName = path.basename(path.dirname(filePath));

            // Regex for lowercase and kebab-case
            const lowerCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
            const allowedExtensions = /\.(js|ts|json|config\.mjs|config\.js)$/;

            const baseFileName = fileName.replace(allowedExtensions, '');

            // Check if the file name follows the rules
            if (
              (baseFileName.length > 10 &&
                !lowerCaseRegex.test(baseFileName)) ||
              (baseFileName.length <= 10 &&
                baseFileName !== baseFileName.toLowerCase())
            ) {
              context.report({
                node,
                messageId: 'invalidFileName',
                data: { name: fileName },
              });
            }

            // Check if the folder name follows the rules
            if (
              (dirName.length > 10 && !lowerCaseRegex.test(dirName)) ||
              (dirName.length <= 10 && dirName !== dirName.toLowerCase())
            ) {
              context.report({
                node,
                messageId: 'invalidFolderName',
                data: { name: dirName },
              });
            }
          },
        };
      },
    },
  },
};

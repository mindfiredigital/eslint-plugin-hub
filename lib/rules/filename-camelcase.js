const path = require('path');

module.exports = {
  rules: {
    'filename-camelcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce camelCase naming convention for files and folders',
        },
        messages: {
          invalidFileName:
            'Filename "{{name}}" should be in camelCase and follow the camelCase pattern.',
          invalidFolderName:
            'Folder "{{name}}" should be in camelCase and follow the camelCase pattern.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const fileName = path.basename(filePath);
            const dirName = path.basename(path.dirname(filePath));

            // Regex for camelCase
            const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
            const allowedExtensions = /\.(js|ts|json|config\.mjs|config\.js)$/;

            const baseFileName = fileName.replace(allowedExtensions, '');

            // Validate the file name
            const isFileNameInvalid = !camelCaseRegex.test(baseFileName);

            if (isFileNameInvalid) {
              context.report({
                node,
                messageId: 'invalidFileName',
                data: { name: fileName },
              });
            }

            // Validate the directory name
            const isDirNameInvalid = !camelCaseRegex.test(dirName);

            if (isDirNameInvalid) {
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

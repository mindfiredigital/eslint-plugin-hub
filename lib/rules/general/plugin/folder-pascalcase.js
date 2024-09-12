const path = require('path');

module.exports = {
  rules: {
    'folder-pascalcase': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce PascalCase naming convention for folder names',
        },
        messages: {
          invalidFolderName: 'Folder "{{name}}" should be in PascalCase.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const dirName = path.basename(path.dirname(filePath));

            // Regex for PascalCase
            const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;

            // Validate the directory name
            const isDirNameInvalid = !pascalCaseRegex.test(dirName);

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

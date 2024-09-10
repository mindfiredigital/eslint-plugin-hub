const path = require('path');

module.exports = {
  rules: {
    'folder-camelcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce camelCase naming convention for folder names',
        },
        messages: {
          invalidFolderName:
            'Folder "{{name}}" should be in camelCase and follow the camelCase pattern.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const dirName = path.basename(path.dirname(filePath));

            // Regex for camelCase
            const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;

            // Validate the directory name
            if (!camelCaseRegex.test(dirName)) {
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

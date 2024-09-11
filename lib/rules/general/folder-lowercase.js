const path = require('path');

module.exports = {
  rules: {
    'folder-lowercase': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce lowercase naming convention for folder names',
        },
        messages: {
          invalidFolderName: 'Folder "{{name}}" should be in lowercase.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const dirName = path.basename(path.dirname(filePath));

            // Regex for lowercase only
            const lowerCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

            // Check if folder name is not lowercase
            if (!lowerCaseRegex.test(dirName)) {
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

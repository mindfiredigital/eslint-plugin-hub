const path = require('path');

module.exports = {
  rules: {
    'folder-kebabcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Enforce lowercase and kebab-case naming for folders',
        },
        messages: {
          invalidFolderName:
            'Folder "{{name}}" should be lowercase and follow kebab-case if it has more than 10 characters.',
        },
      },
      create(context) {
        return {
          Program(node) {
            const filePath = context.getFilename();
            const dirName = path.basename(path.dirname(filePath));

            // Regex for lowercase and kebab-case
            const lowerCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

            // Validate the directory name
            const isDirNameInvalid =
              (dirName.length > 10 && !lowerCaseRegex.test(dirName)) ||
              (dirName.length <= 10 && dirName !== dirName.toLowerCase());

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

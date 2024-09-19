const path = require('path');

//function to check if a filename is in PascalCase
function isPascalCase(filename) {
  return /^[A-Z][a-zA-Z0-9]*$/.test(filename);
}

module.exports = {
  rules: {
    'react-filename-pascalcase': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforces PascalCase for filenames in React files (jsx, tsx).',
        },
        schema: [],
      },
      create: function (context) {
        // Get the filename and extension of the file being linted
        const filenameWithExt = path.basename(context.getFilename());
        const extname = path.extname(filenameWithExt);
        const filename = path.basename(filenameWithExt, extname);

        // List of extensions the rule should apply to
        const validExtensions = ['.jsx', '.tsx'];

        // Only check files with the specified extensions
        if (validExtensions.includes(extname) && !isPascalCase(filename)) {
          context.report({
            message: `Filename '{{name}}' should be in PascalCase.`,
            data: {
              name: filenameWithExt,
            },
            loc: { line: 1, column: 1 },
          });
        }

        return {};
      },
    },
  },
};

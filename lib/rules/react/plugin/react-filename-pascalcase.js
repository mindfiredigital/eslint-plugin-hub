const path = require('path');

// Function to check if a filename is in PascalCase
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
            'Enforces PascalCase for filenames in React files (.js, .ts, .jsx, .tsx).',
        },
        schema: [],
      },
      create: function (context) {
        // Get the filename and extension of the file being linted
        const filenameWithExt = path.basename(context.getFilename());
        const extname = path.extname(filenameWithExt);
        const filename = path.basename(filenameWithExt, extname);

        // List of extensions the rule should apply to
        const validExtensions = ['.js', '.ts', '.jsx', '.tsx'];

        // Ignore files named 'index'
        if (filename === 'index' || !validExtensions.includes(extname)) {
          return {};
        }
        // Function to check if the file contains React code
        function isReactFile(node) {
          // Check for React imports or JSX
          return (
            (node.type === 'ImportDeclaration' &&
              node.source.value === 'react') ||
            node.type === 'JSXOpeningElement'
          );
        }

        // Only check files with the specified extensions
        if (validExtensions.includes(extname)) {
          let isReactFileDetected = false;

          return {
            // Listen for imports and JSX to detect if it's a React file
            ImportDeclaration(node) {
              if (isReactFile(node)) {
                isReactFileDetected = true;
              }
            },
            JSXOpeningElement(node) {
              isReactFileDetected = true;
            },
            'Program:exit'() {
              if (isReactFileDetected && !isPascalCase(filename)) {
                context.report({
                  message: `Filename '{{name}}' should be in PascalCase.`,
                  data: {
                    name: filenameWithExt,
                  },
                  loc: { line: 1, column: 1 },
                });
              }
            },
          };
        }

        return {};
      },
    },
  },
};

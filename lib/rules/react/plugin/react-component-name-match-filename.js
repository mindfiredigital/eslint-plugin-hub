const path = require('path');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const types = require('@babel/types');

module.exports = {
  rules: {
    'react-component-name-match-filename': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Enforces that the React component name matches the filename.',
        },
        schema: [],
      },
      create(context) {
        const filenameWithExt = path.basename(context.getFilename());
        const extname = path.extname(filenameWithExt);
        const filename = path.basename(filenameWithExt, extname);

        // List of extensions the rule should apply to
        const validExtensions = ['.js', '.ts', '.jsx', '.tsx'];

        // Ignore files named 'index'
        if (filename === 'index' || !validExtensions.includes(extname)) {
          return {};
        }

        let componentName = null;
        let isReactFileDetected = false;

        return {
          Program() {
            const code = context.getSourceCode().text;
            const ast = parse(code, {
              sourceType: 'module',
              plugins: ['jsx', 'typescript'],
            });

            // Check if the file contains React code
            traverse(ast, {
              ImportDeclaration(path) {
                if (path.node.source.value === 'react') {
                  isReactFileDetected = true;
                }
              },
              JSXOpeningElement() {
                isReactFileDetected = true;
              },
              ExportDefaultDeclaration(path) {
                const declaration = path.node.declaration;
                if (types.isIdentifier(declaration)) {
                  componentName = declaration.name;
                } else if (
                  types.isClassDeclaration(declaration) ||
                  types.isFunctionDeclaration(declaration)
                ) {
                  componentName = declaration.id ? declaration.id.name : null;
                }
              },
              VariableDeclarator(path) {
                if (path.node.id && types.isIdentifier(path.node.id)) {
                  const init = path.node.init;
                  if (
                    types.isArrowFunctionExpression(init) ||
                    types.isFunctionExpression(init)
                  ) {
                    componentName = path.node.id.name;
                  }
                }
              },
              FunctionDeclaration(path) {
                if (path.node.id && types.isIdentifier(path.node.id)) {
                  componentName = path.node.id.name;
                }
              },
            });

            // Only report if this is a React file and the component name does not match the filename
            if (
              isReactFileDetected &&
              componentName &&
              componentName !== filename
            ) {
              context.report({
                node: ast.program,
                message: `Component name '{{name}}' should match the filename '{{filename}}'.`,
                data: {
                  name: componentName,
                  filename: filenameWithExt,
                },
              });
            }
          },
        };
      },
    },
  },
};

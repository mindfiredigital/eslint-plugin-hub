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
        schema: [], // no options
      },
      create(context) {
        const filenameWithExt = path.basename(context.getFilename());
        const extname = path.extname(filenameWithExt);
        const filename = path.basename(filenameWithExt, extname);

        // List of extensions the rule should apply to
        const validExtensions = ['.jsx', '.tsx'];

        if (!validExtensions.includes(extname)) {
          return {};
        }

        let componentName = null;

        return {
          Program() {
            const code = context.getSourceCode().text;
            const ast = parse(code, {
              sourceType: 'module',
              plugins: ['jsx', 'typescript'], // add other plugins if needed
            });

            traverse(ast, {
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

            if (componentName && componentName !== filename) {
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

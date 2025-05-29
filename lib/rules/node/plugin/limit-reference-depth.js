/**
 * Converts a nested MemberExpression AST node into a human-readable dot/bracket path string.
 * Handles optional chaining, computed properties, and special cases like `this`, `super`, or call expressions.
 *
 * Example: Converts `foo.bar?.baz[qux]` into the string `foo.bar?.baz[qux]`.
 *
 * @param {ASTNode} node - The MemberExpression node to convert.
 * @param {SourceCode} sourceCode - The ESLint SourceCode object to extract text.
 * @returns {string} The constructed path string from the member expression.
 */

function getPropertyPathString(node, sourceCode) {
  if (!node) return '';
  const segments = [];

  let current = node;

  while (current && current.type === 'MemberExpression') {
    let prop;

    // If property is computed, e.g., obj[expr]
    if (current.computed) {
      prop = `${current.optional ? '?.' : ''}[${sourceCode.getText(current.property)}]`;
    } else {
      prop = `${current.optional ? '?.' : '.'}${current.property.name}`;
    }

    segments.unshift(prop);

    current = current.object;
    // Handle intermediate CallExpression like `obj().a`
    if (current && current.type === 'CallExpression') {
      const calleeText = sourceCode.getText(current.callee) + '()';
      segments.unshift(calleeText);
      break;
    }

    // Handle `this.a.b`
    if (current && current.type === 'ThisExpression') {
      segments.unshift('this');
      break;
    }

    // Handle base like `dotenv`, `myVar`, etc.
    if (current && current.type === 'Identifier') {
      segments.unshift(current.name);
      break;
    }
  }

  return segments.join('');
}

module.exports = {
  rules: {
    'limit-reference-depth': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Limits the depth of chained property access and requires optional chaining.',
          category: 'Best Practices',
          recommended: false,
        },
        schema: [
          {
            type: 'object',
            properties: {
              maxDepth: { type: 'integer', minimum: 1, default: 3 },
              requireOptionalChaining: { type: 'boolean', default: true },
              allowSinglePropertyAccess: { type: 'boolean', default: false },
              ignoredBases: {
                type: 'array',
                items: { type: 'string' },
                default: [],
              },
              ignoreCallExpressions: { type: 'boolean', default: true },
              ignoreImportedModules: { type: 'boolean', default: true },
              ignoreGlobals: { type: 'boolean', default: true },
              ignoreCommonPatterns: { type: 'boolean', default: true },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          tooDeep:
            "Property access chain '{{path}}' (depth {{chainDepth}}) exceeds the maximum allowed depth of {{maxDepthOption}}.",
          missingOptionalChaining:
            "Optional chaining (?.) should be used for accessing property '{{property}}' in '{{path}}'.",
        },
      },

      create: function (context) {
        const sourceCode = context.getSourceCode();
        const options = context.options[0] || {};

        // Load options or set defaults
        const maxDepthOption = options.maxDepth ?? 3;
        const requireOptionalChainingOpt =
          options.requireOptionalChaining ?? true;
        const allowSinglePropertyAccess =
          options.allowSinglePropertyAccess ?? false;
        const ignoreCallExpressions = options.ignoreCallExpressions ?? true;
        const ignoreImportedModules = options.ignoreImportedModules ?? true;
        const ignoreGlobals = options.ignoreGlobals ?? true;
        const ignoreCommonPatterns = options.ignoreCommonPatterns ?? true;

        // Track imported/required modules
        const importedModules = new Set();
        const requiredModules = new Set();

        // Track declared variables in current scope
        const declaredVariables = new Set();

        // Built-in global objects (minimal essential list)
        const globalObjects = new Set([
          'Math',
          'JSON',
          'Date',
          'Promise',
          'Object',
          'Array',
          'String',
          'Number',
          'Boolean',
          'console',
          'process',
          'window',
          'document',
          'global',
          'globalThis',
          'localStorage',
          'sessionStorage',
        ]);

        // User-defined ignored bases
        const userIgnoredBases = new Set(options.ignoredBases || []);

        // Common patterns that usually don't need optional chaining
        const commonSafePatterns = new Set([
          'this',
          'super',
          'module',
          'exports',
          '__dirname',
          '__filename',
        ]);

        // Utility to get base identifier from a chain
        function getBaseIdentifier(node) {
          let current = node;
          while (current && current.type === 'MemberExpression') {
            current = current.object;
          }
          if (current && current.type === 'CallExpression') {
            current = current.callee;
            while (current && current.type === 'MemberExpression') {
              current = current.object;
            }
          }
          return current && current.type === 'Identifier' ? current.name : null;
        }

        function shouldExemptChain(node) {
          const baseName = getBaseIdentifier(node);
          if (!baseName) return false;

          // User-defined exemptions
          if (userIgnoredBases.has(baseName)) return true;

          // Global objects
          if (ignoreGlobals && globalObjects.has(baseName)) return true;

          // Imported/required modules
          if (
            ignoreImportedModules &&
            (importedModules.has(baseName) || requiredModules.has(baseName))
          )
            return true;

          // Declared variables (function params, local vars, etc.)
          if (ignoreImportedModules && declaredVariables.has(baseName))
            return false;

          // Common safe patterns
          if (ignoreCommonPatterns && commonSafePatterns.has(baseName))
            return true;

          return false;
        }

        // Check if node is a CallExpression or ends with one
        function isOrEndsWithCallExpression(node) {
          if (node.type === 'CallExpression') return true;
          return (
            node.parent &&
            node.parent.type === 'CallExpression' &&
            node.parent.callee === node
          );
        }

        return {
          // Track imports and requires
          ImportDeclaration(node) {
            node.specifiers.forEach(spec => {
              if (
                spec.type === 'ImportDefaultSpecifier' ||
                spec.type === 'ImportNamespaceSpecifier'
              ) {
                importedModules.add(spec.local.name);
              } else if (spec.type === 'ImportSpecifier') {
                importedModules.add(spec.local.name);
              }
            });
          },

          VariableDeclarator(node) {
            // Track require() calls
            if (
              node.init &&
              node.init.type === 'CallExpression' &&
              node.init.callee.name === 'require' &&
              node.id.type === 'Identifier'
            ) {
              requiredModules.add(node.id.name);
            }

            // Track other variable declarations
            if (node.id.type === 'Identifier') {
              declaredVariables.add(node.id.name);
            }
          },

          FunctionDeclaration(node) {
            // Track function names
            if (node.id) {
              declaredVariables.add(node.id.name);
            }
            // Track parameters
            node.params.forEach(param => {
              if (param.type === 'Identifier') {
                declaredVariables.add(param.name);
              }
            });
          },

          ArrowFunctionExpression(node) {
            // Track arrow function parameters
            node.params.forEach(param => {
              if (param.type === 'Identifier') {
                declaredVariables.add(param.name);
              }
            });
          },

          FunctionExpression(node) {
            // Track function expression parameters
            node.params.forEach(param => {
              if (param.type === 'Identifier') {
                declaredVariables.add(param.name);
              }
            });
          },

          MemberExpression(node) {
            // Skip if this node is part of a larger chain (i.e., not the outermost one)
            if (
              node.parent.type === 'MemberExpression' &&
              node.parent.object === node
            ) {
              return;
            }

            // Skip if this is being called as a function and ignoreCallExpressions is true
            if (ignoreCallExpressions && isOrEndsWithCallExpression(node)) {
              return;
            }

            let chainDepth = 0;
            let current = node;
            const chainLinksReversed = [];

            // Traverse the chain backwards to compute depth
            while (current.type === 'MemberExpression') {
              chainDepth++;
              chainLinksReversed.push(current);
              if (current.object.type !== 'MemberExpression') {
                break;
              }
              current = current.object;
            }

            if (shouldExemptChain(current.object)) {
              return;
            }

            const fullPathString = getPropertyPathString(node, sourceCode);

            // 1. Check for depth violation
            if (chainDepth > maxDepthOption) {
              context.report({
                node: node,
                messageId: 'tooDeep',
                data: {
                  path: fullPathString,
                  chainDepth: chainDepth,
                  maxDepthOption: maxDepthOption,
                },
              });
              return;
            }

            // 2. Check for missing optional chaining
            if (requireOptionalChainingOpt && chainDepth > 0) {
              const links = chainLinksReversed.reverse();

              for (let i = 0; i < links.length; i++) {
                const linkNode = links[i];
                const objectOfThisLink = linkNode.object;

                if (!linkNode.optional) {
                  let shouldExemptThisLink = false;

                  if (allowSinglePropertyAccess) {
                    if (i === 0 && objectOfThisLink.type === 'Identifier') {
                      if (!shouldExemptChain(objectOfThisLink)) {
                        shouldExemptThisLink = true;
                      }
                    }
                  }

                  if (shouldExemptThisLink) {
                    continue;
                  }

                  // Report missing optional chaining
                  const problematicProperty = linkNode.computed
                    ? sourceCode.getText(linkNode.property)
                    : linkNode.property.name;

                  context.report({
                    node: linkNode,
                    messageId: 'missingOptionalChaining',
                    data: {
                      property: problematicProperty,
                      path: getPropertyPathString(linkNode, sourceCode),
                    },
                  });

                  break;
                }
              }
            }
          },
        };
      },
    },
  },
};

module.exports = {
  rules: {
    'limit-data-scope': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforces several best practices for data scoping: disallows global object modification, suggests moving variables to their narrowest functional scope, and discourages `var` usage.',
          category: 'Best Practices',
          recommended: false,
        },
        schema: [],
        messages: {
          noModifyGlobal:
            'Avoid modifying the global object "{{objectName}}". "{{propertyName}}" should not be added globally.',
          moveToNarrowerScope:
            "Variable '{{variableName}}' is declared in {{declarationScopeType}} scope but appears to be used only within the '{{usageScopeIdentifier}}' {{usageScopeType}} scope. Consider moving its declaration into the '{{usageScopeIdentifier}}' scope.",
          useLetConst:
            "Prefer 'let' or 'const' over 'var' for variable '{{variableName}}'.",
        },
      },
      create(context) {
        const sourceCode = context.getSourceCode();
        const functionInfoForNarrowestScope = new Map();
        const globalObjects = new Set(['global', 'globalThis', 'window']);

        function getFunctionName(node) {
          if (node.id && node.id.name) {
            return node.id.name;
          }

          if (node.parent) {
            if (
              node.parent.type === 'VariableDeclarator' &&
              node.parent.id &&
              node.parent.id.name
            ) {
              return node.parent.id.name;
            }

            if (node.parent.type === 'Property' && node.parent.key) {
              return (
                node.parent.key.name ||
                node.parent.key.value ||
                '[anonymous_function]'
              );
            }

            if (
              node.parent.type === 'AssignmentExpression' &&
              node.parent.left &&
              node.parent.left.name
            ) {
              return node.parent.left.name;
            }
          }

          return '[anonymous_function]';
        }

        function getAllScopes(programScope) {
          const scopes = [];

          function collectScopes(scope) {
            scopes.push(scope);
            scope.childScopes.forEach(collectScopes);
          }

          collectScopes(programScope);
          return scopes;
        }

        function findContainingFunctionScope(startScope, targetScope) {
          let currentScope = startScope;

          while (currentScope && currentScope !== targetScope) {
            if (currentScope.type === 'function') {
              return currentScope;
            }
            currentScope = currentScope.upper;
          }

          return null;
        }

        return {
          ':function': function (node) {
            const name = getFunctionName(node);
            functionInfoForNarrowestScope.set(node, name);
          },

          AssignmentExpression(node) {
            const { left } = node;
            if (left.type !== 'MemberExpression') return;

            // Check if this is a direct assignment to a global object or nested assignment
            function findGlobalObjectInChain(memberExpr) {
              let current = memberExpr;

              while (current.type === 'MemberExpression') {
                if (
                  current.object.type === 'Identifier' &&
                  globalObjects.has(current.object.name)
                ) {
                  return {
                    objectNode: current.object,
                    rootMemberExpr: current,
                    topLevelProperty: current.property,
                  };
                }
                current = current.object;
              }

              return null;
            }

            const globalInfo = findGlobalObjectInChain(left);
            if (!globalInfo) return;

            const { objectNode, topLevelProperty } = globalInfo;
            const scope = sourceCode.getScope(objectNode);
            const reference = scope.references.find(
              ref => ref.identifier === objectNode
            );

            let isShadowed = false;
            if (
              reference &&
              reference.resolved &&
              reference.resolved.defs.length > 0
            ) {
              isShadowed = true;
            }

            if (!isShadowed) {
              let propertyName = '';
              if (globalInfo.rootMemberExpr.computed) {
                if (topLevelProperty.type === 'Literal') {
                  propertyName = String(topLevelProperty.value);
                } else if (topLevelProperty.type === 'Identifier') {
                  propertyName = topLevelProperty.name;
                } else {
                  propertyName = '[complex]';
                }
              } else if (topLevelProperty.type === 'Identifier') {
                propertyName = topLevelProperty.name;
              }

              context.report({
                node: left,
                messageId: 'noModifyGlobal',
                data: { objectName: objectNode.name, propertyName },
              });
            }
          },

          VariableDeclaration(node) {
            if (node.kind === 'var') {
              let firstVariableName = '[unnamed_variable]';
              if (
                node.declarations.length > 0 &&
                node.declarations[0].id &&
                node.declarations[0].id.name
              ) {
                firstVariableName = node.declarations[0].id.name;
              }

              context.report({
                node: node,
                messageId: 'useLetConst',
                data: { variableName: firstVariableName },
              });
            }
          },

          'Program:exit': function (programNode) {
            const programScope = sourceCode.getScope(programNode);
            const allScopes = getAllScopes(programScope);

            // Look for variables in module/global scopes
            const targetScopes = allScopes.filter(
              scope => scope.type === 'module' || scope.type === 'global'
            );

            targetScopes.forEach(scope => {
              scope.variables.forEach(variable => {
                // Skip if no definitions or references
                if (
                  variable.defs.length === 0 ||
                  variable.references.length === 0
                ) {
                  return;
                }

                // Skip built-in variables and imports
                if (
                  variable.defs.some(
                    def =>
                      def.type === 'ImportBinding' ||
                      def.type === 'ImplicitGlobalVariable' ||
                      (def.node && def.node.type === 'Program')
                  )
                ) {
                  return;
                }

                const declarationScope = variable.scope;
                const uniqueFunctionScopes = new Set();
                let allReferencesInsideFunctions = true;
                let hasNonWriteReferences = false;

                // Analyze all references to this variable
                for (const reference of variable.references) {
                  // Skip the initial declaration
                  if (reference.init) {
                    continue;
                  }

                  hasNonWriteReferences = true;
                  const referenceScope = sourceCode.getScope(
                    reference.identifier
                  );
                  const containingFunctionScope = findContainingFunctionScope(
                    referenceScope,
                    declarationScope
                  );

                  if (containingFunctionScope) {
                    uniqueFunctionScopes.add(containingFunctionScope);
                  } else {
                    // Reference is not inside a function (used at module/global level)
                    allReferencesInsideFunctions = false;
                    break;
                  }
                }

                // Only suggest moving if:
                // 1. All references are inside functions
                // 2. All references are inside the same single function
                // 3. There are actual non-write references
                // 4. The containing function is a direct child of the declaration scope
                if (
                  allReferencesInsideFunctions &&
                  uniqueFunctionScopes.size === 1 &&
                  hasNonWriteReferences
                ) {
                  const singleFunctionScope =
                    Array.from(uniqueFunctionScopes)[0];

                  // Check if the function scope is a direct child of the declaration scope
                  if (singleFunctionScope.upper === declarationScope) {
                    const variableNameNode = variable.defs[0].name;
                    const functionNode = singleFunctionScope.block;
                    const usageScopeIdentifier =
                      functionInfoForNarrowestScope.get(functionNode) ||
                      '[anonymous_function]';

                    context.report({
                      node: variableNameNode,
                      messageId: 'moveToNarrowerScope',
                      data: {
                        variableName: variable.name,
                        declarationScopeType: declarationScope.type,
                        usageScopeType: singleFunctionScope.type,
                        usageScopeIdentifier: usageScopeIdentifier,
                      },
                    });
                  }
                }
              });
            });
          },
        };
      },
    },
  },
};

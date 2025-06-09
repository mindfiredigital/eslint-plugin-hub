/**
 * Checks if an identifier is reassigned or updated within a given AST node (loop body).
 * @param {string} identifierName - The name of the identifier to check.
 * @param {ASTNode} loopBodyNode - The AST node representing the loop's body.
 * @returns {boolean} - True if the identifier is modified, false otherwise.
 */
function isIdentifierModifiedInBody(identifierName, loopBodyNode) {
  let isModified = false;

  function traverse(node) {
    if (isModified) return; // Optimization

    if (node.type === 'AssignmentExpression') {
      if (
        node.left.type === 'Identifier' &&
        node.left.name === identifierName
      ) {
        isModified = true;
        return;
      }
      // Could also check MemberExpression for obj.prop = value if flag is a property
    } else if (node.type === 'UpdateExpression') {
      if (
        node.argument.type === 'Identifier' &&
        node.argument.name === identifierName
      ) {
        isModified = true;
        return;
      }
    }

    // Do not traverse into nested functions, as their modifications are in a different scope
    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      return;
    }

    for (const key in node) {
      if (node.hasOwnProperty(key) && key !== 'parent') {
        const child = node[key];
        if (typeof child === 'object' && child !== null) {
          if (Array.isArray(child)) {
            child.forEach(traverse);
          } else {
            traverse(child);
          }
        }
      }
    }
  }

  if (loopBodyNode) {
    traverse(loopBodyNode);
  }
  return isModified;
}

/**
 * Checks if a loop has an effective break statement targeting it.
 * @param {ASTNode} loopNode - The AST node representing the loop.
 * @returns {boolean} - True if an effective break is found, false otherwise.
 */
function hasEffectiveBreak(loopNode) {
  let foundBreak = false;

  function traverse(node) {
    if (foundBreak) return;

    if (
      node.type === 'FunctionDeclaration' ||
      node.type === 'FunctionExpression' ||
      node.type === 'ArrowFunctionExpression'
    ) {
      return; // Breaks in nested functions do not affect the outer loop
    }

    if (node.type === 'BreakStatement') {
      if (node.label) {
        // If break has a label, check if it matches a label of the loopNode or its ancestors
        let parent = loopNode.parent;
        while (parent) {
          if (
            parent.type === 'LabeledStatement' &&
            parent.label.name === node.label.name
          ) {
            if (parent.body === loopNode) {
              foundBreak = true;
            }
            return; // Found the label target
          }
          parent = parent.parent;
        }
      } else {
        // No label, break targets the innermost enclosing loop or switch
        let current = node.parent;
        while (current) {
          if (current === loopNode) {
            foundBreak = true; // This break targets our loopNode
            break;
          }
          // If we hit an *inner* loop or switch before loopNode, this break is for that
          if (
            current.type === 'ForStatement' ||
            current.type === 'ForInStatement' ||
            current.type === 'ForOfStatement' ||
            current.type === 'WhileStatement' ||
            current.type === 'DoWhileStatement' ||
            current.type === 'SwitchStatement'
          ) {
            break; // Break belongs to an inner construct
          }
          current = current.parent;
        }
      }
      return;
    }

    for (const key in node) {
      if (node.hasOwnProperty(key) && key !== 'parent') {
        const child = node[key];
        if (typeof child === 'object' && child !== null) {
          if (Array.isArray(child)) {
            child.forEach(traverse);
          } else {
            traverse(child);
          }
        }
      }
    }
  }
  if (loopNode.body) {
    traverse(loopNode.body);
  }
  return foundBreak;
}

module.exports.rules = {
  'fixed-loop-bounds': {
    meta: {
      type: 'problem',
      docs: {
        description:
          'Enforce that loops have clearly defined termination conditions to prevent infinite loops.',
        category: 'Best Practices',
        recommended: false, // Or true, depending on project preference
      },
      fixable: null,
      schema: [
        {
          type: 'object',
          properties: {
            disallowInfiniteWhile: {
              type: 'boolean',
              default: true,
            },
            disallowExternalFlagLoops: {
              type: 'boolean',
              default: true,
            },
          },
          additionalProperties: false,
        },
      ],
      messages: {
        infiniteWhileTrueLoop:
          'Potentially infinite `while(true)` loop detected without an effective `break` or `return` statement.',
        infiniteDoWhileTrueLoop:
          'Potentially infinite `do...while(true)` loop detected without an effective `break` or `return` statement.',
        infiniteForLoopNoTest:
          'Potentially infinite `for` loop (no test condition) detected without an effective `break` or `return` statement.',
        infiniteForLoopTrueTest:
          'Potentially infinite `for` loop (test condition is `true`) detected without an effective `break` or `return` statement.',
        externalFlagWhileLoop:
          'Loop condition flag `{{flagName}}` in `while` statement does not appear to be modified within the loop body.',
        externalFlagDoWhileLoop:
          'Loop condition flag `{{flagName}}` in `do...while` statement does not appear to be modified within the loop body.',
      },
    },
    create: function (context) {
      const options = context.options[0] || {};
      const disallowInfiniteWhile = options.disallowInfiniteWhile !== false;
      const disallowExternalFlagLoops =
        options.disallowExternalFlagLoops !== false;

      function checkLoopConditionFlag(node, testNode, messageIdPrefix) {
        let flagIdentifierNode = null;
        if (testNode.type === 'Identifier') {
          flagIdentifierNode = testNode;
        } else if (
          testNode.type === 'UnaryExpression' &&
          testNode.operator === '!' &&
          testNode.argument.type === 'Identifier'
        ) {
          flagIdentifierNode = testNode.argument;
        }

        if (flagIdentifierNode) {
          if (!isIdentifierModifiedInBody(flagIdentifierNode.name, node.body)) {
            context.report({
              node: testNode,
              messageId: `externalFlag${messageIdPrefix.charAt(0).toUpperCase() + messageIdPrefix.slice(1)}Loop`,
              data: { flagName: flagIdentifierNode.name },
            });
          }
        }
      }

      return {
        WhileStatement(node) {
          if (node.test) {
            if (
              disallowInfiniteWhile &&
              node.test.type === 'Literal' &&
              node.test.value === true
            ) {
              if (!hasEffectiveBreak(node)) {
                context.report({
                  node: node.test,
                  messageId: 'infiniteWhileTrueLoop',
                });
              }
            } else if (disallowExternalFlagLoops) {
              checkLoopConditionFlag(node, node.test, 'while');
            }
          }
        },
        DoWhileStatement(node) {
          if (node.test) {
            if (
              disallowInfiniteWhile &&
              node.test.type === 'Literal' &&
              node.test.value === true
            ) {
              // do-while always executes at least once, break can be inside
              if (!hasEffectiveBreak(node)) {
                context.report({
                  node: node.test,
                  messageId: 'infiniteDoWhileTrueLoop',
                });
              }
            } else if (disallowExternalFlagLoops) {
              checkLoopConditionFlag(node, node.test, 'doWhile');
            }
          }
        },
        ForStatement(node) {
          if (disallowInfiniteWhile) {
            if (!node.test) {
              // e.g., for (;;)
              if (!hasEffectiveBreak(node)) {
                context.report({ node, messageId: 'infiniteForLoopNoTest' });
              }
            } else if (
              node.test.type === 'Literal' &&
              node.test.value === true
            ) {
              if (!hasEffectiveBreak(node)) {
                context.report({
                  node: node.test,
                  messageId: 'infiniteForLoopTrueTest',
                });
              }
            }
          }
        },
      };
    },
  },
};

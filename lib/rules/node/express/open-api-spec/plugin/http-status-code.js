const knownExpressMethods = new Set([
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head',
  'all',
  'use',
]);
const responseSendMethods = new Set([
  'send',
  'json',
  'end',
  'sendStatus',
  'redirect',
]);
const defaultStatusCodeByMethod = {
  GET: [200],
  POST: [201],
  PUT: [200, 204],
  PATCH: [200, 204],
  DELETE: [200, 204],
  OPTIONS: [200, 204],
  HEAD: [200, 204],
};

module.exports = {
  rules: {
    'http-status-code': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Ensure that Express.js route handlers use appropriate HTTP status codes based on the HTTP method.',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [
          {
            type: 'object',
            properties: {
              responseObjectName: {
                type: 'string',
                description:
                  'The name of the response object in route handlers.',
                default: 'res',
              },
              validStatusCodesByMethod: {
                type: 'object',
                description:
                  'Custom mapping of HTTP methods to arrays of allowed status codes.',
                patternProperties: {
                  '^(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD|ALL|USE)$': {
                    type: 'array',
                    items: { type: 'integer' },
                    minItems: 1,
                  },
                },
                additionalProperties: false,
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          invalidStatusCode:
            'Expected {{responseObjectName}}.status({{expectedCodes}}) for {{httpMethod}} request, but found {{responseObjectName}}.status({{actualCode}}).',
          invalidSendStatusCode:
            'Expected {{responseObjectName}}.sendStatus({{expectedCodes}}) for {{httpMethod}} request, but found {{responseObjectName}}.sendStatus({{actualCode}}).',
        },
      },
      create: function (context) {
        const options = context.options[0] || {};
        const configuredResponseObjectName =
          options.responseObjectName || 'res';
        const validStatusCodesByMethod = {
          ...defaultStatusCodeByMethod,
          ...(options.validStatusCodesByMethod || {}),
        };

        const routeContextStack = [];

        function getStatusCodeFromCall(callExpressionNode) {
          if (
            callExpressionNode.arguments.length > 0 &&
            callExpressionNode.arguments[0].type === 'Literal' &&
            typeof callExpressionNode.arguments[0].value === 'number'
          ) {
            return callExpressionNode.arguments[0].value;
          }
          return null;
        }

        function getRouteContext() {
          return routeContextStack.length > 0
            ? routeContextStack[routeContextStack.length - 1]
            : null;
        }

        return {
          CallExpression(node) {
            // Part 1: Identify route definitions and push context to stack
            if (node.callee.type === 'MemberExpression') {
              const methodName = node.callee.property.name;

              if (knownExpressMethods.has(methodName)) {
                const handlerArg = node.arguments.find(
                  arg =>
                    arg &&
                    (arg.type === 'FunctionExpression' ||
                      arg.type === 'ArrowFunctionExpression')
                );

                if (handlerArg) {
                  let responseObjectNameInHandler =
                    configuredResponseObjectName;
                  if (
                    handlerArg.params &&
                    handlerArg.params.length > 1 &&
                    handlerArg.params[1].type === 'Identifier'
                  ) {
                    responseObjectNameInHandler = handlerArg.params[1].name;
                  } else if (
                    handlerArg.params &&
                    handlerArg.params.length > 0 &&
                    handlerArg.params[0].type === 'Identifier' &&
                    handlerArg.params[0].name === configuredResponseObjectName
                  ) {
                    responseObjectNameInHandler = handlerArg.params[0].name;
                  }

                  routeContextStack.push({
                    httpMethod: methodName.toUpperCase(),
                    responseObjectName: responseObjectNameInHandler,
                    handlerNode: handlerArg,
                  });
                }
              }
            }

            // Part 2: Check for status calls if we are inside a known route handler
            const currentRouteContext = getRouteContext();
            if (
              currentRouteContext &&
              node.callee.type === 'MemberExpression'
            ) {
              let inHandlerScope = false;
              let tempNode = node;
              while (tempNode) {
                if (tempNode === currentRouteContext.handlerNode) {
                  inHandlerScope = true;
                  break;
                }
                tempNode = tempNode.parent;
              }

              if (inHandlerScope) {
                let actualCode = null;
                let reportNode = node; // The CallExpression node being visited (e.g., .send(), .json(), .sendStatus())
                let statusSettingNode = null; // The node that *sets* the status, e.g. .status(XXX) or .sendStatus(XXX)
                let messageId = 'invalidStatusCode';

                // Case 1: res.sendStatus(code)
                if (
                  node.callee.object.type === 'Identifier' &&
                  node.callee.object.name ===
                    currentRouteContext.responseObjectName &&
                  node.callee.property.name === 'sendStatus'
                ) {
                  statusSettingNode = node; // The sendStatus call itself
                  messageId = 'invalidSendStatusCode';
                }
                // Case 2: Patterns ending in .send(), .json(), .end() that might be preceded by .status()
                else if (
                  responseSendMethods.has(node.callee.property.name) &&
                  node.callee.property.name !== 'sendStatus' && // Handled above
                  node.callee.property.name !== 'redirect'
                ) {
                  // Redirects might have different status logic

                  let objectOfSend = node.callee.object;

                  // Check if objectOfSend is itself a CallExpression like someFormOf.status(code)
                  if (
                    objectOfSend.type === 'CallExpression' &&
                    objectOfSend.callee.type === 'MemberExpression' &&
                    objectOfSend.callee.property.name === 'status'
                  ) {
                    // objectOfSend is the LAST .status(code) in the chain before .send()
                    // Now, we need to verify its base is the response object
                    let baseObject = objectOfSend.callee.object;
                    while (
                      baseObject.type === 'CallExpression' &&
                      baseObject.callee.type === 'MemberExpression' &&
                      baseObject.callee.property.name === 'status'
                    ) {
                      baseObject = baseObject.callee.object;
                    }

                    if (
                      baseObject.type === 'Identifier' &&
                      baseObject.name === currentRouteContext.responseObjectName
                    ) {
                      statusSettingNode = objectOfSend;
                    } else {
                    }
                  } else {
                  }
                }

                if (statusSettingNode) {
                  actualCode = getStatusCodeFromCall(statusSettingNode);
                  reportNode =
                    statusSettingNode.arguments.length > 0 &&
                    statusSettingNode.arguments[0].type === 'Literal'
                      ? statusSettingNode.arguments[0]
                      : statusSettingNode;
                }

                if (
                  actualCode !== null &&
                  validStatusCodesByMethod[currentRouteContext.httpMethod]
                ) {
                  const expectedCodes =
                    validStatusCodesByMethod[currentRouteContext.httpMethod];
                  const isErrorCode = actualCode >= 400 && actualCode <= 599;

                  if (!isErrorCode && !expectedCodes.includes(actualCode)) {
                    context.report({
                      node: reportNode,
                      messageId: messageId,
                      data: {
                        responseObjectName:
                          currentRouteContext.responseObjectName,
                        httpMethod: currentRouteContext.httpMethod,
                        actualCode: String(actualCode),
                        expectedCodes: expectedCodes.join(' or '),
                      },
                    });
                  } else {
                  }
                } else if (actualCode !== null) {
                }
              }
            }
          },
          'FunctionExpression:exit'(node) {
            const currentRouteContext = getRouteContext();
            if (
              currentRouteContext &&
              currentRouteContext.handlerNode === node
            ) {
              // const popped = routeContextStack.pop();
            }
          },
          'ArrowFunctionExpression:exit'(node) {
            const currentRouteContext = getRouteContext();
            if (
              currentRouteContext &&
              currentRouteContext.handlerNode === node
            ) {
              // const popped = routeContextStack.pop();
            }
          },
        };
      },
    },
  },
};

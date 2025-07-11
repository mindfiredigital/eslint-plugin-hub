const nlp = require('compromise');

const knownExpressMethods = new Set([
  'get',
  'post',
  'put',
  'delete',
  'patch',
  'options',
  'head',
  'all',
]);

const expressIdentifiers = new Set(['app', 'router']);

const knownExceptions = new Set([
  'status',
  'news',
  'series',
  'v1',
  'v2',
  'v3',
  'v4',
  'v5',
  'api',
  'auth',
  'login',
  'logout',
  'health',
  'ping',
  'info',
  'config',
  'setup',
  'reset',
  'search',
  'upload',
  'download',
  'process',
  'profile',
  'run',
  'quick',
  'go',
  'do',
]);

function preserveCapitalization(original, suggestion) {
  if (!suggestion) return original + 's';
  if (original === original.toUpperCase()) {
    return suggestion.toUpperCase();
  }
  if (original.length > 0 && original[0] === original[0].toUpperCase()) {
    return suggestion.charAt(0).toUpperCase() + suggestion.slice(1);
  }
  return suggestion;
}

module.exports = {
  rules: {
    'plural-resource-paths': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Enforce plural naming for resource paths in Express routes to promote RESTful API design.',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [],
        messages: {
          resourcePathSingular:
            'Resource path segment "{{segment}}" should be plural. Suggestion: "{{suggestion}}".',
        },
      },
      create: function (context) {
        return {
          CallExpression(node) {
            const callee = node.callee;

            if (
              callee.type !== 'MemberExpression' ||
              !knownExpressMethods.has(callee.property.name) ||
              callee.object.type !== 'Identifier' ||
              !expressIdentifiers.has(callee.object.name)
            ) {
              return;
            }

            if (
              node.arguments.length === 0 ||
              node.arguments[0].type !== 'Literal' ||
              typeof node.arguments[0].value !== 'string'
            ) {
              return;
            }

            const routePathNode = node.arguments[0];
            const routePath = routePathNode.value;

            if (routePath.trim() === '/') {
              return;
            }

            const segments = routePath.split('/').filter(Boolean);

            for (const segment of segments) {
              const lowerCaseSegment = segment.toLowerCase();
              if (
                segment.startsWith(':') ||
                knownExceptions.has(lowerCaseSegment) ||
                !/^[a-zA-Z]+$/.test(segment)
              ) {
                continue;
              }

              const doc = nlp(lowerCaseSegment);
              const nouns = doc.nouns();
              let isSingular = false;

              if (nouns.found) {
                isSingular = !nouns.isPlural().out('boolean');
              } else {
                isSingular = !lowerCaseSegment.endsWith('s');
              }

              if (isSingular) {
                const pluralSuggestion =
                  nouns.toPlural().out('text') || lowerCaseSegment + 's';
                if (pluralSuggestion && pluralSuggestion !== lowerCaseSegment) {
                  context.report({
                    node: routePathNode,
                    messageId: 'resourcePathSingular',
                    data: {
                      segment: segment,
                      suggestion: preserveCapitalization(
                        segment,
                        pluralSuggestion
                      ),
                    },
                  });
                }
              }
            }
          },
        };
      },
    },
  },
};

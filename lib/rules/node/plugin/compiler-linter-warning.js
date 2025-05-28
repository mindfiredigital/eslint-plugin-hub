const defaultImportantRules = [
  'no-unused-vars',
  'no-console',
  'no-undef',
  'eqeqeq',
];

module.exports = {
  rules: {
    'no-disable-important-rules': {
      meta: {
        type: 'suggestion',
        docs: {
          description:
            'Discourage disabling all rules or specific important ESLint rules via comments. This helps in addressing all linter warnings proactively.',
          category: 'Best Practices',
          recommended: true, // Or false, depending on how strictly you want to enforce it by default
          url: 'https://github.com/mindfiredigital/eslint-plugin-hub/blob/main/docs/rules/no-disable-important-rules.md', // Placeholder URL
        },
        fixable: null, // Not automatically fixable as the intent needs review
        schema: [
          {
            type: 'object',
            properties: {
              importantRules: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description:
                  'A list of ESLint rule names that should not be disabled.',
              },
            },
            additionalProperties: false,
          },
        ],
        messages: {
          blanketDisable:
            'Blanket disabling of ESLint rules is discouraged. Please specify the rules you intend to disable or address the linting issues.',
          importantRuleDisabled:
            "Disabling the rule '{{ruleName}}' is discouraged. Please address the underlying linting issue instead.",
        },
      },
      create: function (context) {
        const options = context.options[0] || {};
        const importantRules = options.importantRules || defaultImportantRules;
        const sourceCode = context.getSourceCode();

        // Regex to identify ESLint disable directives
        // Catches:
        // eslint-disable
        // eslint-disable-line
        // eslint-disable-next-line
        const disableDirectiveRegex = /^\s*eslint-disable(?:-line|-next-line)?/;

        // Regex to extract rule names from the comment value after the directive
        // Example: " rule-a, rule-b -- justification"
        const rulesPartRegex = /^\s*([a-zA-Z0-9\-_,@/\s]+?)?(?:\s*--.*)?$/;

        return {
          Program() {
            const comments = sourceCode.getAllComments();

            comments.forEach(comment => {
              const commentValue = comment.value.trim();

              if (disableDirectiveRegex.test(commentValue)) {
                // Extract the part of the comment after the directive
                const rulesStringMatch = commentValue.replace(
                  disableDirectiveRegex,
                  ''
                );
                const rulesPartMatch = rulesStringMatch.match(rulesPartRegex);

                if (rulesPartMatch) {
                  const specificRulesString = (rulesPartMatch[1] || '').trim();

                  if (specificRulesString === '') {
                    // This is a blanket disable (e.g., /* eslint-disable */)
                    context.report({
                      node: comment,
                      messageId: 'blanketDisable',
                    });
                  } else {
                    // Specific rules are listed
                    const disabledRules = specificRulesString
                      .split(',')
                      .map(rule => rule.trim())
                      .filter(rule => rule.length > 0);

                    disabledRules.forEach(disabledRule => {
                      if (importantRules.includes(disabledRule)) {
                        context.report({
                          node: comment,
                          messageId: 'importantRuleDisabled',
                          data: {
                            ruleName: disabledRule,
                          },
                        });
                      }
                    });
                  }
                }
              }
            });
          },
        };
      },
    },
  },
};

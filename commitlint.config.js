const nlp = require('compromise');

function isImperative(sentence) {
  const doc = nlp(sentence);
  return doc.verbs().isImperative().out('array').length > 0;
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [message => message.includes('[skip-commitlint]')],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    'subject-case': [0, 'never'],
    'custom-commit-format': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'custom-commit-format': parsed => {
          const { subject } = parsed;

          // Check if subject is in present imperative tense
          if (!isImperative(subject)) {
            return [
              false,
              'Subject should be in present imperative tense (e.g., "add feature", "fix bug")',
            ];
          }

          return [true];
        },
      },
    },
  ],
};

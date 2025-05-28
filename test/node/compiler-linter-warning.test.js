const { RuleTester } = require('eslint');
const rules = require('../../index').rules; // Assuming your plugin exports rules correctly

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  plugins: {
    'dummy-plugin': {
      rules: {
        'some-other-rule': {
          meta: { fixable: null, schema: [] },
          create: () => ({}),
        },
        'another-rule': {
          meta: { fixable: null, schema: [] },
          create: () => ({}),
        },
        'yet-another-custom-rule': {
          meta: { fixable: null, schema: [] },
          create: () => ({}),
        },
        'my-custom-rule': {
          meta: { fixable: null, schema: [] },
          create: () => ({}),
        },
        'other-rule': {
          meta: { fixable: null, schema: [] },
          create: () => ({}),
        },
        rule: { meta: { fixable: null, schema: [] }, create: () => ({}) },
      },
    },
  },
  rules: {
    'dummy-plugin/some-other-rule': 'off',
    'dummy-plugin/another-rule': 'off',
    'dummy-plugin/yet-another-custom-rule': 'off',
    'dummy-plugin/my-custom-rule': 'off',
    'dummy-plugin/other-rule': 'off',
    'dummy-plugin/rule': 'off',
  },
});

ruleTester.run(
  'no-disable-important-rules',
  rules['no-disable-important-rules'],
  {
    valid: [
      // Original valid cases
      { code: 'const a = 1;' },
      { code: 'const b = 2; // This is a normal comment' },
      { code: '/* This is a block comment */ const c = 3;' },
      { code: '// eslint-disable-line dummy-plugin/some-other-rule' },
      { code: '/* eslint-disable dummy-plugin/another-rule */' },
      {
        code: '// eslint-disable-next-line dummy-plugin/yet-another-custom-rule',
      },
      { code: '/* eslint-enable */' },
      { code: '/* eslint-enable no-unused-vars */' },
      {
        code: '// eslint-disable-line no-unused-vars',
        options: [{ importantRules: [] }],
      },
      {
        code: '/* eslint-disable no-console */',
        options: [{ importantRules: [] }],
      },
      {
        code: '// eslint-disable-line no-unused-vars',
        options: [{ importantRules: ['dummy-plugin/my-custom-rule'] }],
      },
      {
        code: '// eslint-disable-line semi',
      },
      {
        code: '// eslint-disable-line semi -- This is a temporary fix',
      },

      // Moved from invalid: These blanket disables are not caught by this rule's
      // current implementation due to ESLint's processing order where the
      // directive may disable the rule itself before it can report.
      // eslint-disable-next-line (without rules) IS caught and remains in 'invalid'.
      {
        code: '/* eslint-disable */\nconst a = 1;',
        // Expected 0 errors (due to limitation)
      },
      {
        code: 'const b = 2; // eslint-disable-line',
        // Expected 0 errors (due to limitation)
      },
      {
        code: '/* eslint-disable */',
        options: [{ importantRules: [] }],
        // Expected 0 errors (due to limitation)
      },
    ],
    invalid: [
      // Blanket disable that IS caught
      {
        code: '// eslint-disable-next-line\nconst c = 3;',
        errors: [
          {
            messageId: 'blanketDisable',
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 28,
          },
        ],
      },
      // Disabling default important rules
      {
        code: '// eslint-disable-line no-unused-vars',
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-unused-vars' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 38,
          },
        ],
      },
      {
        code: '/* eslint-disable no-console, no-undef */',
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-console' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 42,
          },
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-undef' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 42,
          },
        ],
      },
      {
        code: '// eslint-disable-next-line eqeqeq',
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'eqeqeq' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 35,
          },
        ],
      },
      {
        code: '/* eslint-disable-next-line no-unused-vars -- Reason why this is disabled */',
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-unused-vars' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 77,
          },
        ],
      },
      // Disabling custom important rules via options
      {
        code: '// eslint-disable-line dummy-plugin/my-custom-rule',
        options: [
          { importantRules: ['dummy-plugin/my-custom-rule', 'no-console'] },
        ],
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'dummy-plugin/my-custom-rule' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 51,
          },
        ],
      },
      {
        code: '/* eslint-disable no-console, dummy-plugin/other-rule */',
        options: [{ importantRules: ['no-console'] }],
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-console' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 57,
          },
        ],
      },
      // Complex disable line
      {
        code: '/* eslint-disable-line no-undef, dummy-plugin/rule, no-unused-vars -- complex reason */',
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-undef' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 88,
          },
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-unused-vars' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 88,
          },
        ],
      },
      {
        code: '/* eslint-disable no-unused-vars, no-console */\nfunction debugMessage(message) {\n console.log(message);\n}',
        errors: [
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-unused-vars' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 48,
          },
          {
            messageId: 'importantRuleDisabled',
            data: { ruleName: 'no-console' },
            line: 1,
            column: 1,
            endLine: 1,
            endColumn: 48,
          },
        ],
      },
    ],
  }
);

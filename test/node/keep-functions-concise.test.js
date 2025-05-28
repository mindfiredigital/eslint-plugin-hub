const { RuleTester } = require('eslint');
const rules = require('../../index').rules; // Adjust if your rules object is structured differently

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
});

function generateLines(count) {
  let lines = '';
  for (let i = 0; i < count; i++) {
    lines += `  let var${i};\n`; // Unique variable names
  }
  return lines;
}

ruleTester.run('keep-functions-concise', rules['keep-functions-concise'], {
  valid: [
    // Default options (maxLines: 60, skipBlankLines: false, skipComments: false)
    { code: 'function short() {\n  let a = 1;\n  return a;\n}' }, // 2 lines
    { code: `function with50Lines() {\n${generateLines(50)}}` },

    // Custom maxLines
    {
      code: 'function tiny() {\n  let a = 1;\n}', // 1 line
      options: [{ maxLines: 1 }],
    },

    // skipBlankLines: true
    {
      code: 'function withBlanks() {\n\n  let a = 1;\n\n  let b = 2;\n\n}', // 2 effective lines
      options: [{ maxLines: 2, skipBlankLines: true }],
    },
    {
      code: 'function withBlanksAndCode() {\n  let a = 1;\n\n  let b = 2;\n}', // 2 effective lines
      options: [{ maxLines: 2, skipBlankLines: true }],
    },

    // skipComments: true
    {
      code: 'function withComments() {\n  // comment1\n  let a = 1;\n  /* block comment */\n  let b = 2;\n  // comment2\n}', // 2 effective lines
      options: [{ maxLines: 2, skipComments: true }],
    },
    {
      code: 'function withOnlyComments() {\n  // comment1\n  // comment2\n  /* block comment */\n}', // 0 effective lines
      options: [{ maxLines: 0, skipComments: true }],
    },
    {
      code: 'function withCodeAndComments() {\n  let a = 1; // line comment\n  /* block */ let b = 2;\n}', // 2 effective lines (assuming comments don't make line purely comment)
      options: [{ maxLines: 2, skipComments: true }],
    },

    // skipBlankLines: true, skipComments: true
    {
      code: 'function withAll() {\n  // comment1\n\n  let a = 1;\n\n  /* block comment */\n  let b = 2;\n\n  // comment2\n}', // 2 effective lines
      options: [{ maxLines: 2, skipBlankLines: true, skipComments: true }],
    },

    // Arrow function with concise body
    { code: 'const conciseArrow = () => 1;', options: [{ maxLines: 1 }] },
    { code: 'const conciseArrowOk = () => 1;', options: [{ maxLines: 1 }] }, // Valid as concise body is 1 line
  ],
  invalid: [
    // Default options
    {
      code: `function long() {\n${generateLines(61)}}`, // 61 lines
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'long',
            actualLines: 61,
            maxLines: 60,
            skippedLineInfo: '(no lines skipped by options)',
          },
        },
      ],
    },

    {
      code: 'const conciseArrowZeroMax = () => 1;',
      options: [{ maxLines: 0 }],
      errors: 1,
    },

    // Custom maxLines
    {
      code: 'function tooBig() {\n  let a = 1;\n  let b = 2;\n}', // 2 lines
      options: [{ maxLines: 1 }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'tooBig',
            actualLines: 2,
            maxLines: 1,
            skippedLineInfo: '(no lines skipped by options)',
          },
        },
      ],
    },

    // skipBlankLines: true, but still too many effective lines
    {
      code: 'function longWithBlanks() {\n\n  let a = 1;\n\n  let b = 2;\n  let c = 3;\n\n}', // 3 effective lines
      options: [{ maxLines: 2, skipBlankLines: true }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'longWithBlanks',
            actualLines: 3,
            maxLines: 2,
            skippedLineInfo: '(blank lines skipped)',
          },
        },
      ],
    },
    // Counting blank lines when skipBlankLines: false
    {
      code: 'function countBlanks() {\n  let a = 1;\n\n  let b = 2;\n}', // 3 lines (1 blank)
      options: [{ maxLines: 2, skipBlankLines: false }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'countBlanks',
            actualLines: 3,
            maxLines: 2,
            skippedLineInfo: '(no lines skipped by options)',
          },
        },
      ],
    },

    // skipComments: true, but still too many effective lines
    {
      code: 'function longWithComments() {\n  // comment \n  let a = 1;\n  /* block */\n  let b = 2;\n  let c = 3;\n}', // 3 effective lines
      options: [{ maxLines: 2, skipComments: true }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'longWithComments',
            actualLines: 3,
            maxLines: 2,
            skippedLineInfo: '(comment lines skipped)',
          },
        },
      ],
    },
    // Counting comment lines when skipComments: false
    {
      code: 'function countComments() {\n  // comment\n  let a = 1;\n}', // 2 lines (1 comment)
      options: [{ maxLines: 1, skipComments: false }], // default for skipComments
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'countComments',
            actualLines: 2,
            maxLines: 1,
            skippedLineInfo: '(no lines skipped by options)',
          },
        },
      ],
    },

    // skipBlankLines: true, skipComments: true, but still too many
    {
      code: 'function longWithAll() {\n  // comment\n\n  let a = 1;\n  /* block */\n\n  let b = 2;\n  let c = 3;\n}', // 3 effective lines
      options: [{ maxLines: 2, skipBlankLines: true, skipComments: true }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'longWithAll',
            actualLines: 3,
            maxLines: 2,
            skippedLineInfo: '(blank lines skipped, comment lines skipped)',
          },
        },
      ],
    },
    // Arrow function with concise body, maxLines: 0
    {
      code: 'const conciseArrowTooLong = () => 1;',
      options: [{ maxLines: 0 }],
      errors: [
        {
          messageId: 'tooManyLines',
          data: {
            name: 'conciseArrowTooLong',
            actualLines: 1,
            maxLines: 0,
            skippedLineInfo: '(concise body counted as 1 line)',
          },
        },
      ],
    },
  ],
});

// A specific valid case that was marked invalid in thought process, ensuring it's valid.
ruleTester.run(
  'keep-functions-concise (concise arrow valid specific)',
  rules['keep-functions-concise'],
  {
    valid: [
      {
        code: 'const conciseArrowZeroMax = () => 1;',
        options: [{ maxLines: 1 }],
      },
    ],
    invalid: [],
  }
);

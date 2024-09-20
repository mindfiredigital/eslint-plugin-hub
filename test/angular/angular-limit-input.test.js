const { RuleTester } = require('eslint');
const rules = require('../../index').rules;
const tsParser = require('@typescript-eslint/parser');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run('angular-limit-input', rules['angular-limit-input'], {
  valid: [
    // Component with allowed number of @Input and @Output
    {
      code: `
        import { Component, Input, Output } from '@angular/core';
        @Component({})
        class AppComponent {
          @Input() input1: string;
          @Input() input2: string;
          @Output() output1 = new EventEmitter();
        }
      `,
      options: [{ max: 5 }],
    },
    // Component with no @Input or @Output properties
    {
      code: `
        import { Component } from '@angular/core';
        @Component({})
        class AppComponent {
        }
      `,
      options: [{ max: 3 }],
    },
  ],
  invalid: [
    // Component with too many @Input and @Output
    {
      code: `
        import { Component, Input, Output } from '@angular/core';
        @Component({})
        class AppComponent {
          @Input() input1: string;
          @Input() input2: string;
          @Input() input3: string;
          @Input() input4: string;
          @Input() input5: string;
          @Output() output1 = new EventEmitter();
        }
      `,
      options: [{ max: 5 }],
      errors: [
        {
          message:
            'Component "AppComponent" has too many @Input() or @Output() properties (6), limit is 5.',
        },
      ],
    },
  ],
});

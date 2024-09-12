const { RuleTester } = require('eslint');
const rules = require('../../index').angularHub.rules;
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

ruleTester.run('angular-no-unused-inputs', rules['angular-no-unused-inputs'], {
  valid: [
    {
      code: `
        import { Input } from '@angular/core';
        class MyComponent {
          @Input() someInput: string;

          ngOnInit() {
            console.log(this.someInput);
          }
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        import { Input } from '@angular/core';
        class MyComponent {
          @Input() unusedInput: string;

          ngOnInit() {
            console.log('This does nothing with the input');
          }
        }
      `,
      errors: [
        {
          message:
            'The @Input() property "unusedInput" is declared but never used in the component.',
        },
      ],
    },
  ],
});

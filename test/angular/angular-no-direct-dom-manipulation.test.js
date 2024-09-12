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

ruleTester.run(
  'angular-no-direct-dom-manipulation',
  rules['angular-no-direct-dom-manipulation'],
  {
    valid: [
      // Valid usage of Renderer2 for DOM manipulation
      {
        code: `
        import { Renderer2 } from '@angular/core';
        class MyComponent {
          constructor(private renderer: Renderer2) {}

          ngAfterViewInit() {
            this.renderer.setStyle(this.element, 'color', 'red');
          }
        }
      `,
      },
    ],
    invalid: [
      // Invalid direct DOM manipulation with document.getElementById
      {
        code: `
        class MyComponent {
          ngAfterViewInit() {
            const el = document.getElementById('my-element');
          }
        }
      `,
        errors: [
          {
            message:
              'Avoid direct DOM manipulation with "document.getElementById". Use Angular\'s Renderer2 for DOM interactions.',
          },
        ],
      },
    ],
  }
);

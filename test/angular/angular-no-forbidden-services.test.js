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
  'angular-no-forbidden-services',
  rules['angular-no-forbidden-services'],
  {
    valid: [
      {
        code: `
          import { Component } from '@angular/core';
          import { SomeService } from './some.service';
  
          @Component({
            selector: 'app-my-component',
            template: '<div></div>',
          })
          class MyComponent {
            constructor(private someService: SomeService) {}
          }
        `,
        options: [{ forbiddenServices: ['HttpClient'] }],
      },
    ],
    invalid: [
      {
        code: `
          import { Component, HttpClient } from '@angular/core';
  
          @Component({
            selector: 'app-my-component',
            template: '<div></div>',
          })
          class MyComponent {
            constructor(private httpClient: HttpClient) {}
          }
        `,
        errors: [
          {
            message:
              "The service 'HttpClient' should not be injected directly into components. Consider moving it to a dedicated service or resolver.",
          },
        ],
        options: [{ forbiddenServices: ['HttpClient'] }],
      },
    ],
  }
);

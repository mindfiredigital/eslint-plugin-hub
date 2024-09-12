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

ruleTester.run('angular-filenaming', rules['angular-filenaming'], {
  valid: [
    // Component - kebab-case, Service - camelCase, Module - PascalCase
    {
      code: 'export class AppComponent {}',
      filename: 'app-component.component.ts',
      options: [
        { component: 'kebab-case', service: 'camelCase', module: 'PascalCase' },
      ],
    },
    {
      code: 'export class AppService {}',
      filename: 'appService.service.ts',
      options: [
        { component: 'kebab-case', service: 'camelCase', module: 'PascalCase' },
      ],
    },
    {
      code: 'export class AppModule {}',
      filename: 'AppModule.module.ts',
      options: [
        { component: 'kebab-case', service: 'camelCase', module: 'PascalCase' },
      ],
    },

    // Component - PascalCase, Service - PascalCase, Module - PascalCase
    {
      code: 'export class AppComponent {}',
      filename: 'AppComponent.component.ts',
      options: [
        {
          component: 'PascalCase',
          service: 'PascalCase',
          module: 'PascalCase',
        },
      ],
    },
    {
      code: 'export class AppService {}',
      filename: 'AppService.service.ts',
      options: [
        {
          component: 'PascalCase',
          service: 'PascalCase',
          module: 'PascalCase',
        },
      ],
    },
    {
      code: 'export class AppModule {}',
      filename: 'AppModule.module.ts',
      options: [
        {
          component: 'PascalCase',
          service: 'PascalCase',
          module: 'PascalCase',
        },
      ],
    },
  ],

  invalid: [
    // Invalid kebab-case for component files
    {
      code: 'export class AppComponent {}',
      filename: 'AppComponent.component.ts',
      options: [{ component: 'kebab-case' }],
      errors: [
        {
          message:
            'File "AppComponent.component.ts" does not follow the kebab-case naming convention.',
        },
      ],
    },
    // Invalid camelCase for service files
    {
      code: 'export class AppService {}',
      filename: 'AppService.service.ts',
      options: [{ service: 'camelCase' }],
      errors: [
        {
          message:
            'File "AppService.service.ts" does not follow the camelCase naming convention.',
        },
      ],
    },
    // Invalid PascalCase for module files
    {
      code: 'export class AppModule {}',
      filename: 'appModule.module.ts',
      options: [{ module: 'PascalCase' }],
      errors: [
        {
          message:
            'File "appModule.module.ts" does not follow the PascalCase naming convention.',
        },
      ],
    },
  ],
});

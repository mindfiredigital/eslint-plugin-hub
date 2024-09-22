const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: {
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
  'react-component-name-match-filename',
  rules['react-component-name-match-filename'],
  {
    valid: [
      {
        code: `
        import React from 'react';

        class MyComponent extends React.Component {
          render() {
            return <div></div>;
          }
        }

        export default MyComponent;
      `,
        filename: 'MyComponent.jsx',
      },
      {
        code: `
        import React from 'react';

        function MyComponent() {
          return <div></div>;
        }

        export default MyComponent;
      `,
        filename: 'MyComponent.tsx',
      },
      // Files without React or JSX (non-React)
      {
        code: 'const myVariable = 42;',
        filename: 'myVariable.js', // No JSX, should not trigger PascalCase check
      },
      {
        code: 'function helperFunction() { return true; }',
        filename: 'helperFunction.ts', // No JSX, should not trigger PascalCase check
      },
    ],
    invalid: [
      {
        code: `
        import React from 'react';

        function MyComponent() {
          return <div></div>;
        }

        export default MyComponent;
      `,
        filename: 'AnotherComponent.tsx',
        errors: [
          {
            message:
              "Component name 'MyComponent' should match the filename 'AnotherComponent.tsx'.",
          },
        ],
      },
      {
        code: `
        import React from 'react';

        class MyComponent extends React.Component {
          render() {
            return <div></div>;
          }
        }

        export default MyComponent;
      `,
        filename: 'WrongComponent.jsx',
        errors: [
          {
            message:
              "Component name 'MyComponent' should match the filename 'WrongComponent.jsx'.",
          },
        ],
      },
    ],
  }
);
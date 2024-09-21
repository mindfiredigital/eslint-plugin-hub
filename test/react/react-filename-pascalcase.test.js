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
  'react-filename-pascalcase',
  rules['react-filename-pascalcase'],
  {
    valid: [
      // React Components with valid PascalCase filenames
      {
        code: 'const Component = () => <div>Hello</div>;',
        filename: 'Component.jsx',
      },
      {
        code: 'function MyComponent() { return <div>Hello</div>; }',
        filename: 'MyComponent.tsx',
      },
      {
        code: 'class MyComponent extends React.Component { render() { return <div></div>; }}',
        filename: 'MyComponent.js',
      },
      {
        code: 'const MyComponent = () => <div>Hello</div>;',
        filename: 'MyComponent.ts',
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
      // React components with invalid filenames
      {
        code: 'const component = () => <div>Hello</div>;',
        filename: 'component.jsx',
        errors: [
          { message: "Filename 'component.jsx' should be in PascalCase." },
        ],
      },
      {
        code: `import React from 'react'; function MyComponent() { return <div></div>; }`,
        filename: 'anotherComponent.tsx',
        errors: [
          {
            message: "Filename 'anotherComponent.tsx' should be in PascalCase.",
          },
        ],
      },
      {
        code: `const myComponent = () => <div></div>;`,
        filename: 'myComponent.js',
        errors: [
          { message: "Filename 'myComponent.js' should be in PascalCase." },
        ],
      },
      {
        code: `function myComponent() { return <div></div>; }`,
        filename: 'myComponent.ts',
        errors: [
          { message: "Filename 'myComponent.ts' should be in PascalCase." },
        ],
      },
      // Mixed case: Filename is lowercase but contains JSX (React)
      {
        code: 'const MyComponent = () => <div>Hello</div>;',
        filename: 'component.js',
        errors: [
          { message: "Filename 'component.js' should be in PascalCase." },
        ],
      },
    ],
  }
);

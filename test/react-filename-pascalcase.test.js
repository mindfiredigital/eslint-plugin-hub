const { RuleTester } = require('eslint');
const rules = require('../index').rules;
const babelParser = require('@babel/eslint-parser');
// const tsParser = require('@typescript-eslint/parser');

const ruleTester = new RuleTester({
  languageOptions: {
    parser: babelParser,
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
      {
        code: 'const Component = () => <div>Hello</div>;',
        filename: 'Component.jsx',
      },
      {
        code: 'function MyComponent() { return <div>Hello</div>; }',
        filename: 'MyComponent.tsx',
      },
    ],
    invalid: [
      {
        code: 'const component = () => <div>Hello</div>;',
        filename: 'component.jsx',
        errors: [
          { message: "Filename 'component.jsx' should be in PascalCase." },
        ],
      },
      {
        code: 'const MyComponent: React.FC = () => <div>Hello</div>;',
        filename: 'my-component.tsx',
        errors: [
          { message: "Filename 'my-component.tsx' should be in PascalCase." },
        ],
      },
    ],
  }
);

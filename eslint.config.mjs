import hub from './index.js'; // Import your plugin
import babelParser from '@babel/eslint-parser'; // Babel parser for JS/JSX
import tsParser from '@typescript-eslint/parser'; // TypeScript parser
import globals from 'globals'; // Global variables

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/test/**',
      '**/docs-docusaurus/**',
    ],
  },
  // Configuration for JavaScript and JSX files
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      hub, // Use the imported plugin
    },
    rules: {
      ...hub.configs.mern.rules, // Use the flat-config version of the recommended MERN rules
    },
  },
  // Configuration for TypeScript and TSX files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json', // Ensure TypeScript project file is set
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      hub, // Use the imported plugin
    },
    rules: {
      ...hub.configs.mern.rules, // Use the flat-config version of the recommended MERN rules
    },
  },
];

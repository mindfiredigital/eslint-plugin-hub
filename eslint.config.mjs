import pluginHub from './index.js';
import babelParser from '@babel/eslint-parser';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/test/**',
      '**/docs-docusaurus/**',
    ],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
        ecmaVersion: 2022,
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
      pluginHub: pluginHub,
    },
  rules: {
    'pluginHub/general/file-kebabcase': 'error',
    'pluginHub/general/function-camelcase': 'error',
    'pluginHub/general/vars-camelcase': 'error',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: false,
        },
      ],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      pluginHub: pluginHub,
    },
    rules: {
      'pluginHub/general/file-kebabcase': 'error',
      'pluginHub/general/function-camelcase': 'error',
      'pluginHub/general/vars-camelcase': 'error',
    }
  },
];
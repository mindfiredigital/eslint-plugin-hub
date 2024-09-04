import globals from 'globals';
import customPlugin from './index.js';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/test/**',
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      custom: customPlugin,
    },
    rules: {
      'custom/filename-kebabcase': 'error',

      'custom/function-camelcase': 'error',

      'custom/vars-camelcase': 'error',

      //Detect and report unused variables
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
];

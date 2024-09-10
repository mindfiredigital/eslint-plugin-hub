import globals from 'globals';
import pluginHub from './index.js';

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
      pluginHub: pluginHub,
    },
    rules: {
      'pluginHub/file-kebabcase': 'error',

      'pluginHub/function-camelcase': 'error',

      'pluginHub/vars-camelcase': 'error',

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

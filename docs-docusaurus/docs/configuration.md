# Configuration

ESLint Plugin Hub supports both flat and legacy configurations. Choose the appropriate method based on your ESLint version and project setup.

## Flat Configuration (ESLint >=8.56.0)

For projects using ESLint 8.56.0 or later, you can use the new flat config format.

### For ES Module (`eslint.config.mjs`)

```js
import hub from '@mindfiredigital/eslint-plugin-hub';
import globals from 'globals';

export default [
  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      hub: hub,
    },
    rules: {
      'hub/vars-camelcase': 'error',
      'hub/class-pascalcase': 'error',
      'hub/file-kebabcase': 'error',
      'hub/function-camelcase': 'error',
      'hub/function-descriptive': 'warn',
    },
  },
];
```

### For CommonJS (`eslint.config.js`)

```js
const hub = require('@mindfiredigital/eslint-plugin-hub');
const globals = require('globals');

module.exports = [
  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      hub: hub,
    },
    rules: {
      'hub/vars-camelcase': 'error',
      'hub/class-pascalcase': 'error',
      'hub/file-kebabcase': 'error',
      'hub/function-camelcase': 'error',
      'hub/function-descriptive': 'warn',
    },
  },
];
```

## Legacy Configuration

For older ESLint versions or projects using the legacy configuration format, you can use `.eslintrc.*` files or the `eslintrc` field in `package.json`.

### For `.eslintrc.json`

```json
{
  "env": {
    "es2024": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@mindfiredigital/eslint-plugin-hub"],
  "rules": {
    "@mindfiredigital/hub/file-kebabcase": "error",
    "@mindfiredigital/hub/function-camelcase": "error",
    "@mindfiredigital/hub/vars-camelcase": "error"
  }
}
```

### For ES Module `.eslintrc.js`

```javascript
export default {
  env: {
    browser: true,
    es2024: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@mindfiredigital/eslint-plugin-hub'],
  rules: {
    '@mindfiredigital/hub/file-kebabcase': 'error',
    '@mindfiredigital/hub/function-camelcase': 'error',
    '@mindfiredigital/hub/vars-camelcase': 'error',
  },
};
```

### For CommonJS `.eslintrc.cjs`

```javascript
module.exports = {
  env: {
    browser: true,
    es2024: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@mindfiredigital/eslint-plugin-hub'],
  rules: {
    '@mindfiredigital/hub/file-kebabcase': 'error',
    '@mindfiredigital/hub/function-camelcase': 'error',
    '@mindfiredigital/hub/vars-camelcase': 'error',
  },
};
```

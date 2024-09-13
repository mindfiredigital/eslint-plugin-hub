# Configuration

Here's how you can integrate the `pluginHub`, `reactHub`, and `angularHub` plugins with the necessary imports for your ESLint configuration.

### General Configuration

For general JavaScript and TypeScript projects using `pluginHub`:

```javascript
const { pluginHub } = require('eslint-plugin-hub');

module.exports = {
  plugins: ['pluginHub'],
  rules: {
    'pluginHub/vars-camelcase': 'error',
    'pluginHub/vars-descriptive': 'warn',
    'pluginHub/class-pascalcase': 'error',
    'pluginHub/file-kebabcase': 'error',
    'pluginHub/function-camelcase': 'error',
    'pluginHub/function-descriptive': 'warn',
  },
};
```

### React-Specific Configuration

For React applications using `reactHub`:

```javascript
const { reactHub } = require('eslint-plugin-hub');

module.exports = {
  plugins: ['reactHub'],
  rules: {
    'reactHub/react-component-name-match-filename': 'error',
    'reactHub/react-filename-pascalcase': 'error',
  },
};
```

### Angular-Specific Configuration

For Angular projects using `angularHub`:

```javascript
const { angularHub } = require('eslint-plugin-hub');

module.exports = {
  plugins: ['angularHub'],
  rules: {
    'angularHub/angular-no-forbidden-services': 'error',
    'angularHub/angular-no-unused-inputs': 'warn',
    'angularHub/angular-no-direct-dom-manipulation': 'error',
    'angularHub/angular-limit-input': 'warn',
    'angularHub/angular-filenaming': 'error',
  },
};
```

### Example ESLint Configuration (Combined for JavaScript/TypeScript, React, and Angular)

If your project includes JavaScript/TypeScript, React, and Angular, you can combine the configurations like this:

```javascript
const { pluginHub } = require('eslint-plugin-hub');
const { reactHub } = require('eslint-plugin-hub');
const { angularHub } = require('eslint-plugin-hub');

module.exports = {
  plugins: ['pluginHub', 'reactHub', 'angularHub'],
  overrides: [
    // General JavaScript/TypeScript rules
    {
      files: ['**/*.js', '**/*.ts'],
      plugins: ['pluginHub'],
      rules: {
        'pluginHub/vars-camelcase': 'error',
        'pluginHub/vars-descriptive': 'warn',
        'pluginHub/class-pascalcase': 'error',
        'pluginHub/file-kebabcase': 'error',
        'pluginHub/function-camelcase': 'error',
        'pluginHub/function-descriptive': 'warn',
      },
    },
    // React-specific rules
    {
      files: ['**/*.jsx', '**/*.tsx'],
      plugins: ['reactHub'],
      rules: {
        'reactHub/react-component-name-match-filename': 'error',
        'reactHub/react-filename-pascalcase': 'error',
      },
    },
    // Angular-specific rules
    {
      files: ['**/*.ts', '**/*.html'],
      plugins: ['angularHub'],
      rules: {
        'angularHub/angular-no-forbidden-services': 'error',
        'angularHub/angular-no-unused-inputs': 'warn',
        'angularHub/angular-no-direct-dom-manipulation': 'error',
        'angularHub/angular-limit-input': 'warn',
        'angularHub/angular-filenaming': 'error',
      },
    },
  ],
};
```

### Explanation

1. **Imports**: Import the specific hubs (`pluginHub`, `reactHub`, and `angularHub`) from `eslint-plugin-hub`.

2. **Plugins**: Add the respective plugins to the `plugins` array in the configuration.

3. **Rules**: Define rules specific to each hub under the `rules` section for each relevant file type.

This setup ensures that the ESLint configuration is properly organized and integrates the rules from the different hubs as needed.

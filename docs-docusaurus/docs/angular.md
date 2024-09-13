# Angular

## Angular Plugin Configuration

To ensure consistent coding standards and best practices in Angular projects, the ESLint Plugin Hub provides several Angular-specific rules. These rules enforce best practices for naming conventions, component structure, and the usage of services, inputs, and DOM manipulation within Angular projects.

### Configuration

After installing the plugin, you'll need to add the Angular-specific rules from `eslint-plugin-hub` to your ESLint configuration file (e.g., `.eslintrc.json`, `.eslintrc.js`, or `.eslintrc.yaml`).

Here’s how to configure the Angular-specific rules:

### Import Angular Rules

```javascript
const { angularHub } = require('eslint-plugin-hub');
const angularRules = angularHub.rules;

// Example usage in ESLint configuration
module.exports = {
  plugins: ['hub'],
  rules: {
    ...angularRules,
  },
};
```

or

```json
{
  "plugins": ["hub"],
  "rules": {
    "hub/angular-no-forbidden-services": "error",
    "hub/angular-no-unused-inputs": "warn",
    "hub/angular-no-direct-dom-manipulation": "error",
    "hub/angular-limit-input": "warn",
    "hub/angular-filenaming": "error"
  }
}
```

### Angular Rule Details

#### `angular-no-forbidden-services`

This rule disallows the usage of forbidden Angular services in your project. You can configure a list of forbidden services, ensuring that only authorized services are used.

- **Default Level**: `error`
- **Rationale**: Some services, such as certain legacy or deprecated ones, should not be used in new codebases.

```json
"hub/angular-no-forbidden-services": ["error", { "forbiddenServices": ["$http", "$scope"] }]
```

#### `angular-no-unused-inputs`

This rule checks for unused inputs in Angular components. It warns when an `@Input()` property is declared but not used inside the component's template or logic.

- **Default Level**: `warn`
- **Rationale**: Unused inputs add unnecessary complexity and can lead to confusion.

```json
"hub/angular-no-unused-inputs": "warn"
```

#### `angular-no-direct-dom-manipulation`

This rule disallows direct DOM manipulation within Angular components. Angular provides a declarative approach to working with the DOM, and bypassing that with direct manipulation can lead to hard-to-maintain code.

- **Default Level**: `error`
- **Rationale**: Direct DOM manipulation is discouraged in Angular since it goes against Angular's reactive, declarative architecture.

```json
"hub/angular-no-direct-dom-manipulation": "error"
```

#### `angular-limit-input`

This rule enforces a limit on the number of `@Input()` properties that can be declared in a component. You can configure the maximum number of inputs allowed.

- **Default Level**: `warn`
- **Rationale**: A large number of inputs can make a component difficult to manage and maintain. Limiting inputs encourages better component design.

```json
"hub/angular-limit-input": ["warn", { "maxInputs": 5 }]
```

#### `angular-filenaming`

This rule enforces a consistent naming convention for Angular files. By default, it checks that all Angular files follow a kebab-case naming convention.

- **Default Level**: `error`
- **Rationale**: Consistent naming conventions help in organizing and maintaining code in large projects.

```json
"hub/angular-filenaming": ["error", { "namingConvention": "kebab-case" }]
```

### Example ESLint Configuration for Angular Projects

Here’s a full example of an `.eslintrc.js` configuration that includes the Angular plugin and rules:

```js
module.exports = {
  extends: ['eslint:recommended', 'plugin:@angular-eslint/recommended'],
  plugins: ['hub'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Angular-specific rules from the ESLint Plugin Hub
    'hub/angular-no-forbidden-services': [
      'error',
      { forbiddenServices: ['$http', '$scope'] },
    ],
    'hub/angular-no-unused-inputs': 'warn',
    'hub/angular-no-direct-dom-manipulation': 'error',
    'hub/angular-limit-input': ['warn', { maxInputs: 5 }],
    'hub/angular-filenaming': ['error', { namingConvention: 'kebab-case' }],
  },
};
```

### Conclusion

These Angular-specific ESLint rules are designed to promote better coding practices and maintainability in Angular projects. By enforcing limits on inputs, disallowing direct DOM manipulation, and following naming conventions, you'll ensure a clean, maintainable, and efficient codebase.

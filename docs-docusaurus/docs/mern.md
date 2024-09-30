# MERN

The MERN configuration includes a set of recommended ESLint rules optimized for MongoDB, Express, React, and Node.js stack projects. These rules enforce consistent naming conventions, clean coding practices, and overall maintainability for MERN projects.

### MERN Rules Overview

| Rule Description                                       | Legacy Configuration                                       | Flat Configuration                        | Severity |
| ------------------------------------------------------ | ---------------------------------------------------------- | ----------------------------------------- | -------- |
| Enforce kebab-case for filenames                       | `@mindfiredigital/hub/file-kebabcase`                      | `hub/file-kebabcase`                      | error    |
| Enforce camelCase for variables                        | `@mindfiredigital/hub/vars-camelcase`                      | `hub/vars-camelcase`                      | error    |
| Enforce PascalCase for class names                     | `@mindfiredigital/hub/class-pascalcase`                    | `hub/class-pascalcase`                    | error    |
| Enforce camelCase for function names                   | `@mindfiredigital/hub/function-camelcase`                  | `hub/function-camelcase`                  | error    |
| Enforce descriptive function names                     | `@mindfiredigital/hub/function-descriptive`                | `hub/function-descriptive`                | warn     |
| Enforce React component names to match their filenames | `@mindfiredigital/hub/react-component-name-match-filename` | `hub/react-component-name-match-filename` | error    |
| Enforce PascalCase for React component filenames       | `@mindfiredigital/hub/react-filename-pascalcase`           | `hub/react-filename-pascalcase`           | error    |

These rules promote consistency, readability, and maintainability in your codebase, specifically for projects using the MERN stack.

### Example: Extending the MERN Config

To apply the recommended MERN ESLint rules in your project, extend the MERN config preset from the ESLint Plugin Hub in your ESLint configuration file.

#### For `eslint.config.mjs`:

```js
import hub from '@mindfiredigital/eslint-plugin-hub';
import globals from 'globals';

export default [
  // Extends the mern config preset from the plugin
  hub.configs['flat/mern'],
  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // Add any additional rules or overrides here
  },
];
```

#### For `.eslintrc.cjs`:

```javascript
module.exports = {
  env: {
    browser: true,
    es2024: true,
  },
  extends: ['plugin:@mindfiredigital/hub/mern'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    '@mindfiredigital/hub/file-kebabcase': 'error',
    '@mindfiredigital/hub/function-camelcase': 'error',
    '@mindfiredigital/hub/vars-camelcase': 'error',
  },
};
```

#### For `.eslintrc.json`:

```json
{
  "env": {
    "es2024": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "extends": ["plugin:@mindfiredigital/hub/mern"],
  "rules": {
    "@mindfiredigital/hub/file-kebabcase": "error",
    "@mindfiredigital/hub/function-camelcase": "error",
    "@mindfiredigital/hub/vars-camelcase": "error"
  }
}
```

### Rule Details

#### `hub/file-kebabcase`

This rule enforces kebab-case for filenames across your MERN project. For example, a file should be named `my-component.js` rather than `myComponent.js`.

- **Default Level**: `error`
- **Rationale**: Kebab-case for filenames improves readability, especially in large codebases.

```json
"hub/file-kebabcase": "error"
```

#### `hub/vars-camelcase`

This rule enforces camelCase for variable names in your code. It prevents the use of snake_case or PascalCase for variable names.

- **Default Level**: `error`
- **Rationale**: camelCase is the standard naming convention for JavaScript variables and enhances code consistency.

```json
"hub/vars-camelcase": "error"
```

#### `hub/class-pascalcase`

This rule enforces PascalCase for class names, such as `MyClass`, which is widely accepted as a JavaScript best practice.

- **Default Level**: `error`
- **Rationale**: PascalCase is the standard for class names in JavaScript, aiding in the readability and organization of code.

```json
"hub/class-pascalcase": "error"
```

#### `hub/function-camelcase`

This rule enforces camelCase for function names, which is in line with JavaScript best practices. For instance, function names like `myFunction` should be used instead of `my_function`.

- **Default Level**: `error`
- **Rationale**: camelCase for function names is standard in JavaScript and ensures consistency.

```json
"hub/function-camelcase": "error"
```

#### `hub/function-descriptive`

This rule encourages descriptive function names. It will warn you if a function name is too vague or generic.

- **Default Level**: `warn`
- **Rationale**: Using descriptive function names makes the code more understandable and easier to maintain.

```json
"hub/function-descriptive": "warn"
```

#### `hub/react-component-name-match-filename`

This rule ensures that the name of a React component matches its filename. For example, if the component is `MyComponent`, the filename should be `MyComponent.js`.

- **Default Level**: `error`
- **Rationale**: Keeping component names and filenames consistent helps avoid confusion and improves project maintainability.

```json
"hub/react-component-name-match-filename": "error"
```

#### `hub/react-filename-pascalcase`

This rule enforces PascalCase for React component filenames, such as `MyComponent.js`. This follows the standard practice of naming React components.

- **Default Level**: `error`
- **Rationale**: PascalCase for React component filenames is a widely accepted convention, helping to differentiate component files from non-component files.

```json
"hub/react-filename-pascalcase": "error"
```

### Conclusion

The recommended MERN ESLint rules from the ESLint Plugin Hub help ensure that your MERN stack project follows best practices for naming conventions and code organization. By extending the MERN configuration, you automatically enforce these rules and can customize them as needed for your specific project.

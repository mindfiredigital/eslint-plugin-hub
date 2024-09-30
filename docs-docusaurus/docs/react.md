# React

## React Plugin Configuration

The React-specific rules in the ESLint Plugin Hub enforce naming conventions and best practices that ensure consistency and clarity in your React components and file structure. Below are detailed configurations and explanations of each rule provided by the plugin.

### Configuration

To enable the React-specific rules, add them to your ESLint configuration file (`.eslintrc.json`, `.eslintrc.js`, or `.eslintrc.yaml`), as shown below:

### Import React Rules

```javascript
import hub from '@mindfiredigital/eslint-plugin-hub';
import globals from 'globals';

export default [
  // Extends the react config preset from the plugin
  hub.configs['flat/react'],
  {
    languageOptions: {
      globals: globals.browser,
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

or

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
  "extends": ["plugin:@mindfiredigital/hub/react"]
  // Add any additional rules or overrides here
}
```

### React Rule Details

#### `react-component-name-match-filename`

This rule ensures that the React component name matches the filename. For example, if a component is declared as `MyComponent`, the file should be named `MyComponent.js`. This consistency between filenames and component names helps with maintainability and prevents confusion.

- **Default Level**: `error`
- **Rationale**: Matching component names with filenames creates clarity in large codebases and prevents mismatches that can cause confusion or issues when refactoring.

```json
"@mindfiredigital/hub/react-component-name-match-filename": "error"
```

##### Example of Incorrect Code:

```javascript
// Filename: myComponent.js
function MyComponent() {
  return <div>Hello World</div>;
}

export default MyComponent;
```

##### Example of Correct Code:

```javascript
// Filename: MyComponent.js
function MyComponent() {
  return <div>Hello World</div>;
}

export default MyComponent;
```

#### `react-filename-pascalcase`

This rule enforces that React component filenames follow PascalCase convention. PascalCase is widely used for React components, as it helps differentiate component files from utility or other non-component files.

- **Default Level**: `error`
- **Rationale**: Using PascalCase for React component filenames aligns with common React best practices and helps with consistency across projects.

```json
"@mindfiredigital/hub/react-filename-pascalcase": "error"
```

##### Example of Incorrect Code:

```bash
# Incorrect filename
mycomponent.js
```

##### Example of Correct Code:

```bash
# Correct filename
MyComponent.js
```

### Conclusion

These React-specific ESLint rules help enforce consistent naming conventions for React components and their corresponding files. By ensuring that component names match filenames and using PascalCase for component file names, you can maintain a well-organized and easily navigable project.

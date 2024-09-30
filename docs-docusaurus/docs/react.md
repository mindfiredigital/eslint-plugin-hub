# React

## ESLint Plugin Configuration for React

To maintain consistent naming conventions and best practices across your React project, we leverage React-specific rules from the ESLint Plugin Hub. These rules ensure that React component names are clear, consistent, and follow widely-accepted best practices.

### React Rules Overview

The following React rules are configured:

| Rule Name                             | Description                                                          |
| ------------------------------------- | -------------------------------------------------------------------- |
| `react-component-name-match-filename` | Ensures that React component names match their filenames.            |
| `react-filename-pascalcase`           | Enforces PascalCase naming convention for React component filenames. |

### How to Configure

To enable these React rules, add them to your ESLint configuration file. This can be done through `eslintrc.config.mjs`, `.eslintrc.json`, `.eslintrc.js`, or `.eslintrc.yaml`. The steps below outline the necessary changes to apply these rules effectively.

#### JavaScript Configuration Example (`eslintrc.config.mjs`)

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

#### JSON Configuration Example (`.eslintrc.json`)

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

---

### React Rule Explanations

#### 1. `react-component-name-match-filename`

This rule enforces that each React component name matches the name of its file. For instance, if you create a `MyComponent`, the filename should also be `MyComponent.js`. This practice ensures uniformity and reduces the risk of confusion when managing large-scale codebases.

- **Level**: `error`
- **Rationale**: Matching filenames with component names provides clarity and consistency, making the codebase easier to navigate and maintain.

##### Example of Incorrect Implementation:

```javascript
// Filename: myComponent.js
function MyComponent() {
  return <div>Hello World</div>;
}

export default MyComponent;
```

##### Example of Correct Implementation:

```javascript
// Filename: MyComponent.js
function MyComponent() {
  return <div>Hello World</div>;
}

export default MyComponent;
```

#### 2. `react-filename-pascalcase`

This rule enforces the PascalCase naming convention for React component filenames. PascalCase is widely adopted in the React ecosystem as it makes component files distinguishable from utility files or other resources.

- **Level**: `error`
- **Rationale**: PascalCase promotes consistency and readability, and adhering to it helps ensure that component filenames are immediately recognizable as such.

##### Example of Incorrect Implementation:

```bash
# Incorrect filename
mycomponent.js
```

##### Example of Correct Implementation:

```bash
# Correct filename
MyComponent.js
```

---

### Best Practices for React Project Structure

By following these rules, you can ensure a more organized and maintainable codebase. React projects benefit from consistency, particularly when adhering to these naming conventions:

- **Component names must match filenames**: This avoids confusion and misalignment in the codebase.
- **PascalCase for component filenames**: This makes component files easily recognizable and prevents mix-ups with other files like utilities.

### Additional Notes

- **Customization**: If necessary, you can override these rules to fit the specific needs of your project. However, adhering to these practices is highly recommended for long-term maintainability and clarity.

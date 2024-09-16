# ESLint Plugin Hub

A collection of custom ESLint rules to enforce coding standards and best practices in your JavaScript projects. This plugin aims to help maintain consistent code quality and readability by providing rules for variable names, class names, file names, and function naming conventions.

## Table of Contents

- [Installation](#installation)
- [Rules](#rules)

- [Usage](#usage)
  - [General](#general)
  - [React](#react)
  - [Angular](#angular)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install and use this ESLint plugin, you need to have ESLint already set up in your project. You can then add the plugin as a development dependency with npm or yarn:

```bash
npm install eslint-plugin-hub --save-dev
```

or

```bash
yarn add eslint-plugin-hub --dev
```

## Rules

This plugin provides the following rules:

### General Rules

| Rule Name                  | Description                                               |
| -------------------------- | --------------------------------------------------------- |
| `file-kebabcase`           | Enforces kebab-case naming convention for filenames.      |
| `max-lines-per-file`       | Enforces a maximum number of lines per file.              |
| `max-lines-per-function`   | Enforces a maximum number of lines per function.          |
| `consistent-return`        | Enforces consistent return statements in functions.       |
| `max-function-params`      | Enforces a maximum number of parameters in functions.     |
| `no-single-character-vars` | Disallows single-character variable names.                |
| `vars-lowercase`           | Enforces lowercase naming convention for variables.       |
| `folder-lowercase`         | Enforces lowercase naming convention for folder names.    |
| `file-lowercase`           | Enforces lowercase naming convention for filenames.       |
| `folder-pascalcase`        | Enforces PascalCase naming convention for folder names.   |
| `folder-kebabcase`         | Enforces kebab-case naming convention for folder names.   |
| `folder-camelcase`         | Enforces camelCase naming convention for folder names.    |
| `file-camelcase`           | Enforces camelCase naming convention for filenames.       |
| `function-pascalcase`      | Enforces PascalCase naming convention for function names. |
| `file-pascalcase`          | Enforces PascalCase naming convention for filenames.      |
| `vars-snakecase`           | Enforces snake_case naming convention for variables.      |
| `vars-pascalcase`          | Enforces PascalCase naming convention for variables.      |
| `class-pascalcase`         | Enforces PascalCase naming convention for class names.    |
| `function-camelcase`       | Enforces camelCase naming convention for function names.  |
| `function-descriptive`     | Enforces descriptive names for functions.                 |
| `vars-camelcase`           | Enforces camelCase naming convention for variables.       |
| `vars-descriptive`         | Enforces descriptive names for variables.                 |

### React Rules

| Rule Name                             | Description                                                          |
| ------------------------------------- | -------------------------------------------------------------------- |
| `react-component-name-match-filename` | Enforces that React component names match their filenames.           |
| `react-filename-pascalcase`           | Enforces PascalCase naming convention for React component filenames. |

### Angular Rules

| Rule Name                            | Description                                                     |
| ------------------------------------ | --------------------------------------------------------------- |
| `angular-no-forbidden-services`      | Disallows usage of forbidden Angular services.                  |
| `angular-no-unused-inputs`           | Disallows unused inputs in Angular components.                  |
| `angular-no-direct-dom-manipulation` | Disallows direct DOM manipulation in Angular components.        |
| `angular-limit-input`                | Enforces a limit on the number of inputs in Angular components. |
| `angular-filenaming`                 | Enforces consistent naming conventions for Angular files.       |

## Usage

To enable the plugin and use the rules, add the following configuration to your ESLint configuration file (e.g., `.eslintrc.json`, `.eslintrc.js`, or `.eslint.config.mjs`):

### General

```json
{
  "plugins": ["hub"],
  "rules": {
    "hub/vars-camelcase": "error",
    "hub/vars-descriptive": "warn",
    "hub/class-pascalcase": "error",
    "hub/filename-kebabcase": "error",
    "hub/function-camelcase": "error",
    "hub/function-descriptive": "warn"
  }
}
```

### React

For React-specific rules, add:

```json
{
  "plugins": ["hub"],
  "rules": {
    "hub/react-component-name-match-filename": "error",
    "hub/react-filename-pascalcase": "error"
  }
}
```

### Angular

For Angular-specific rules, add:

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

## Importing Rules Separately

If you want to import and use the rules separately in your code, you can do so by importing from the respective modules. Here's how you can import the rules for General, React, and Angular:

### Import General Rules

```javascript
const { pluginHub } = require('eslint-plugin-hub');
const generalRules = pluginHub.rules;

// Example usage in ESLint configuration
module.exports = {
  plugins: ['hub'],
  rules: {
    ...generalRules,
  },
};
```

### Import React Rules

```javascript
const { reactHub } = require('eslint-plugin-hub');
const reactRules = reactHub.rules;

// Example usage in ESLint configuration
module.exports = {
  plugins: ['hub'],
  rules: {
    ...reactRules,
  },
};
```

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

## Contributing

We welcome contributions to the ESLint Plugin Hub! Here's how you can contribute:

1. **Fork the repository**: Start by forking the ESLint Plugin Hub repository to your GitHub account.

2. **Clone your fork**: Clone your forked repository to your local machine.

   ```bash
   git clone https://github.com/your-username/eslint-plugin-hub.git
   cd eslint-plugin-hub
   ```

3. **Install dependencies**: Install the project dependencies.

   ```bash
   npm install
   ```

   or if you use yarn:

   ```bash
   yarn install
   ```

4. **Create a new branch**: Create a new branch for your feature or bugfix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Use the Rule Generator**: If you're adding a new rule, use our Rule Generator script to scaffold the necessary files:

   ```bash
   npm run generate-rule your-rule-name [rule-type]
   ```

   or if you use yarn:

   ```bash
   yarn generate-rule your-rule-name [rule-type]
   ```

   Replace `your-rule-name` with the name of your new rule (in kebab-case), and `[rule-type]` with either 'general', 'react', or 'angular'. If you don't specify a rule type, the script will prompt you to choose one.

   The Rule Generator will:

   - Create a new rule file in `lib/rules/<rule-type>/`
   - Create a new test file in `test/`
   - Update the `index.js` file to include your new rule

6. **Implement your changes**:

   - If you've generated a new rule, implement the rule logic in the generated rule file and add tests in the generated test file.
   - For other changes, make your code changes and add or update tests as necessary.

7. **Update documentation**: Update the README.md file to include documentation for your new rule or changes.

8. **Run tests**: Ensure all tests pass.

   ```bash
   npm test
   ```

   or:

   ```bash
   yarn test
   ```

9. **Commit your changes**: Commit your changes with a clear and descriptive commit message.

   ```bash
   git commit -m "Add new rule: your-rule-name"
   ```

10. **Push to your fork**: Push your changes to your GitHub fork.

    ```bash
    git push origin feature/your-feature-name
    ```

11. **Create a Pull Request**: Go to the original ESLint Plugin Hub repository on GitHub and create a new Pull Request from your fork. Provide a clear description of your changes in the Pull Request.

12. **Code Review**: Wait for the maintainers to review your Pull Request. Be open to feedback and make any requested changes.

13. **Merge**: Once approved, your Pull Request will be merged into the main branch.

Remember to adhere to the existing code style and follow ESLint Plugin Hub's best practices. If you're unsure about anything, don't hesitate to ask for help in your Pull Request or in the project's issues.

Thank you for contributing to ESLint Plugin Hub!

Please refer to our [contributing guidelines](CONTRIBUTING.md) for more detailed information on our development process, coding standards, and other guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.

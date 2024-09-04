# ESLint Plugin Hub

A collection of custom ESLint rules to enforce coding standards and best practices in your JavaScript projects. This plugin aims to help maintain consistent code quality and readability by providing rules for variable names, class names, file names, and function naming conventions.

## Table of Contents

- [Installation](#installation)
- [Rules](#rules)
  - [vars-camelcase](#vars-camelcase)
  - [vars-descriptive](#vars-descriptive)
  - [class-pascalcase](#class-pascalcase)
  - [filename-kebabcase](#filename-kebabcase)
  - [function-camelcase](#function-camelcase)
  - [function-descriptive](#function-descriptive)
- [Usage](#usage)
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

### `vars-camelcase`

Enforces camelCase naming convention for variables declared with `var`, `let`, or `const`.

#### Example

**Invalid:**

```javascript
const my_variable = 10;
```

**Valid:**

```javascript
const myVariable = 10;
```

### `vars-descriptive`

Enforces variable names to start with a verb and be descriptive.

#### Example

**Invalid:**

```javascript
const data = fetchData();
```

**Valid:**

```javascript
const fetchData = fetchDataFromApi();
```

### `class-pascalcase`

Enforces PascalCase naming convention for class names.

#### Example

**Invalid:**

```javascript
class myclass {}
```

**Valid:**

```javascript
class MyClass {}
```

### `filename-kebabcase`

Enforces kebab-case naming convention for filenames.

#### Example

**Invalid:**

```
myComponent.js
```

**Valid:**

```
my-component.js
```

### `function-camelcase`

Enforces camelCase naming convention for function names.

#### Example

**Invalid:**

```javascript
function MyFunction() {}
```

**Valid:**

```javascript
function myFunction() {}
```

### `function-descriptive`

Enforces function names to start with a verb and be descriptive.

#### Example

**Invalid:**

```javascript
function data() {}
```

**Valid:**

```javascript
function fetchData() {}
```

## Usage

To enable the plugin and use the rules, add the following configuration to your ESLint configuration file (e.g., `.eslintrc.json`, `.eslintrc.js`, or `.eslintrc.yaml`):

```json
{
  "plugins": [
    "hub"
  ],
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

## Contributing

Contributions are welcome! If you’d like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes.
4. Write tests to ensure your changes work as expected.
5. Ensure all tests pass.
6. Submit a pull request with a clear description of your changes.

Please refer to our [contributing guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
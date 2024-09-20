<h1 align="center">ESLint Plugin Hub</h1><br>
<p align="center">
<a href="https://www.npmjs.com/package/@mindfiredigital/eslint-plugin-hub"><img src="https://img.shields.io/npm/v/@mindfiredigital/eslint-plugin-hub.svg?sanitize=true" alt="Version"></a>
<a href="https://www.npmjs.com/package/@mindfiredigital/eslint-plugin-hub"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
</p>

<p align="center">
  <img src="https://mindfiredigital.github.io/_next/static/media/mindfire_foss_logo.0c507a60.png" alt="Mindfire Logo" width="200">
</p>
<p align="center"> A collection of custom ESLint rules to enforce coding standards and best practices in your JavaScript projects. </p>

The `@mindfiredigital/eslint-plugin-hub` aims to help maintain consistent code quality and readability by providing rules for variable names, class names, file names, and function naming conventions.
<br>

## Table of Contents

- [Installation](#installation)
- [Rules](#rules)
  - [General Rules](#general-rules)
  - [React Rules](#react-rules)
  - [Angular Rules](#angular-rules)
- [Usage](#usage)
  - [Flat Configuration (`eslint.config.js`)](#flat-configuration-eslintconfigjs)
    - [General](#general)
    - [Extending Presets in Flat Configuration](#extending-presets-in-flat-configuration-eslintconfigjs)
      - [Extending General Config](#example-extending-general-config)
      - [Extending React Config](#example-extending-react-config)
      - [Extending Angular Config](#example-extending-angular-config)
      - [Extending MERN Config](#example-extending-mern-config)
  - [Legacy Configuration (`.eslintrc.*`, `package.json`)](#legacy-configuration-eslintrc-or-packagejson)
    - [General](#general-1)
    - [Extending Presets in Legacy Configuration](#extending-presets-in-legacy-configuration-eslintrc-packagejson)
      - [Extending General Config](#example-extending-general-config-1)
      - [Extending React Config](#example-extending-react-config-1)
      - [Extending Angular Config](#example-extending-angular-config-1)
      - [Extending MERN Config](#example-extending-mern-config-1)
- [Documentation](#documentation)
- [License](#license)

## Installation

To install and use this ESLint plugin, make sure you have ESLint already set up in your project. Then add the plugin as a development dependency with npm or yarn:

```bash
npm install @mindfiredigital/eslint-plugin-hub --save-dev
```

or

```bash
yarn add @mindfiredigital/eslint-plugin-hub --dev
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

You can enable the plugin and configure the rules using either flat or legacy configurations.

### Flat Configuration (`eslint.config.js`)

This is for ESLint `>=8.56.0` using the new flat config format.

#### General

```js
import { hub } from '@mindfiredigital/eslint-plugin-hub';

export default [
  {
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

### Legacy Configuration (`.eslintrc.*` or `package.json`)

If you're using the legacy ESLint configuration format, here’s how to use the plugin.

#### General

```json
{
  "plugins": ["@mindfiredigital/eslint-plugin-hub"],
  "rules": {
    "@mindfiredigital/hub/vars-camelcase": "error",
    "@mindfiredigital/hub/class-pascalcase": "error",
    "@mindfiredigital/hub/file-kebabcase": "error",
    "@mindfiredigital/hub/function-camelcase": "error",
    "@mindfiredigital/hub/function-descriptive": "warn"
  }
}
```

For ESLint versions `>=8.56.0`, using flat configuration, you can extend from predefined config presets such as **general**, **react**, **angular**, and **mern**.

#### Extending Presets in Flat Configuration (`eslint.config.js`)

You can extend the `hub.configs` presets directly into your flat ESLint configuration.

##### Example: Extending General Config

```js
import { hub } from '@mindfiredigital/eslint-plugin-hub';

export default [
  // Extends the general config preset from the plugin
  hub.configs['flat/general'],
  {
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

##### Example: Extending React Config

```js
import { hub } from '@mindfiredigital/eslint-plugin-hub';

export default [
  // Extends the react config preset from the plugin
  hub.configs['flat/react'],
  {
    rules: {
      'hub/react-component-name-match-filename': 'error',
      'hub/react-filename-pascalcase': 'error',
    },
  },
];
```

##### Example: Extending Angular Config

```js
import { hub } from '@mindfiredigital/eslint-plugin-hub';

export default [
  // Extends the angular config preset from the plugin
  hub.configs['flat/angular'],
  {
    rules: {
      'hub/angular-no-forbidden-services': 'error',
      'hub/angular-no-unused-inputs': 'warn',
      'hub/angular-no-direct-dom-manipulation': 'error',
      'hub/angular-limit-input': 'warn',
      'hub/angular-filenaming': 'error',
    },
  },
];
```

##### Example: Extending MERN Config

```js
import { hub } from '@mindfiredigital/eslint-plugin-hub';

export default [
  // Extends the mern config preset from the plugin
  hub.configs['flat/mern'],
  {
    rules: {
      'hub/file-kebabcase': 'error',
      'hub/vars-camelcase': 'error',
      'hub/class-pascalcase': 'error',
      'hub/function-camelcase': 'error',
      'hub/function-descriptive': 'warn',
    },
  },
];
```

For older versions of ESLint, or if you're using the **legacy** configuration format, you can extend the same configs with the `extends` field. This will inherit the rules from the plugin presets.

#### Extending Presets in Legacy Configuration (`.eslintrc.*`,`.eslintrc.js` or `package.json`)

You can extend any of the provided presets directly into your `.eslintrc.json`, `.eslintrc.js`, or `package.json` ESLint configuration.

##### Example: Extending General Config

```json
{
  "extends": ["@mindfiredigital/hub/general"],
  "rules": {
    "@mindfiredigital/hub/vars-camelcase": "error",
    "@mindfiredigital/hub/class-pascalcase": "error",
    "@mindfiredigital/hub/file-kebabcase": "error",
    "@mindfiredigital/hub/function-camelcase": "error",
    "@mindfiredigital/hub/function-descriptive": "warn"
  }
}
```

##### Example: Extending React Config

```json
{
  "extends": ["@mindfiredigital/hub/react"],
  "rules": {
    "@mindfiredigital/hub/react-component-name-match-filename": "error",
    "@mindfiredigital/hub/react-filename-pascalcase": "error"
  }
}
```

##### Example: Extending Angular Config

```json
{
  "extends": ["@mindfiredigital/hub/angular"],
  "rules": {
    "@mindfiredigital/hub/angular-no-forbidden-services": "error",
    "@mindfiredigital/hub/angular-no-unused-inputs": "warn",
    "@mindfiredigital/hub/angular-no-direct-dom-manipulation": "error",
    "@mindfiredigital/hub/angular-limit-input": "warn",
    "@mindfiredigital/hub/angular-filenaming": "error"
  }
}
```

##### Example: Extending MERN Config

```json
{
  "extends": ["@mindfiredigital/hub/mern"],
  "rules": {
    "@mindfiredigital/hub/file-kebabcase": "error",
    "@mindfiredigital/hub/vars-camelcase": "error",
    "@mindfiredigital/hub/class-pascalcase": "error",
    "@mindfiredigital/hub/function-camelcase": "error",
    "@mindfiredigital/hub/function-descriptive": "warn"
  }
}
```

## Documentation

The documentation for each rule is available at our [official documentation site](https://mindfiredigital.github.io/eslint-plugin-hub/). You can find detailed usage instructions, examples, and best practices for each rule.

If you're contributing to the documentation, please follow the instructions in the `CONTRIBUTING.md` file for how to structure and update the documentation in the `docs/docusaurus` branch.

## License

ESLint Plugin Hub is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

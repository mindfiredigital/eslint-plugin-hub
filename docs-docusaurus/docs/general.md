# General

## Rules for JavaScript, TypeScript, and MJS

These rules are applicable to `.js`, `.ts`, and `.mjs` files to ensure consistent coding standards and best practices across different file types.

### Import General Rules

```javascript
import hub from '@mindfiredigital/eslint-plugin-hub';
import globals from 'globals';

// Example usage in ESLint configuration
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

or

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

### `file-kebabcase`

**Description**: Enforces `kebab-case` naming convention for all filenames.

**Rationale**: Using `kebab-case` for filenames ensures a consistent and readable naming convention across the project, especially when working in JavaScript and Node.js environments where file names should be case-insensitive.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
my-component.js
utils/helper-functions.js
```

Invalid:

```bash
MyComponent.js
helperFunctions.js
```

---

### `max-lines-per-file`

**Description**: Enforces a maximum number of lines per file.

**Rationale**: Limiting the number of lines in a file encourages modularity and readability, making it easier to maintain and debug code.

**Options**: Can be configured with the maximum number of lines. The default is `300`.

```json
{
  "rules": {
    "hub/max-lines-per-file": ["error", { "max": 300 }]
  }
}
```

**Example:**

Valid:

A file with less than 300 lines.

Invalid:

A file with more than 300 lines.

---

### `max-lines-per-function`

**Description**: Enforces a maximum number of lines per function.

**Rationale**: Ensures that functions are concise and focused on doing one thing, which improves readability and maintainability.

**Options**: Configurable to set the maximum number of lines per function. The default is `50`.

```json
{
  "rules": {
    "hub/max-lines-per-function": ["error", { "max": 50 }]
  }
}
```

**Example:**

Valid:

```javascript
function myFunction() {
  // fewer than 50 lines
}
```

Invalid:

```javascript
function myFunction() {
  // more than 50 lines
}
```

---

### `consistent-return`

**Description**: Enforces consistent return statements in functions, requiring that all code paths in a function either always or never specify a value to return.

**Rationale**: Ensures that functions have a consistent return behavior, preventing unintended `undefined` values.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
function doSomething(value) {
  if (value) {
    return true;
  }
  return false;
}
```

Invalid:

```javascript
function doSomething(value) {
  if (value) {
    return true;
  }
  // No return statement here
}
```

---

### `max-function-params`

**Description**: Enforces a maximum number of parameters in a function.

**Rationale**: Reducing the number of parameters makes functions easier to understand and use. It also promotes using objects as function parameters when many values are needed.

**Options**: Can be configured with the maximum number of parameters. The default is `3`.

```json
{
  "rules": {
    "hub/max-function-params": ["error", { "max": 3 }]
  }
}
```

**Example:**

Valid:

```javascript
function myFunction(param1, param2, param3) {
  // Function logic
}
```

Invalid:

```javascript
function myFunction(param1, param2, param3, param4) {
  // Too many parameters
}
```

---

### `no-single-character-vars`

**Description**: Disallows single-character variable names, except for specific use cases like loop iterators.

**Rationale**: Using descriptive variable names improves code readability and self-documentation.

**Options**: Can allow specific characters like `i`, `j`, and `k` for loop iterators.

```json
{
  "rules": {
    "hub/no-single-character-vars": ["error", { "allow": ["i", "j", "k"] }]
  }
}
```

**Example:**

Valid:

```javascript
let index = 5;
```

Invalid:

```javascript
let x = 5;
```

---

### `vars-lowercase`

**Description**: Enforces `lowercase` naming convention for variable names.

**Rationale**: Promotes consistency and readability by enforcing lowercase variable names, typically used for non-constant variables in JavaScript.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
let myVariable = 5;
```

Invalid:

```javascript
let MyVariable = 5;
```

---

### `folder-lowercase`

**Description**: Enforces lowercase naming convention for folder names.

**Rationale**: Ensures consistency across folder structures, making it easier to navigate and maintain projects.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
src/
components/
helpers/
```

Invalid:

```bash
Src/
Components/
Helpers/
```

---

### `file-lowercase`

**Description**: Enforces lowercase naming convention for filenames.

**Rationale**: Similar to `folder-lowercase`, using lowercase filenames ensures consistency across the project.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
index.js
app.js
```

Invalid:

```bash
Index.js
App.js
```

---

### `folder-pascalcase`

**Description**: Enforces `PascalCase` naming convention for folder names.

**Rationale**: PascalCase is often used for folders representing React components or class-like structures, ensuring clarity.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
MyComponent/
Helpers/
```

Invalid:

```bash
mycomponent/
helpers/
```

---

### `folder-kebabcase`

**Description**: Enforces `kebab-case` naming convention for folder names.

**Rationale**: Similar to `file-kebabcase`, using `kebab-case` in folder names promotes consistency, especially in JavaScript projects.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
my-folder/
utils/
```

Invalid:

```bash
MyFolder/
utils/
```

---

### `folder-camelcase`

**Description**: Enforces `camelCase` naming convention for folder names.

**Rationale**: Ensures folder names follow the camelCase convention, often used for non-component folders in JavaScript.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
myFolder/
helperFunctions/
```

Invalid:

```bash
my-folder/
HelperFunctions/
```

---

### `file-camelcase`

**Description**: Enforces `camelCase` naming convention for filenames.

**Rationale**: Promotes consistency in file naming, especially for files that represent utility modules or scripts.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
myComponent.js
helperFunctions.js
```

Invalid:

```bash
MyComponent.js
helper-functions.js
```

---

### `function-pascalcase`

**Description**: Enforces `PascalCase` naming convention for function names, typically for constructors and classes.

**Rationale**: Ensures that constructors or classes follow PascalCase, improving readability and consistency.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
function MyConstructor() {
  // Constructor logic
}
```

Invalid:

```javascript
function myConstructor() {
  // Constructor logic
}
```

---

### `file-pascalcase`

**Description**: Enforces `PascalCase` naming convention for filenames.

**Rationale**: Often used for files representing classes or React components, PascalCase filenames promote consistency in naming conventions.

**Options**: No additional configuration options.

**Example:**

Valid:

```bash
MyComponent.js
HelperFunctions.js
```

Invalid:

```bash
mycomponent.js
helperfunctions.js
```

---

### `vars-snakecase`

**Description**: Enforces `snake_case` naming convention for variable names.

**Rationale**: Ensures consistency when snake_case is preferred for variable names in a project.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
let my_variable = 5;
```

Invalid:

```javascript
let myVariable = 5;
```

---

### `vars-pascalcase`

**Description**: Enforces `PascalCase` naming convention for variable names.

**Rationale**: Useful when PascalCase is preferred for constants or specific variables in a project.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
let MyVariable = 5;
```

Invalid:

```javascript
let my_variable = 5;
```

---

### `class-pascalcase`

**Description**: Enforces `PascalCase` naming convention for class names.

**Rationale**: Ensures that class names follow PascalCase for readability and consistency.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
class MyClass {}
```

Invalid:

```javascript
class myClass {}
```

---

### `function-camelcase`

**Description**: Enforces `camelCase` naming convention for function names.

**Rationale**: Ensures function names follow the camelCase naming convention, which is the standard in JavaScript.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
function myFunction() {
  // Function logic
}
```

Invalid:

```javascript
function MyFunction() {
  // Function logic
}
```

---

### `function-descriptive`

**Description**: Enforces that function names are descriptive.

**Rationale**: Helps ensure that function names clearly indicate their purpose or action, improving code readability and maintainability.

**Options**:

No additional configuration options.

**Example:**

Valid:

```javascript
function getUserById() {
  // Function logic
}
```

Invalid:

```javascript
function doStuff() {
  // Function logic
}
```

---

### `vars-camelcase`

**Description**: Enforces `camelCase` naming convention for variable names.

**Rationale**: Promotes consistency by enforcing camelCase for non-constant variables.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
let myVariable = 5;
```

Invalid:

```javascript
let MyVariable = 5;
```

---

### `descriptive-vars`

**Description**: Enforces that variable names are descriptive.

**Rationale**: Helps improve code readability by ensuring variables have meaningful names.

**Options**: No additional configuration options.

**Example:**

Valid:

```javascript
let userAge = 25;
```

Invalid:

```javascript
let x = 25;
```

### Conclusion

The General rules provided by the ESLint Plugin Hub are essential for maintaining consistent coding practices across your JavaScript, TypeScript, and other related projects. These rules enforce conventions for file naming, variable declarations, function parameters, and code organization, helping to improve readability, scalability, and overall code quality. By integrating these rules, you ensure that your codebase follows industry-standard guidelines, making it easier for teams to collaborate and maintain in the long term. Proper use of these rules will result in cleaner, more maintainable, and professional-grade code.

# Node

## Node Plugin Configuration

To enhance code quality, maintainability, and enforce best practices in your Node projects, the Eslint Plugin Hub provides several Node.js-focused rules. These rules help manage code complexity and promote efficient memory usage patterns critical for server-side applications.

### Node Rules

| Rule Name                       | Description                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minimize-complexflows`         | Enforces simplified control flow by limiting recursion and nesting depth, and detecting direct or lexically scoped recursion to improve readability and reduce error potential. |
| `avoid-runtime-heap-allocation` | Discourages heap allocation of common data structures (arrays, objects, Maps, Sets) within function bodies, especially in loops, to promote reuse and reduce GC pressure.       |

### Configuration

After installing the plugin (`npm install @mindfiredigital/eslint-plugin-hub --save-dev`), you'll need to add the Node.js-specific rules or configurations from `@mindfiredigital/eslint-plugin-hub` to your ESLint configuration file (e.g., `eslintrc.config.js`,`.eslintrc.json`, `.eslintrc.js`, or `.eslintrc.yaml`).

ESLint v9+ uses `eslint.config.js` (flat config). Older versions use `.eslintrc.js` (or `.json`, `.yaml`).

**For Flat Config (e.g., `eslint.config.js`):**

You can extend a pre-defined Node.js configuration from the plugin or configure rules manually.

```javascript
// eslint.config.js
import hub from '@mindfiredigital/eslint-plugin-hub';

export default [
  {
    files: ['**/*.js', '**/*.ts'], // Or more specific files like 'src/**/*.ts'
    plugins: {
      hub: hub, // 'hub' is the prefix for your rules
    },
    languageOptions: {
      globals: {
        ...globals.node, // Recommended for Node.js projects
      },
      parserOptions: {
        ecmaVersion: 2022, // Or your target ECMAScript version
        sourceType: 'module',
      },
    },
    rules: {
      'hub/minimize-complexflows': [
        'warn',
        {
          /* options */
        },
      ],
      'hub/avoid-runtime-heap-allocation': [
        'warn',
        {
          /* options */
        },
      ],
      // ... any additional rule overrides or additions
    },
  },
];
```

### `minimize-complexflows`

**Description**: Excessive complexity in how a program flows from one instruction to another significantly increases the risk of introducing logic errors that can be hard to find. When code paths become convoluted due to deeply nested structures (like multiple if statements inside each other) or complicated recursive calls, the code becomes much more difficult for developers to read, understand, and mentally trace.

**Rationale**: This difficulty directly impacts maintainability; making changes or adding new features to overly complex code is a challenging and error-prone task. Furthermore, testing all possible paths in such code becomes exponentially harder, leading to less reliable software.

By promoting simpler, more linear, or well-structured control flows, this rule aims to make your code easier to verify, debug, and test. Code that is straightforward in its execution path is generally more robust and less prone to hidden bugs, leading to higher overall software quality and a more efficient development process. Limiting recursion to scenarios with clear, bounded termination conditions also helps prevent stack overflows and makes the recursive logic easier to reason about.

**Options**: The rule accepts a single object with the following properties:

`maxNestingDepth`

Type: number
Description: Specifies the maximum allowed depth of nested control structures (like if, for, while, switch). Nesting beyond this depth will be flagged.
Default: 3
Constraint: Must be a minimum of 1.
Example Usage:
JavaScript

```js
{
rules: { "hub/minimize-complexflows": ["warn", { "maxNestingDepth": 4 }]
}
}
```

This would allow nesting up to 4 levels deep.

`allowRecursion`

Type: boolean
Description: Determines whether recursive function calls (both direct and lexical) are permitted. If set to false, the rule will flag instances of recursion. If true, recursion checks are disabled.
Default: false (meaning recursion is flagged by default)
Example Usage:
JavaScript

```js
{
    rules: { "hub/minimize-complexflows": ["warn", { "allowRecursion": true }]
            }
}
This would allow recursive functions without ESLint warnings from this rule.
Example of Full Configuration in eslint.config.js:

JavaScript

// eslint.config.js
// ... other imports and configurations ...
{
  plugins: {
    "hub": hub,
  },
  rules: {
    "hub/minimize-complexflows": ["warn", {
      "maxNestingDepth": 2,     // Stricter nesting
      "allowRecursion": true    // Allow recursion
    }],
    // ... other rules
  }
}
// ...
```

These two options (maxNestingDepth and allowRecursion) give you control over how strictly the minimize-complex-flows rule operates in your project.

**Example:**

`"hub/minimize-complexflows": [{ "maxNestingDepth": 3, "allowRecursion": false }]`

Valid: Nesting up to 3 levels

```javascript
function processOrder(order) {
  if (order) {
    // Level 1
    if (order.items && order.items.length > 0) {
      // Level 2
      for (const item of order.items) {
        // Level 3
        console.log(item.name);
      }
    }
  }
}
```

Valid: No recursion

```javascript
function calculateSum(numbers) {
  let sum = 0;
  for (const num of numbers) {
    sum += num;
  }
  return sum;
}
```

Invalid: Nesting depth of 4 (exceeds maxNestingDepth: 3)

```javascript
function checkPermissions(user, resource, action) {
  if (user) {
    // Level 1
    if (user.roles) {
      // Level 2
      if (user.roles.includes('admin')) {
        // Level 3
        if (resource.isProtected && action === 'delete') {
          // Level 4 - ERROR
          console.log('Admin delete allowed');
          return true;
        }
      }
    }
  }
  return false;
}
```

ESLint Warning: Avoid nesting control structures deeper than 3 levels. Current depth: 4.

Invalid: Direct recursion (allowRecursion: false)

```javascript
function countdown(n) {
  if (n <= 0) {
    console.log('Blast off!');
    return;
  }
  console.log(n);
  countdown(n - 1); // ERROR: Direct recursion
}
```

ESLint Warning: Direct recursion detected in function `countdown`.

Invalid: Lexical recursion (allowRecursion: false)

```javascript
function outerTask(value) {
  console.log('Outer task:', value);
  function innerTask(innerValue) {
    if (innerValue > 0) {
      console.log('Inner task, calling outer:', innerValue);
      outerTask(innerValue - 1); // ERROR: Lexical recursion
    }
  }
  if (value > 0) {
    innerTask(value);
  }
}
```

ESLint Warning: Lexical recursion: function `outerTask` is called from an inner scope of `innerTask`

`"hub/minimize-complexflows": ["warn", { "maxNestingDepth": 2, "allowRecursion": false }]`

Valid: Nesting up to 2 levels

```javascript
function checkAccess(user) {
  if (user) {
    // Level 1
    if (user.isActive) {
      // Level 2
      return true;
    }
  }
  return false;
}
```

Invalid: Nesting depth of 3 (exceeds maxNestingDepth: 2)

```javascript
function processOrder(order) {
  if (order) {
    // Level 1
    if (order.items && order.items.length > 0) {
      // Level 2
      for (const item of order.items) {
        // Level 3 - ERROR
        console.log(item.name);
      }
    }
  }
}
```

ESLint Warning: Avoid nesting control structures deeper than 2 levels. Current depth: 3.

`"hub/minimize-complex-flows": ["warn", { "maxNestingDepth": 3, "allowRecursion": true }]`

Valid: Direct recursion is now allowed

```javascript
function factorial(n) {
  if (n <= 1) {
    return 1;
  }
  return n * factorial(n - 1); // OK, recursion allowed
}
```

Valid: Lexical recursion is now allowed

```javascript
function outerWithAllowedRecursion(value) {
  function innerCallOuter(innerValue) {
    if (innerValue > 0) {
      outerWithAllowedRecursion(innerValue - 1); // OK, recursion allowed
    }
  }
  if (value > 0) {
    innerCallOuter(value);
  }
}
```

Valid: Nesting still respects maxNestingDepth

```javascript
function normalNestingWithRecursionAllowed(data) {
  if (data) {
    // Level 1
    if (data.value > 0) {
      // Level 2
      console.log(data.value);
    }
  }
}
```

Invalid: Nesting depth of 4 (exceeds maxNestingDepth: 3), even if recursion is allowed

```javascript
function deeplyNestedButRecursionAllowed(user) {
  if (user) {
    // Level 1
    if (user.profile) {
      // Level 2
      if (user.profile.settings) {
        // Level 3
        if (user.profile.settings.isActive) {
          // Level 4 - ERROR
          console.log('User is active');
          return true;
        }
      }
    }
  }
  return false;
}
```

ESLint Warning: Avoid nesting control structures deeper than 3 levels. Current depth: 4.

### `avoid-runtime-heap-allocation`

**Description**: Description:
Encourages efficient memory management by discouraging the creation of new common data structures (arrays [], objects {}, new Map(), new Set(), etc.) directly within function bodies, and especially inside loops. This practice helps to reduce garbage collection pressure and improve performance.

Okay, I understand! You want the documentation for avoid-runtime-heap-allocation formatted precisely like the Docusaurus-style Markdown you provided for the minimize-complex-flows rule.

Here's the documentation for node/avoid-runtime-heap-allocation in that format:

node/avoid-runtime-heap-allocation
Description:
Encourages efficient memory management by discouraging the creation of new common data structures (arrays [], objects {}, new Map(), new Set(), etc.) directly within function bodies, and especially inside loops. This practice helps to reduce garbage collection pressure and improve performance.

**Rationale**: Frequent dynamic memory allocations and deallocations during an application's runtime can lead to several performance issues. These include general performance degradation due to the overhead of memory management, excessive garbage collection (GC) cycles which can pause application execution, and memory fragmentation. Over time, fragmentation can make it difficult for the system to find contiguous blocks of memory, even if sufficient total memory is free. Keeping memory usage predictable and minimizing runtime allocations are crucial for long-running, resource-intensive, or real-time applications, ensuring smoother operation and stability. This rule promotes pre-allocation and reuse of data structures where feasible.

**Options**: The rule accepts a single object with the following properties:

`checkLoopsOnly`

Type: boolean
Description: If set to true, the rule will only flag allocations that occur inside loops within functions. If false (default), it flags any such allocation found anywhere inside a function body (outside of module scope).
Default: false
Example Usage:
JSON

In your ESLint config rules section:

```js
{
rules: {"hub/avoid-runtime-heap-allocation": ["warn", { "checkLoopsOnly": true }]
}
}
```

`allowedConstructs`

Type: array of string
Description: A list of constructor names that should be exempt from this rule, allowing their allocation at runtime without warning.
Default: [] (empty array, meaning all targeted constructs are checked by default)
Enum Values: 'Array', 'Object', 'Map', 'Set', 'WeakMap', 'WeakSet'
Example Usage:
JSON

// In your ESLint config rules section:

```js
{
 rules: { "hub/avoid-runtime-heap-allocation":    ["warn", { "allowedConstructs": ["Map", "Set"] }]
}
}
```

Example of Full Configuration in eslint.config.js:

```JavaScript
// eslint.config.js
// Assuming 'hubPlugin' is your imported plugin '@mindfiredigital/eslint-plugin-hub'
// ... other imports and configurations ...
{
plugins: {
"hub": hubPlugin,
},
rules: {
"hub/avoid-runtime-heap-allocation": ["warn", {
"checkLoopsOnly": false, // Example: check everywhere in functions
"allowedConstructs": ["Set"] // Example: Allow 'new Set()'
}],
// ... other rules
}
}
// ...
```

These two options (checkLoopsOnly and allowedConstructs) give you control over how strictly the avoid-runtime-heap-allocation rule operates in your project.

**Example:**

`"hub/avoid-runtime-heap-allocation": ["warn"] which implies { "checkLoopsOnly": false, "allowedConstructs": [] }`

Valid (Should NOT produce warnings from this rule):

```javascript
// Module-scope allocations are fine
const globalArray = [];
const globalObject = {};

function usesGlobalArray(data) {
  globalArray.length = 0; // Modifying, not re-allocating
  globalArray.push(...data);
}

// Empty array/object as default parameter (ignored by rule heuristic)
function processItems(items = []) {
  console.log(items);
}
```

Invalid (Should PRODUCE warnings from this rule):

```javascript
// Allocation in a function
function processData(data) {
  const tempResults = []; // Invalid: allocationInFunction
  data.forEach(item => tempResults.push(item * 2));
  return tempResults;
}
```

ESLint Warning: Runtime allocation of 'Array' ([]) detected in function processData. Consider pre-allocating and reusing, especially if this function is called frequently or is performance-sensitive.

```JavaScript
function createConfig() {
  const config = { active: true, mode: 'test' }; // Invalid: allocationInFunction
  return config;
}
```

`ESLint Warning: Runtime allocation of 'Object' ({ active: true, mode: '...}) detected in function createConfig. Consider pre-allocating and reusing, especially if this function is called frequently or is performance-sensitive.`

```javaScript
// Allocation in a loop within a function
function processBatch(batch) {
  for (let i = 0; i < batch.length; i++) {
    const itemSpecificData = [batch[i].id, batch[i].value]; // Invalid: allocationInLoop
  }
}
```

`ESLint Warning: Runtime allocation of 'Array' ([batch[i].id, batch[i]...]) detected inside a loop within function processBatch. This can severely impact performance. Pre-allocate and reuse this structure.`

Scenario 2: Option checkLoopsOnly: true
`("hub/avoid-runtime-heap-allocation": ["warn", { "checkLoopsOnly": true }])`

Valid (Should NOT produce warnings from this rule):

```javaScript
// Allocation in a function, but NOT in a loop, is now VALID
function processData(data) {
  const tempResults = []; // Valid with checkLoopsOnly: true
  data.forEach(item => tempResults.push(item * 2));
  return tempResults;
}
Invalid (Should PRODUCE warnings from this rule):
```

```javaScript
// Allocation in a loop within a function is still INVALID
function processBatchWithLoopCheck(batch) {
  const initialItems = []; // This is VALID with checkLoopsOnly: true
  for (let i = 0; i < batch.length; i++) {
    const itemSpecificData = { id: batch[i].id }; // Invalid: allocationInLoop
  }
}
```

`ESLint Warning: Runtime allocation of 'Object' ({ id: batch[i].id }) detected inside a loop within function processBatchWithLoopCheck. This can severely impact performance. Pre-allocate and reuse this structure.`

`Scenario 3: Option allowedConstructs: ['Map']
("hub/node/avoid-runtime-heap-allocation": ["warn", { "allowedConstructs": ["Map"] }])`

Valid (Should NOT produce warnings from this rule for Map):

```javaScript
function useAllowedTypes() {
  const myMap = new Map(); // Valid: Map is in allowedConstructs

  for (let i = 0; i < 2; i++) {
    const mapInLoop = new Map(); // Valid: Map is in allowedConstructs
  }
}
```

Invalid (Should PRODUCE warnings from this rule for Array/Object):

```javaScript
function useMixedTypes() {
  const myMap = new Map(); // Valid: Map is in allowedConstructs
  const myArray = [];      // Invalid: allocationInFunction for Array

  for (let i = 0; i < 2; i++) {
    const objInLoop = { index: i }; // Invalid: allocationInLoop for Object
  }
}
```

`ESLint Warning: Runtime allocation of 'Array' ([]) detected in function useMixedTypes. Consider pre-allocating and reusing, especially if this function is called frequently or is performance-sensitive. ESLint Warning: Runtime allocation of 'Object' ({ index: i }) detected inside a loop within function useMixedTypes. This can severely impact performance. Pre-allocate and reuse this structure.`

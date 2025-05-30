# Node

## Node Plugin Configuration

To enhance code quality, maintainability, and enforce best practices in your Node projects, the Eslint Plugin Hub provides several Node.js-focused rules. These rules help manage code complexity and promote efficient memory usage patterns critical for server-side applications.

### Node Rules

| Rule Name                       | Description                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `minimize-complexflows`         | Enforces simplified control flow by limiting recursion and nesting depth, and detecting direct or lexically scoped recursion to improve readability and reduce error potential. |
| `avoid-runtime-heap-allocation` | Discourages heap allocation of common data structures (arrays, objects, Maps, Sets) within function bodies, especially in loops, to promote reuse and reduce GC pressure.       |
| `fixed-loop-bounds`             | Enforces that loops have clearly defined termination conditions to prevent infinite loops.                                                                                      |
| `no-disable-important-rules`    | Discourages disabling all rules or specific "important" ESLint rules, promoting proactive resolution of linter/compiler warnings.                                               |
| `limit-data-scope`              | Enforces best practices for data scoping, such as avoiding global object modification and preferring narrower variable scopes.                                                  |

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

## Node.js Rule Details

### 1. minimize-complexflows

**Description:**
Excessive complexity in how a program flows from one instruction to another significantly increases the risk of introducing logic errors that can be hard to find. When code paths become convoluted due to deeply nested structures (like multiple if statements inside each other) or complicated recursive calls, the code becomes much more difficult for developers to read, understand, and mentally trace.

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

### 2. avoid-runtime-heap-allocation

**Description:**
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

### 3. fixed-loop-bounds

**Description:**
This rule helps prevent infinite loops by ensuring that `while`, `do...while`, and `for` loops have clearly defined and reachable termination conditions. It specifically targets loops that use `true` as a condition or rely on external flags that are not modified within the loop body.

**Rationale:**
Infinite loops can cause applications to hang, consume excessive resources, and are a common source of bugs. Statically analyzing loop conditions helps catch these potential issues early.

**Options:**
The rule accepts an object with the following optional properties:

- `disallowInfiniteWhile` (boolean, default: `true`): If true, flags `while(true)`, `do...while(true)`, `for(;;)`, and `for(;true;)` loops that do not have an effective break statement within their body.
- `disallowExternalFlagLoops` (boolean, default: `true`): If true, flags `while` or `do...while` loops whose condition is an identifier (or its negation like `!flag`) that is not reassigned or updated within the loop's body.

**Important Implementation Details:**

- The rule performs static analysis to detect `break` statements that effectively terminate the loop
- It handles labeled break statements correctly
- It ignores breaks inside nested functions as they don't affect the outer loop
- For external flag detection, it checks for assignment expressions (`flag = value`) and update expressions (`flag++`, `++flag`, `flag--`, `--flag`)
- Modifications inside nested functions are not considered as they operate in different scopes

**Examples of Incorrect Code:**

```javascript
// Incorrect: while(true) without a break
while (true) {
  console.log('potentially infinite');
  // No break statement found
}

// Incorrect: for(;;) without a break
for (;;) {
  // This loop will run forever
  performTask();
}

// Incorrect: for loop with true condition but no break
for (; true; ) {
  console.log('infinite loop');
}

// Incorrect: External flag not modified within the loop
let keepRunning = true;
while (keepRunning) {
  // 'keepRunning' is never set to false inside this loop
  performTask();
}

// Incorrect: Negated flag condition not modified
let shouldStop = false;
while (!shouldStop) {
  // 'shouldStop' is never set to true inside this loop
  doWork();
}

// Incorrect: do-while with true condition and no break
do {
  processData();
} while (true); // No break statement in the body
```

**Examples of Correct Code:**

```javascript
// Correct: while(true) with a break
while (true) {
  if (conditionMet()) {
    break;
  }
  console.log('looping');
}

// Correct: for loop with a clear condition
for (let i = 0; i < 10; i++) {
  console.log(i);
}

// Correct: External flag modified within the loop (assignment)
let processNext = true;
while (processNext) {
  if (!processItem()) {
    processNext = false; // Flag is modified via assignment
  }
}

// Correct: External flag modified within the loop (update expression)
let counter = 10;
while (counter) {
  performTask();
  counter--; // Flag is modified via update expression
}

// Correct: Labeled break statement
outerLoop: while (true) {
  for (let i = 0; i < 5; i++) {
    if (shouldExit()) {
      break outerLoop; // Correctly targets the outer loop
    }
  }
}

// Correct: Break inside nested scope but not nested function
while (true) {
  {
    if (condition) {
      break; // This break correctly exits the while loop
    }
  }
}
```

**When Not To Use It:**
You might consider disabling `disallowExternalFlagLoops` if you have loops where the controlling flag is intentionally modified by asynchronous operations or in a deeply nested utility function whose side effects on the flag are not easily detectable by static analysis (though this is generally an anti-pattern for loop control).

### 4. no-disable-important-rules

**Description:**
This rule discourages the use of ESLint disable comments (`/* eslint-disable */`, `// eslint-disable-line`, `// eslint-disable-next-line`) in two scenarios:

1. When they are used to disable all rules (blanket disable).
2. When they are used to disable a specific set of predefined "important" rules.

The default important rules are: `no-unused-vars`, `no-console`, `no-undef`, and `eqeqeq`.

**Rationale:**
Warnings from linters and compilers often highlight potential bugs, performance issues, or security vulnerabilities. Disabling these warnings without addressing the underlying issue can lead to technical debt and more significant problems later. This rule encourages developers to fix warnings or, if a disable is truly necessary, to be specific and provide justification.

**Options:**
The rule accepts an object with the following optional property:

- `importantRules` (array of strings): Allows you to override the default list of "important" rule names that should not be disabled.
  - **Default important rules:** `['no-unused-vars', 'no-console', 'no-undef', 'eqeqeq']`
  - Example: `importantRules: ["no-debugger", "my-plugin/my-critical-rule"]`

**Supported Disable Directives:**
The rule detects and analyzes the following ESLint disable comment patterns:

- `/* eslint-disable */` - Blanket disable (always flagged)
- `/* eslint-disable-line */` - Blanket disable for current line (always flagged)
- `/* eslint-disable-next-line */` - Blanket disable for next line (always flagged)
- `/* eslint-disable rule-name */` - Specific rule disable (flagged if rule is "important")
- `/* eslint-disable rule-a, rule-b */` - Multiple specific rules (each checked individually)

**Examples of Incorrect Code:**

```javascript
/* eslint-disable */ // INCORRECT: Blanket disable of all rules
function messyCode() {
  var x = 10; // Would normally warn for 'no-unused-vars'
  console.log('Debug message left in code'); // Would normally warn for 'no-console'
}

// eslint-disable-next-line
const anotherBlanket = true; // INCORRECT: Blanket disable for the next line

// eslint-disable-line
const yetAnother = false; // INCORRECT: Blanket disable for current line

// eslint-disable-next-line no-unused-vars
const myVar = 'I am actually used later'; // INCORRECT: Disabling an important rule

/* eslint-disable no-console, no-undef */ // INCORRECT: Disabling multiple important rules
console.info('This should be logged via a proper logger');
someUndefinedVariable = value;
/* eslint-enable no-console, no-undef */

// eslint-disable-next-line eqeqeq
if (value == 'test') {
  // INCORRECT: Disabling important rule 'eqeqeq'
  doSomething();
}
```

**Examples of Correct Code:**

```javascript
// Correct: No disable comments, addressing issues directly
function cleanCode() {
  const x = 10;
  logger.info('Using proper logging instead of console'); // Fixed instead of disabled
  return x; // Using the variable instead of leaving it unused
}

// Correct: Disabling a specific, non-important rule with justification
// eslint-disable-next-line some-other-plugin/some-specific-rule -- Justification for this specific case
doSomethingSpecific();

// Correct: Using strict equality instead of disabling eqeqeq
if (value === 'test') {
  // Fixed the == vs === issue
  doSomething();
}

// Correct: Properly declaring variables instead of disabling no-undef
const someVariable = 'defined value'; // Declared instead of leaving undefined

// Correct: Using the variable instead of disabling no-unused-vars
const importantData = fetchData();
processData(importantData); // Actually using the variable
```

**Best Practices:**

- **Strict ESLint/TS Compiler Setups:** Projects should aim for the strictest possible ESLint configurations and TypeScript compiler options (e.g., `strict: true` in `tsconfig.json`).
- **Address Warnings Early:** Treating warnings as errors forces developers to address them immediately, preventing technical debt.
- **Document Disable Reasons:** Any `eslint-disable` comment should be accompanied by a clear explanation of why it's necessary.

**When Not To Use It:**
This rule might be overly restrictive during initial project scaffolding or large refactors. In such cases, it can be temporarily set to "warn" or disabled, but should be re-enabled as soon as possible.

### 5. limit-data-scope

**Description:**
Enforces best practices for data scoping, such as avoiding global object modification and preferring narrower variable scopes.

**Rationale:**
Proper data scoping helps prevent naming conflicts, makes code more maintainable, and reduces the risk of unintended side effects.

**Examples of Incorrect Code:**

```javascript
// Incorrect: Modifying global objects
global.myVariable = 'value';

// Incorrect: Using var in block scope where let/const would be better
if (condition) {
  var result = processData();
}
```

**Examples of Correct Code:**

```javascript
// Correct: Using appropriate scoping
if (condition) {
  const result = processData();
  // Use result within this scope
}

// Correct: Avoiding global modifications
const config = {
  myVariable: 'value',
};
```

## Best Practices for Node.js Project Reliability

By following these rules, you can ensure a more robust and reliable Node.js codebase. Node.js projects benefit from proactive error prevention, particularly when adhering to these development practices:

- **Prevent infinite loops with clear termination conditions**: This avoids application hangs and resource exhaustion that can crash your Node.js server.
- **Address linter warnings immediately**: This prevents technical debt accumulation and catches potential bugs before they reach production.
- **Maintain proper data scoping**: This reduces global pollution and naming conflicts that are especially problematic in Node.js's module system.

## Additional Notes

- **Customization**: If necessary, you can override these rules to fit the specific needs of your Node.js project. However, adhering to these practices is highly recommended for production stability and maintainability.
- **Performance Impact**: These rules help prevent common Node.js performance pitfalls like infinite loops and memory leaks from improper scoping.
- **Production Readiness**: Following these guidelines ensures your Node.js applications are more suitable for production environments where reliability is critical.

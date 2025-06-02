# Node

## Node Plugin Configuration

To enhance code quality, maintainability, and enforce best practices in your Node projects, the Eslint Plugin Hub provides several Node.js-focused rules. These rules help manage code complexity and promote efficient memory usage patterns critical for server-side applications.

### Node Rules

| Rule Name                       | Description                                                                                                                                                                                         |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ------------------- | ------------------------------------------------------------------------------------------ |
| `minimize-complexflows`         | Enforces simplified control flow by limiting recursion and nesting depth, and detecting direct or lexically scoped recursion to improve readability and reduce error potential.                     |
| `avoid-runtime-heap-allocation` | Discourages heap allocation of common data structures (arrays, objects, Maps, Sets) within function bodies, especially in loops, to promote reuse and reduce GC pressure.                           |
| `limit-reference-depth`         | Restricts the depth of chained property access and enforces optional chaining to prevent runtime errors, improve null safety, and encourage safer access patterns in deeply nested data structures. |
| `keep-functions-concise`        | Enforces a maximum number of lines per function, with options to skip blank lines and comments, to promote readability, maintainability, and concise logic blocks.                                  |     | `fixed-loop-bounds` | Enforces that loops have clearly defined termination conditions to prevent infinite loops. |
| `no-disable-important-rules`    | Discourages disabling all rules or specific "important" ESLint rules, promoting proactive resolution of linter/compiler warnings.                                                                   |
| `limit-data-scope`              | Enforces best practices for data scoping, such as avoiding global object modification and preferring narrower variable scopes.                                                                      |

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
      'hub/limit-reference-depth': [
        'warn',
        {
          /* options */
        },
      ],
      'hub/keep-functions-concise': [
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

### `hub/limit-reference-depth`

**Description**: Limits the depth of chained property access and enforces optional chaining to prevent runtime errors. This rule helps avoid brittle code that can crash when encountering null or undefined values in property chains, encouraging safer access patterns and better error handling.

**Rationale**: Deep chains of property access (e.g., `obj.a.b.c.d.e`) without proper validation are error-prone and lead to brittle code. Null or undefined values anywhere in the chain can cause runtime crashes, especially in large codebases or when dealing with unpredictable data shapes (e.g., JSON APIs, external configurations). This rule enforces safer patterns by limiting chain depth and requiring optional chaining (`?.`) or proper null checks, reducing `TypeError: Cannot read property 'x' of undefined` issues and making code more maintainable.

**Options**: The rule accepts a single object with the following properties:

#### `maxDepth`

- **Type**: `number`
- **Description**: Maximum allowed depth for property access chains. A depth of 1 means `obj.prop`, depth of 2 means `obj.prop.subprop`, etc.
- **Default**: `3`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "maxDepth": 2 }]
  }
}
```

#### `requireOptionalChaining`

- **Type**: `boolean`
- **Description**: When `true`, requires the use of optional chaining (`?.`) for all property access beyond the first level.
- **Default**: `true`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "requireOptionalChaining": false }]
  }
}
```

#### `allowSinglePropertyAccess`

- **Type**: `boolean`
- **Description**: When `true`, allows single-level property access without optional chaining (e.g., `obj.prop` is allowed, but `obj.prop.subprop` still requires `obj.prop?.subprop`).
- **Default**: `false`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "allowSinglePropertyAccess": true }]
  }
}
```

#### `ignoredBases`

- **Type**: `array of string`
- **Description**: Array of base identifier names that should be exempt from this rule's checks.
- **Default**: `[]`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "ignoredBases": ["config", "env"] }]
  }
}
```

#### `ignoreCallExpressions`

- **Type**: `boolean`
- **Description**: When `true`, ignores property chains that end with function calls.
- **Default**: `true`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "ignoreCallExpressions": false }]
  }
}
```

#### `ignoreImportedModules`

- **Type**: `boolean`
- **Description**: When `true`, ignores property access on imported/required modules.
- **Default**: `true`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "ignoreImportedModules": false }]
  }
}
```

#### `ignoreGlobals`

- **Type**: `boolean`
- **Description**: When `true`, ignores property access on global objects like `Math`, `JSON`, `console`, etc.
- **Default**: `true`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "ignoreGlobals": false }]
  }
}
```

#### `ignoreCommonPatterns`

- **Type**: `boolean`
- **Description**: When `true`, ignores common safe patterns like `this`, `super`, `module`, `exports`, etc.
- **Default**: `true`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/limit-reference-depth": ["warn", { "ignoreCommonPatterns": false }]
  }
}
```

#### Example Configuration

#### Full Configuration in `eslint.config.js`:

```javascript
// eslint.config.js
// Assuming 'hubPlugin' is your imported plugin '@mindfiredigital/eslint-plugin-hub'
{
  plugins: {
    "hub": hubPlugin,
  },
  rules: {
    "hub/limit-reference-depth": ["warn", {
      "maxDepth": 2,
      "requireOptionalChaining": true,
      "allowSinglePropertyAccess": false,
      "ignoredBases": ["config"],
      "ignoreCallExpressions": true,
      "ignoreImportedModules": true,
      "ignoreGlobals": true,
      "ignoreCommonPatterns": true
    }],
    // ... other rules
  }
}
```

#### Examples

#### Scenario 1: Default Configuration

`"hub/limit-reference-depth": ["warn"]` (implies all default options)

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Optional chaining from the start
const name = item?.details?.name;
const value = obj?.a?.b?.c; // Within maxDepth of 3

// Computed properties with optional chaining
const prop = obj?.[key]?.[subkey];

// Function calls with optional chaining
const result = getUser()?.profile?.name;

// Global objects (ignored by default)
const pi = Math.PI;
const data = JSON.parse(str);

// Import/require usage (ignored by default)
import lodash from 'lodash';
const result = lodash.get(obj, 'path');

// Common patterns (ignored by default)
const value = this.property;
const exp = module.exports;
```

#### ❌ Invalid (Should PRODUCE warnings):

```javascript
// Missing optional chaining
const name = item.details.name;
// ESLint Warning: Optional chaining (?.) should be used for accessing property 'details' in 'item.details'.

// Exceeding maxDepth
const deep = obj?.a?.b?.c?.d; // depth 4 > maxDepth 3
// ESLint Warning: Property access chain 'obj?.a?.b?.c?.d' (depth 4) exceeds the maximum allowed depth of 3.

// Mixed optional and non-optional chaining
const mixed = obj?.a.b?.c;
// ESLint Warning: Optional chaining (?.) should be used for accessing property 'b' in 'obj?.a.b'.

// Function calls without optional chaining
const result = getUser().profile.name;
// ESLint Warning: Optional chaining (?.) should be used for accessing property 'profile' in 'getUser().profile'.
```

#### Scenario 2: Relaxed Optional Chaining

`"hub/limit-reference-depth": ["warn", { "requireOptionalChaining": false }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Regular property access allowed
const name = item.details.name;
const value = obj.a.b.c; // Still within maxDepth

// Mixed patterns allowed
const mixed = obj.a?.b.c;
```

#### ❌ Invalid (Should PRODUCE warnings):

```javascript
// Still enforces maxDepth
const deep = obj.a.b.c.d; // depth 4 > maxDepth 3
// ESLint Warning: Property access chain 'obj.a.b.c.d' (depth 4) exceeds the maximum allowed depth of 3.
```

#### Scenario 3: Allow Single Property Access

`"hub/limit-reference-depth": ["warn", { "allowSinglePropertyAccess": true }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Single property access without optional chaining
const value = obj.prop;

// But deeper access still requires optional chaining
const name = item.details?.name;
```

#### ❌ Invalid (Should PRODUCE warnings):

```javascript
// Second level and beyond still need optional chaining
const name = item.details.name;
// ESLint Warning: Optional chaining (?.) should be used for accessing property 'name' in 'item.details.name'.
```

#### Scenario 4: Custom maxDepth

`"hub/limit-reference-depth": ["warn", { "maxDepth": 2 }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Within maxDepth of 2
const value = obj?.a?.b;
```

#### ❌ Invalid (Should PRODUCE warnings):

```javascript
// Exceeds maxDepth of 2
const deep = obj?.a?.b?.c; // depth 3 > maxDepth 2
// ESLint Warning: Property access chain 'obj?.a?.b?.c' (depth 3) exceeds the maximum allowed depth of 2.
```

#### Scenario 5: Custom Ignored Bases

`"hub/limit-reference-depth": ["warn", { "ignoredBases": ["config", "env"] }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Ignored bases can have deep access
const setting = config.database.connection.host;
const path = env.NODE_ENV.development.settings;
```

#### ❌ Invalid (Should PRODUCE warnings):

```javascript
// Non-ignored bases still follow rules
const value = data.nested.deep.property;
// ESLint Warning: Optional chaining (?.) should be used for accessing property 'nested' in 'data.nested'.
```

#### Best Practices

#### ✅ Recommended Patterns:

```javascript
// Use optional chaining for safe access
function getItemName(item) {
  return item?.details?.name || 'Unnamed Item';
}

// Destructuring with defaults
const { name = 'Unknown' } = item?.details ?? {};

// Early validation
function processUser(user) {
  if (!user?.profile?.settings) {
    throw new Error('Invalid user data');
  }
  return user.profile.settings.theme;
}

// Utility functions for complex access
function getNestedValue(obj, path, defaultValue) {
  return (
    path.split('.').reduce((current, key) => current?.[key], obj) ??
    defaultValue
  );
}
```

#### ❌ Patterns to Avoid:

```javascript
// Deep chains without safety
return item.details.name.value.label; // Brittle, can crash

// Long chains even with optional chaining
return config?.env?.settings?.meta?.internal?.key?.value; // Too complex

// Mixed safe/unsafe patterns
return user?.profile.settings.theme; // Inconsistent safety
```

### `hub/keep-functions-concise`

**Description**: Enforces a maximum number of lines per function to promote clean, modular code and better maintainability. This rule helps prevent monolithic functions that are hard to read, test, and debug by encouraging developers to break down large functions into smaller, focused, and reusable helper functions.

**Rationale**: Large, monolithic functions are a common source of technical debt and bugs. They often mix multiple responsibilities, making them difficult to understand, test, and maintain. Functions that span dozens or hundreds of lines become cognitive burdens that slow down development and increase the likelihood of errors. This rule enforces a configurable line limit to encourage separation of concerns, improve code readability, and make functions more testable and maintainable.

**Options**: The rule accepts a single object with the following properties:

#### `maxLines`

- **Type**: `number`
- **Description**: Maximum allowed number of lines per function (including function declarations, arrow functions, and function expressions).
- **Default**: `60`
- **Minimum**: `0`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/keep-functions-concise": ["warn", { "maxLines": 50 }]
  }
}
```

#### `skipBlankLines`

- **Type**: `boolean`
- **Description**: When `true`, blank lines are not counted toward the line limit.
- **Default**: `false`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/keep-functions-concise": ["warn", { "skipBlankLines": true }]
  }
}
```

#### `skipComments`

- **Type**: `boolean`
- **Description**: When `true`, comment-only lines are not counted toward the line limit. This includes single-line comments (`//`) and single-line block comments (`/* */`).
- **Default**: `false`
- **Example Usage**:

```javascript
{
  "rules": {
    "hub/keep-functions-concise": ["warn", { "skipComments": true }]
  }
}
```

#### Example Configuration

#### Full Configuration in `eslint.config.js`:

```javascript
// eslint.config.js
// Assuming 'hubPlugin' is your imported plugin '@mindfiredigital/eslint-plugin-hub'
{
  plugins: {
    "hub": hubPlugin,
  },
  rules: {
    "hub/keep-functions-concise": ["warn", {
      "maxLines": 60,
      "skipBlankLines": true,
      "skipComments": true
    }],
    // ... other rules
  }
}
```

#### Examples

#### Scenario 1: Default Configuration

`"hub/keep-functions-concise": ["warn"]` (implies `maxLines: 60`, `skipBlankLines: false`, `skipComments: false`)

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Function within line limit
function validateUserData(user) {
  if (!user || !user.name) {
    return false;
  }

  if (typeof user.name !== 'string') {
    return false;
  }

  if (user.name.trim().length === 0) {
    return false;
  }

  return true;
}

// Arrow function within limit
const transformUserData = user => {
  return {
    id: user.id,
    name: user.name.toUpperCase(),
    email: user.email?.toLowerCase(),
    createdAt: new Date().toISOString(),
  };
};

// Concise arrow function (single expression)
const getUserId = user => user?.id || null;

// Function expression within limit
const processUser = function (user) {
  const isValid = validateUserData(user);
  if (!isValid) {
    throw new Error('Invalid user data');
  }

  const transformed = transformUserData(user);
  return saveUser(transformed);
};
```

#### ❌ Invalid (Should PRODUCE warnings):

```javascript
// Function exceeding line limit (assumes > 60 lines)
function processUserWithEverything(user) {
  // Validation logic (15 lines)
  if (!user) throw new Error('User is required');
  if (!user.name) throw new Error('Name is required');
  if (!user.email) throw new Error('Email is required');
  if (typeof user.name !== 'string') throw new Error('Name must be string');
  if (typeof user.email !== 'string') throw new Error('Email must be string');
  if (user.name.trim().length === 0) throw new Error('Name cannot be empty');
  if (!user.email.includes('@')) throw new Error('Invalid email format');

  // Transformation logic (20 lines)
  const normalizedName = user.name.trim().toLowerCase();
  const normalizedEmail = user.email.trim().toLowerCase();
  const slug = normalizedName.replace(/\s+/g, '-');
  const initials = normalizedName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  // Persistence logic (15 lines)
  const existingUser = database.users.findByEmail(normalizedEmail);
  if (existingUser) {
    database.users.update(existingUser.id, {
      name: normalizedName,
      slug: slug,
      initials: initials,
      updatedAt: new Date(),
    });
  } else {
    database.users.create({
      name: normalizedName,
      email: normalizedEmail,
      slug: slug,
      initials: initials,
      createdAt: new Date(),
    });
  }

  // Logging and cleanup (10+ more lines)...
}
// ESLint Warning: Function "processUserWithEverything" has 85 lines (max 60 allowed). (no lines skipped by options)
```

#### Scenario 2: Skip Blank Lines

`"hub/keep-functions-concise": ["warn", { "skipBlankLines": true }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Function with many blank lines for readability
function calculateTotalPrice(items) {
  let subtotal = 0;

  for (const item of items) {
    subtotal += item.price * item.quantity;
  }

  const taxRate = 0.08;
  const tax = subtotal * taxRate;

  const shippingCost = subtotal > 100 ? 0 : 10;

  return {
    subtotal,
    tax,
    shipping: shippingCost,
    total: subtotal + tax + shippingCost,
  };
}
// Blank lines are not counted, so this stays within limits
```

#### Scenario 3: Skip Comments

`"hub/keep-functions-concise": ["warn", { "skipComments": true }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Well-documented function with many comment lines
function complexBusinessLogic(data) {
  // Step 1: Validate input data
  // This is critical for preventing downstream errors
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid input data');
  }

  // Step 2: Initialize processing variables
  // We need these for the calculation loop
  let result = 0;
  let processed = 0;

  // Step 3: Process each item in the data
  // The algorithm here implements the XYZ business rule
  for (const item of data.items) {
    // Skip invalid items to prevent corruption
    if (!item.value || item.value < 0) {
      continue;
    }

    // Apply the business transformation
    // This formula was provided by the business team
    result += item.value * 1.5;
    processed++;
  }

  // Step 4: Apply final adjustments
  // These adjustments are required by regulation ABC
  if (processed > 10) {
    result *= 0.95; // Volume discount
  }

  /* Final validation before return */
  return Math.round(result * 100) / 100;
}
// Comment lines are not counted toward the limit
```

#### Scenario 4: Combined Options

`"hub/keep-functions-concise": ["warn", { "maxLines": 30, "skipBlankLines": true, "skipComments": true }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Shorter limit but with generous skipping
function moderateFunction(input) {
  // This function has a lower line limit
  // but comments and blank lines don't count

  const step1 = processStep1(input);

  // Intermediate processing
  const step2 = processStep2(step1);

  // Final transformation
  return finalizeResult(step2);
}
```

#### Scenario 5: Zero Line Limit (Extreme)

`"hub/keep-functions-concise": ["error", { "maxLines": 0 }]`

#### ✅ Valid (Should NOT produce warnings):

```javascript
// Only concise arrow functions allowed
const add = (a, b) => a + b;
const getName = user => user?.name || 'Anonymous';
const isValid = data => data && data.length > 0;
```

#### ❌ Invalid (Should PRODUCE warnings):

```javascript
// Any function with a block body violates maxLines: 0
function greet(name) {
  return `Hello, ${name}!`;
}
// ESLint Warning: Function "greet" has 1 lines (max 0 allowed). (no lines skipped by options)

const multiply = (a, b) => {
  return a * b;
};
// ESLint Warning: Function "[anonymous_function]" has 1 lines (max 0 allowed). (no lines skipped by options)
```

#### Best Practices

#### ✅ Recommended Patterns:

```javascript
// Break down large functions into focused helpers
function validateUser(user) {
  if (!user) throw new Error('User is required');
  if (!user.name) throw new Error('Name is required');
  if (!user.email) throw new Error('Email is required');
  return true;
}

function transformUser(user) {
  return {
    name: user.name.trim().toLowerCase(),
    email: user.email.trim().toLowerCase(),
    slug: user.name.replace(/\s+/g, '-'),
  };
}

function saveUser(userData) {
  return database.users.create({
    ...userData,
    createdAt: new Date(),
  });
}

// Main function orchestrates the helpers
function processUser(user) {
  validateUser(user);
  const transformed = transformUser(user);
  return saveUser(transformed);
}

// Use meaningful function names that describe purpose
function calculateShippingCost(subtotal, location) {
  if (subtotal > 100) return 0;
  return location === 'domestic' ? 10 : 25;
}

// Extract complex conditions into named functions
function isEligibleForDiscount(user, order) {
  return user.isPremium && order.total > 200;
}

function processOrder(user, order) {
  if (isEligibleForDiscount(user, order)) {
    order.total *= 0.9;
  }
  return order;
}
```

#### ❌ Patterns to Avoid:

```javascript
// Monolithic function doing everything
function handleUserRegistration(userData) {
  // 50+ lines of validation logic
  // 30+ lines of data transformation
  // 20+ lines of database operations
  // 15+ lines of email sending
  // 10+ lines of logging and cleanup
  // This function is doing too many things!
}

// Overly long functions even with good structure
function complexCalculation(input) {
  // Even if well-organized, 100+ lines in one function
  // is usually a sign that it should be broken down
  // into smaller, testable pieces
}

// Functions with unclear responsibilities
function doEverything(data) {
  // When the function name doesn't clearly indicate
  // what it does, it's often too complex
}
```

#### Benefits

- **Improved Readability**: Shorter functions are easier to understand at a glance
- **Better Testability**: Small functions with single responsibilities are easier to unit test
- **Reduced Bugs**: Less code per function means fewer places for bugs to hide
- **Enhanced Maintainability**: Changes to small functions have limited blast radius
- **Code Reusability**: Well-factored helper functions can often be reused elsewhere
- **Easier Code Reviews**: Reviewers can more easily understand and verify small functions
- **Better Separation of Concerns**: Forces developers to think about function responsibilities

## Best Practices for Node.js Project Reliability

By following these rules, you can ensure a more robust and reliable Node.js codebase. Node.js projects benefit from proactive error prevention, particularly when adhering to these development practices:

- **Prevent infinite loops with clear termination conditions**: This avoids application hangs and resource exhaustion that can crash your Node.js server.
- **Address linter warnings immediately**: This prevents technical debt accumulation and catches potential bugs before they reach production.
- **Maintain proper data scoping**: This reduces global pollution and naming conflicts that are especially problematic in Node.js's module system.

## Additional Notes

- **Customization**: If necessary, you can override these rules to fit the specific needs of your Node.js project. However, adhering to these practices is highly recommended for production stability and maintainability.
- **Performance Impact**: These rules help prevent common Node.js performance pitfalls like infinite loops and memory leaks from improper scoping.
- **Production Readiness**: Following these guidelines ensures your Node.js applications are more suitable for production environments where reliability is critical.

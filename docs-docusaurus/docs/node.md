# Node

This section details ESLint rules provided by `@mindfiredigital/eslint-plugin-hub` that are particularly relevant for Node.js development, focusing on best practices, preventing common pitfalls, and enhancing code reliability.

## Node.js Rules Overview

| Rule Name                    | Description                                                                                                                       |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `fixed-loop-bounds`          | Enforces that loops have clearly defined termination conditions to prevent infinite loops.                                        |
| `no-disable-important-rules` | Discourages disabling all rules or specific "important" ESLint rules, promoting proactive resolution of linter/compiler warnings. |
| `limit-data-scope`           | Enforces best practices for data scoping, such as avoiding global object modification and preferring narrower variable scopes.    |

## How to Configure Node.js Rules

To enable these Node.js rules, add them to your ESLint configuration file.

### Flat Configuration Example (`eslint.config.mjs` or `eslint.config.js`)

```javascript
// eslint.config.mjs
import hubPlugin from '@mindfiredigital/eslint-plugin-hub';
import globals from 'globals';

export default [
  {
    plugins: {
      hub: hubPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node, // Essential for Node.js environment
      },
    },
    rules: {
      'hub/fixed-loop-bounds': [
        'error',
        {
          disallowInfiniteWhile: true,
          disallowExternalFlagLoops: true,
        },
      ],
      'hub/no-disable-important-rules': [
        'error',
        {
          // importantRules: ['no-console', 'no-undef'] // Optional: override default important rules
        },
      ],
      'hub/limit-data-scope': 'warn', // Example severity
      // Add other ESLint core or plugin rules as needed
    },
  },
];
```

### Legacy Configuration Example (`.eslintrc.json`)

```json
{
  "env": {
    "node": true,
    "es2021": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@mindfiredigital/hub"],
  "rules": {
    "@mindfiredigital/hub/fixed-loop-bounds": [
      "error",
      {
        "disallowInfiniteWhile": true,
        "disallowExternalFlagLoops": true
      }
    ],
    "@mindfiredigital/hub/no-disable-important-rules": [
      "error",
      {
        // "importantRules": ["no-console", "no-undef"]
      }
    ],
    "@mindfiredigital/hub/limit-data-scope": "warn"
  }
}
```

## Node.js Rule Details

### 1. fixed-loop-bounds

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

### 2. no-disable-important-rules

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

### 3. limit-data-scope

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

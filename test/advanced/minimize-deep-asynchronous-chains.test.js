// test/general/minimize-deep-asynchronous-chains.test.js
const { RuleTester } = require('eslint');
const rule =
  require('../../lib/rules/advanced/plugin/minimize-deep-asynchronous-chains')
    .rules['minimize-deep-asynchronous-chains'];

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2020, sourceType: 'module' },
});

ruleTester.run('minimize-deep-asynchronous-chains', rule, {
  valid: [
    // Promise Chains - Valid cases (within limits)
    {
      code: `fetch().then(res => res.json());`,
      name: 'Single .then() call',
    },
    {
      code: `fetch().then(res => res.json()).then(data => console.log(data));`,
      name: 'Two chained .then() calls',
    },
    {
      code: `fetch().then().catch().finally();`,
      name: 'Mixed .then(), .catch(), .finally() - exactly at limit',
    },
    {
      code: `promise.then(a => a).catch(err => console.error(err));`,
      name: 'Promise with .then() and .catch()',
    },
    {
      code: `new Promise(resolve => resolve()).then(x => x).finally(() => {});`,
      name: 'new Promise with chain',
    },

    // Nested Promise chains (each individual chain is within limits)
    {
      code: `
        functionA().then(() => {
          return functionB().then(res => res); // Inner chain length 1
        }).then(final => console.log(final)); // Outer chain length 2
      `,
      name: 'Nested promise chains within limits',
    },

    // Async/Await - Valid cases
    {
      code: `async function foo() { await p1; }`,
      name: 'Single await',
    },
    {
      code: `async function foo() { await p1; await p2; }`,
      name: 'Two awaits',
    },
    {
      code: `async function foo() { await p1; await p2; await p3; }`,
      name: 'Three awaits - at limit',
    },
    {
      code: `
        async function bar() {
          await step1();
          if (condition) {
            await step2(); // Still in same function scope
          }
          await step3();
        }
      `,
      name: 'Conditional await within limits',
    },
    {
      code: `
        async function outer() {
          await p1(); // 1 for outer

          async function inner() {
            await p2(); // 1 for inner (separate function)
            await p3(); // 2 for inner
            await p4(); // 3 for inner
          }

          await inner(); // 2 for outer
          await something(); // 3 for outer
        }
      `,
      name: 'Nested async functions - each within limits',
    },
    {
      code: `
        const asyncArrow = async () => {
          const a = await op1();
          const b = await op2(a);
          return await op3(b);
        };
      `,
      name: 'Async arrow function with 3 awaits',
    },

    // Custom configuration tests
    {
      code: `fetch().then().then().then().then();`,
      options: [{ maxPromiseChainLength: 4 }],
      name: 'Chain of 4 allowed with custom config',
    },
    {
      code: `async function foo() { await p1; await p2; await p3; await p4; }`,
      options: [{ maxAwaitExpressions: 4 }],
      name: '4 awaits allowed with custom config',
    },
    {
      code: `fetch().then().then();`,
      options: [{ maxPromiseChainLength: 5, maxAwaitExpressions: 1 }],
      name: 'Different limits for promises vs awaits',
    },

    // Edge cases
    {
      code: `
        // Regular function calls (not promises)
        func1().func2().func3().func4();
      `,
      name: 'Non-promise method chaining should be ignored',
    },
    {
      code: `
        async function test() {
          const promise = createPromise();
          // await in different statements
          const a = await promise;
          const b = await processA(a);
          const c = await processB(b);
        }
      `,
      name: 'Awaits with intermediate variables',
    },
  ],

  invalid: [
    // Promise Chain violations
    {
      code: `fetch().then().then().then().then();`,
      errors: [
        {
          messageId: 'tooManyThenCalls',
          data: { functionName: 'fetch()', count: 4, maxCount: 3 },
        },
      ],
      name: 'fetch() chain exceeding limit',
    },
    {
      code: `myPromise.then(a).catch(b).then(c).finally(d);`,
      errors: [
        {
          messageId: 'tooManyThenCalls',
          data: { functionName: 'myPromise', count: 4, maxCount: 3 },
        },
      ],
      name: 'Named promise chain exceeding limit',
    },
    {
      code: `api.getData().then().then().then().catch();`,
      errors: [
        {
          messageId: 'tooManyThenCalls',
          data: { functionName: 'getData()', count: 4, maxCount: 3 },
        },
      ],
      name: 'Method call promise chain exceeding limit',
    },
    {
      code: `new Promise(resolve => resolve(1)).then().then().then().finally();`,
      errors: [
        {
          messageId: 'tooManyThenCalls',
          data: { functionName: 'new Promise()', count: 4, maxCount: 3 },
        },
      ],
      name: 'new Promise chain exceeding limit',
    },

    // Async/Await violations
    {
      code: `async function foo() { await p1; await p2; await p3; await p4; }`,
      errors: [
        {
          messageId: 'tooManyAwaitExpressions',
          data: { functionName: 'foo', count: 4, maxCount: 3 },
        },
      ],
      name: 'Named async function exceeding await limit',
    },
    {
      code: `
        const bar = async () => {
          await s1;
          let x = await s2;
          if (x) { await s3; }
          await s4;
          try { await s5; } catch (e) {}
        };
      `,
      errors: [
        {
          messageId: 'tooManyAwaitExpressions',
          data: { functionName: 'bar', count: 5, maxCount: 3 },
        },
      ],
      name: 'Async arrow function with complex control flow',
    },
    {
      code: `
        async function processData(data) {
          const validated = await validateData(data);
          const transformed = await transformData(validated);
          const enriched = await enrichData(transformed);
          const saved = await saveData(enriched);
          const notification = await sendNotification(saved);
          return notification;
        }
      `,
      errors: [
        {
          messageId: 'tooManyAwaitExpressions',
          data: { functionName: 'processData', count: 5, maxCount: 3 },
        },
      ],
      name: 'Real-world async function with sequential operations',
    },

    // Custom configuration violations
    {
      code: `fetch().then().then().then();`,
      options: [{ maxPromiseChainLength: 2 }],
      errors: [
        {
          messageId: 'tooManyThenCalls',
          data: { functionName: 'fetch()', count: 3, maxCount: 2 },
        },
      ],
      name: 'Chain violation with custom limit',
    },
    {
      code: `async function foo() { await p1; await p2; await p3; }`,
      options: [{ maxAwaitExpressions: 2 }],
      errors: [
        {
          messageId: 'tooManyAwaitExpressions',
          data: { functionName: 'foo', count: 3, maxCount: 2 },
        },
      ],
      name: 'Await violation with custom limit',
    },
    {
      code: `
        async function complexFlow() {
          await step1();
          await step2();
          await step3();
          await step4();
        }
      `,
      options: [{ maxPromiseChainLength: 10, maxAwaitExpressions: 3 }],
      errors: [
        {
          messageId: 'tooManyAwaitExpressions',
          data: { functionName: 'complexFlow', count: 4, maxCount: 3 },
        },
      ],
      name: 'Only await limit violated with mixed config',
    },

    // Real-world examples from the specification
    {
      code: `
        async function originalProblem(id) {
          const r1 = await op1(id);
          const r2 = await op2(r1);
          const r3 = await op3(r2);
          const r4 = await op4(r3);
          const r5 = await op5(r4);
          return r5;
        }
      `,
      errors: [
        {
          messageId: 'tooManyAwaitExpressions',
          data: { functionName: 'originalProblem', count: 5, maxCount: 3 },
        },
      ],
      name: 'Sequential async operations example',
    },
    {
      code: `
        fetch('/api/complex-data')
          .then(response => response.json())
          .then(data => firstProcessing(data))
          .then(intermediate => secondProcessing(intermediate))
          .then(finalData => displayResult(finalData));
      `,
      errors: [
        {
          messageId: 'tooManyThenCalls',
          data: { functionName: 'fetch()', count: 4, maxCount: 3 },
        },
      ],
      name: 'Complex data processing chain example',
    },

    // Mixed violations (both types in same test case)
    {
      code: `
        async function mixedViolations() {
          // This function has too many awaits
          await step1();
          await step2();
          await step3();
          await step4();

          // And also creates a long promise chain
          return fetch('/data')
            .then(res => res.json())
            .then(data => process1(data))
            .then(result => process2(result))
            .then(final => final);
        }
      `,
      errors: [
        {
          messageId: 'tooManyAwaitExpressions',
          data: { functionName: 'mixedViolations', count: 4, maxCount: 3 },
        },
        {
          messageId: 'tooManyThenCalls',
          data: { functionName: 'fetch()', count: 4, maxCount: 3 },
        },
      ],
      name: 'Function with both await and promise chain violations',
    },
  ],
});

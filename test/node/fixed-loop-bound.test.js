'use strict';

const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
  },
});

ruleTester.run('fixed-loop-bounds', rules['fixed-loop-bounds'], {
  valid: [
    // Standard for loop
    'for (let i = 0; i < 10; i++) { console.log(i); }',
    // While loop with condition modified internally
    'let flag = true; while (flag) { if (Math.random() > 0.5) flag = false; }',
    'let c = 0; while (c < 5) { c++; }',
    // While(true) with a break
    'while (true) { if (Math.random() > 0.5) break; }',
    // For(;;) with a break
    'for (;;) { if (Math.random() > 0.5) break; }',
    // For(;true;) with a break
    'for (;true;) { if (Math.random() > 0.5) break; }',
    // Do-while with condition modified
    'let x = 0; do { x++; } while (x < 5);',
    // Do-while(true) with a break
    'do { if (Math.random() > 0.5) break; } while (true);',
    // For-of and For-in are generally bounded
    'for (const item of [1,2,3]) { console.log(item); }',
    'const obj = {a:1}; for (const key in obj) { console.log(key); }',
    // Flag modified in loop (negated condition)
    'let keepGoing = true; while (!keepGoing === false) { keepGoing = false; }',
    {
      code: 'let run = true; while(run) { if (someCondition()) { run = false; } }',
      options: [{ disallowExternalFlagLoops: true }],
    },
    {
      // Assumed checkStatus could return false
      options: [{ disallowExternalFlagLoops: true }],
    },
    // Break in a nested block but for the correct loop
    'while(true) { if (true) { if (false) {} else { break; } } }',
    // Labeled break
    `
    outer: while (true) {
        inner: while(true) {
            if (someCondition) break outer;
            if (otherCondition) break inner;
        }
    }
    `,
  ],
  invalid: [
    {
      code: 'while (true) { console.log("infinite"); }',
      errors: [{ messageId: 'infiniteWhileTrueLoop' }],
    },
    {
      code: 'for (;;) { console.log("infinite"); }',
      errors: [{ messageId: 'infiniteForLoopNoTest' }],
    },
    {
      code: 'for (;true;) { console.log("infinite"); }',
      errors: [{ messageId: 'infiniteForLoopTrueTest' }],
    },
    {
      code: 'do { console.log("infinite"); } while (true);',
      errors: [{ messageId: 'infiniteDoWhileTrueLoop' }],
    },
    {
      code: 'let externalFlag = true; while (externalFlag) { console.log("looping"); }',
      options: [{ disallowExternalFlagLoops: true }],
      errors: [
        {
          messageId: 'externalFlagWhileLoop',
          data: { flagName: 'externalFlag' },
        },
      ],
    },
    {
      code: 'let anotherFlag = true; function loop() { while (anotherFlag) { console.log("loop"); } }',
      options: [{ disallowExternalFlagLoops: true }],
      errors: [
        {
          messageId: 'externalFlagWhileLoop',
          data: { flagName: 'anotherFlag' },
        },
      ],
    },
    {
      code: 'let stop = false; while (!stop) { /* stop not changed */ }',
      options: [{ disallowExternalFlagLoops: true }],
      errors: [
        { messageId: 'externalFlagWhileLoop', data: { flagName: 'stop' } },
      ],
    },
    {
      code: 'let condition = true; do { console.log("body"); } while (condition);',
      options: [{ disallowExternalFlagLoops: true }],
      errors: [
        {
          messageId: 'externalFlagDoWhileLoop',
          data: { flagName: 'condition' },
        },
      ],
    },
    // disallowInfiniteWhile: false, but external flag loop is still caught
    {
      code: 'let flag = true; while (flag) { }',
      options: [
        { disallowInfiniteWhile: false, disallowExternalFlagLoops: true },
      ],
      errors: [
        { messageId: 'externalFlagWhileLoop', data: { flagName: 'flag' } },
      ],
    },
    // disallowExternalFlagLoops: false, but while(true) is still caught
    {
      code: 'while(true) { }',
      options: [
        { disallowInfiniteWhile: true, disallowExternalFlagLoops: false },
      ],
      errors: [{ messageId: 'infiniteWhileTrueLoop' }],
    },
    // Break in nested loop, does not save outer while(true)
    {
      code: 'while(true) { for(let i=0;i<1;i++) { break; } }',
      errors: [{ messageId: 'infiniteWhileTrueLoop' }],
    },
    // Break in switch, does not save outer while(true)
    {
      code: 'while(true) { switch(val) { case 1: break; default: foo(); } }',
      errors: [{ messageId: 'infiniteWhileTrueLoop' }],
    },
  ],
});

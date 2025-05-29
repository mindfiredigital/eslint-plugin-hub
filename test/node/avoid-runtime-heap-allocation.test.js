const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

ruleTester.run(
  'avoid-runtime-heap-allocation',
  rules['avoid-runtime-heap-allocation'],
  {
    valid: [
      // Allocations at module scope (outside functions)
      { code: 'const moduleScopeArray = [];' },
      { code: 'const moduleScopeObject = {};' },
      { code: 'const moduleScopeMap = new Map();' },
      { code: 'const moduleScopeSet = new Set();' },

      // Empty arrays/objects as default function parameters (ignored by heuristic)
      { code: 'function foo(arr = []) {}' },
      { code: 'function bar(obj = {}) {}' },
      { code: 'const baz = (arr = []) => {};' },

      // Allocations inside functions when 'checkLoopsOnly' is true and not in a loop
      {
        code: 'function allocateNoLoop() { const arr = []; const obj = {}; const m = new Map(); }',
        options: [{ checkLoopsOnly: true }],
      },

      // Allocations of 'allowedConstructs'
      {
        code: 'function allocateAllowed() { const m = new Map(); const s = new Set(); }',
        options: [{ allowedConstructs: ['Map', 'Set'] }],
      },
      {
        code: 'function allocateAllowedInLoop() { for(let i=0; i<1; i++) { const m = new Map(); } }',
        options: [{ allowedConstructs: ['Map'] }],
      },
      // This test case was previously problematic due to combined errors. It's now for an invalid scenario.
      // We will test the "allowedConstructs" logic with an explicit invalid case below.

      // Function returning an array/object - valid if checkLoopsOnly=true or if construct is allowed
      {
        code: 'function createArray() { return []; }',
        options: [{ checkLoopsOnly: true }],
      },
      {
        code: 'function createObject() { return {}; }',
        options: [{ allowedConstructs: ['Object'] }],
      },
      {
        // Moved from invalid: This pattern is valid according to the rule's logic
        code: `const reusableBuffer = [];
                   function processIncomingData(newData) {
                     reusableBuffer.length = 0;
                     reusableBuffer.push(...newData);
                   }`,
      },
    ],
    invalid: [
      // Moved from valid: This should be flagged by the rule's current logic
      {
        code: 'let a; function init() { a = []; } init();',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Array',
              functionName: 'init',
              nodeText: '[]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
      // --- Allocations in Function (checkLoopsOnly = false by default) ---
      {
        code: 'function funcArray() { const arr = [1, 2]; }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Array',
              functionName: 'funcArray',
              nodeText: '[1, 2]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
      {
        code: 'function funcObject() { const obj = { a: 1 }; }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Object',
              functionName: 'funcObject',
              nodeText: '{ a: 1 }',
            },
            type: 'ObjectExpression',
          },
        ],
      },
      {
        code: 'function funcNewArray() { const arr = new Array(); }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Array',
              functionName: 'funcNewArray',
              nodeText: 'new Array()',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'function funcNewObject() { const obj = new Object(); }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Object',
              functionName: 'funcNewObject',
              nodeText: 'new Object()',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'function funcNewMap() { const m = new Map(); }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Map',
              functionName: 'funcNewMap',
              nodeText: 'new Map()',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'function funcNewSet() { const s = new Set(); }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Set',
              functionName: 'funcNewSet',
              nodeText: 'new Set()',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'function funcNewWeakMap() { const wm = new WeakMap(); }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'WeakMap',
              functionName: 'funcNewWeakMap',
              nodeText: 'new WeakMap()',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'function funcNewWeakSet() { const ws = new WeakSet(); }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'WeakSet',
              functionName: 'funcNewWeakSet',
              nodeText: 'new WeakSet()',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'const arrowFuncAlloc = () => { const arr = []; };',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Array',
              functionName: 'arrowFuncAlloc',
              nodeText: '[]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
      {
        code: 'const exprFuncAlloc = function() { const obj = {}; };',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Object',
              functionName: 'exprFuncAlloc',
              nodeText: '{}',
            },
            type: 'ObjectExpression',
          },
        ],
      },
      {
        code: 'class MyClass { myMethod() { const arr = []; } }',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Array',
              functionName: 'myMethod',
              nodeText: '[]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
      {
        code: 'const myObj = { myMethod() { const arr = []; } };',
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Array',
              functionName: 'myMethod',
              nodeText: '[]',
            },
            type: 'ArrayExpression',
          },
        ],
      },

      // --- Allocations in Loop (checkLoopsOnly = false by default OR true) ---
      {
        code: 'function loopArray() { for(let i=0; i<5; i++) { const arr = [i]; } }',
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Array',
              functionName: 'loopArray',
              nodeText: '[i]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
      {
        code: 'function loopObject(items) { for(const item of items) { const obj = { item }; } }',
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Object',
              functionName: 'loopObject',
              nodeText: '{ item }',
            },
            type: 'ObjectExpression',
          },
        ],
      },
      {
        code: 'function loopNewArray() { let x=0; while(x<2){ const arr = new Array(x); x++;} }',
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Array',
              functionName: 'loopNewArray',
              nodeText: 'new Array(x)',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'function loopNewMap() { let c=true; do { const m = new Map(); c=false; } while(c) }',
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Map',
              functionName: 'loopNewMap',
              nodeText: 'new Map()',
            },
            type: 'NewExpression',
          },
        ],
      },
      {
        code: 'function outerLoop() { function inner() { for(let i=0;i<1;i++){ const s = new Set();}} inner(); }',
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Set',
              functionName: 'inner',
              nodeText: 'new Set()',
            },
            type: 'NewExpression',
          },
        ],
      },

      // --- Test options: checkLoopsOnly = true ---
      {
        code: 'function loopArrayOpt() { for(let i=0; i<5; i++) { const arr = [i]; } }',
        options: [{ checkLoopsOnly: true }],
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Array',
              functionName: 'loopArrayOpt',
              nodeText: '[i]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
      {
        code: 'function loopObjectOpt(items) { for(const item of items) { const obj = { item }; } }',
        options: [{ checkLoopsOnly: true }],
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Object',
              functionName: 'loopObjectOpt',
              nodeText: '{ item }',
            },
            type: 'ObjectExpression',
          },
        ],
      },
      {
        code: 'function loopNewMapOpt() { let c=true; do { const m = new Map(); c=false; } while(c) }',
        options: [{ checkLoopsOnly: true }],
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Map',
              functionName: 'loopNewMapOpt',
              nodeText: 'new Map()',
            },
            type: 'NewExpression',
          },
        ],
      },

      // --- Test options: allowedConstructs ---
      {
        // Array allocation in loop, but Map is allowed (Array should still be flagged)
        code: 'function allocateNonAllowedInLoop() { for(let i=0; i<1; i++) { const arr = []; } }',
        options: [{ allowedConstructs: ['Map'] }],
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Array',
              functionName: 'allocateNonAllowedInLoop',
              nodeText: '[]',
            },
          },
        ],
      },
      {
        // Array allocation in function, Map is allowed (Array should still be flagged)
        code: 'function mixedAllowedFunc() { const arr = []; const m = new Map(); }',
        options: [{ allowedConstructs: ['Map'] }],
        errors: [
          {
            messageId: 'allocationInFunction',
            data: {
              constructType: 'Array',
              functionName: 'mixedAllowedFunc',
              nodeText: '[]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
      {
        // Original "DON'T" example from problem statement
        code: `function handleLargeBatch(batch) {
                     for (let i = 0; i < batch.length; i++) {
                       const tempArray = [batch[i]];
                     }
                   }`,
        errors: [
          {
            messageId: 'allocationInLoop',
            data: {
              constructType: 'Array',
              functionName: 'handleLargeBatch',
              nodeText: '[batch[i]]',
            },
            type: 'ArrayExpression',
          },
        ],
      },
    ],
  }
);

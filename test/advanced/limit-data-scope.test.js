// eslint-plugin-hub/test/general/limit-data-scope.test.js
const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    globals: {
      window: 'writable',
      global: 'writable',
      globalThis: 'writable',
      document: 'readonly',
      crypto: 'readonly',
      process: 'readonly',
      navigator: 'readonly',
      location: 'readonly',
      setTimeout: 'readonly',
      getWindow: 'readonly',
      alert: 'readonly',
      console: 'readonly',
    },
  },
});

ruleTester.run('limit-data-scope', rules['limit-data-scope'], {
  valid: [
    // === Section 1: Valid for "No Global Object Modification" ===
    { code: 'const myVar = {}; myVar.prop = 1;' },
    { code: 'function foo() { let window = {}; window.bar = 1; }' },
    { code: 'function bar() { let global = {}; global.test = 2; }' },
    { code: 'const obj = { window: {} }; obj.window.prop = 1;' },
    { code: 'let globalThis = {}; globalThis.custom = true;' },
    { code: 'const config = window.location || {};' }, // Reading is OK
    { code: 'console.log(global.process);' }, // Reading is OK
    { code: 'const val = globalThis.crypto;' }, // Reading is OK

    // === Section 2: Valid for "Narrowest Scope" ===
    {
      // Variable used in multiple functions - should stay at module level
      code: `
        const sharedVar = 10;
        function funcA() { console.log(sharedVar); }
        function funcB() { console.log(sharedVar); }
      `,
    },
    {
      // Variable used at module scope and in function - should stay at module level
      code: `
        const moduleVar = 20;
        console.log(moduleVar); // Used at module scope
        function useIt() { console.log(moduleVar); }
      `,
    },
    {
      // Variable already in narrowest scope
      code: `
        function doSomething() {
          const localVar = 30; // Already narrowest scope
          console.log(localVar);
        }
      `,
    },
    {
      // Variable used in nested scopes within same function
      code: `
        function outer() {
          const outerVar = 'test';
          if (true) {
            console.log(outerVar);
          }
          for (let i = 0; i < 1; i++) {
            console.log(outerVar);
          }
        }
      `,
    },
    {
      // Imported variables should not be flagged
      code: `import { someFunction } from 'module'; someFunction();`,
    },
    {
      // Function parameters should not be flagged
      code: `
        function test(param) {
          function inner() {
            console.log(param);
          }
          inner();
        }
      `,
    },
    {
      // Variable used in function but also assigned at module level
      code: `
        let config = { default: true };
        function setup() {
          console.log(config);
        }
        config = { updated: true }; // Also used at module level
      `,
    },

    // === Section 3: Valid for "Discourage var" (i.e., uses let/const) ===
    { code: 'let x = 1;' },
    { code: 'const y = 2;' },
    { code: 'for (let i = 0; i < 5; i++) {}' },
    { code: 'function test() { const local = 1; return local; }' },
    { code: 'if (true) { let blockScoped = true; }' },
  ],

  invalid: [
    // === Section 1: Invalid for "No Global Object Modification" ===
    {
      code: 'window.myCustomProperty = 123;',
      errors: [
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'window', propertyName: 'myCustomProperty' },
        },
      ],
    },
    {
      code: 'global.debug = true;',
      errors: [
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'global', propertyName: 'debug' },
        },
      ],
    },
    {
      code: 'globalThis["newProperty"] = "value";',
      errors: [
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'globalThis', propertyName: 'newProperty' },
        },
      ],
    },
    {
      code: 'window[dynamicKey] = result;',
      errors: [
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'window', propertyName: 'dynamicKey' },
        },
      ],
    },
    {
      code: 'global.process.env.NODE_ENV = "test";',
      errors: [
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'global', propertyName: 'process' },
        },
      ],
    },
    {
      code: 'function setup() { window.customHandler = function() {}; }',
      errors: [
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'window', propertyName: 'customHandler' },
        },
      ],
    },
    {
      code: 'globalThis[42] = "answer";',
      errors: [
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'globalThis', propertyName: '42' },
        },
      ],
    },

    // === Section 2: Invalid for "Narrowest Scope" ===
    {
      code: `
        const onlyInFuncA = 100; // Declared at module scope
        function funcA() {
          console.log(onlyInFuncA); // Only used here
        }
        function funcB() { /* does not use it */ }
      `,
      errors: [
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'onlyInFuncA',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: 'funcA',
          },
        },
      ],
    },
    {
      code: `
        let configValue;
        function initialize() {
          configValue = { setting: true };
          console.log(configValue);
        }
      `,
      errors: [
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'configValue',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: 'initialize',
          },
        },
      ],
    },
    {
      code: `var scriptVar = "hello"; function greet() { alert(scriptVar); }`,
      languageOptions: { sourceType: 'script' },
      errors: [
        {
          messageId: 'useLetConst',
          data: { variableName: 'scriptVar' },
        },
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'scriptVar',
            declarationScopeType: 'global',
            usageScopeType: 'function',
            usageScopeIdentifier: 'greet',
          },
        },
      ],
    },
    {
      // Variable only used in one anonymous function
      code: `
        const helperData = { value: 42 };
        (function() {
          console.log(helperData.value);
        })();
      `,
      errors: [
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'helperData',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: '[anonymous_function]',
          },
        },
      ],
    },
    {
      // Variable only used in arrow function assigned to variable
      code: `
        const apiKey = 'secret123';
        const makeRequest = () => {
          return fetch('/api', { headers: { 'API-Key': apiKey } });
        };
      `,
      errors: [
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'apiKey',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: 'makeRequest',
          },
        },
      ],
    },
    {
      // Variable only used in method
      code: `
        let cache = new Map();
        const service = {
          getData: function() {
            if (cache.has('key')) return cache.get('key');
            const data = 'computed';
            cache.set('key', data);
            return data;
          }
        };
      `,
      errors: [
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'cache',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: 'getData',
          },
        },
      ],
    },
    {
      // Multiple variables, each only used in one function
      code: `
        const dataA = 'for function A';
        const dataB = 'for function B';
        
        function processA() {
          console.log(dataA);
        }
        
        function processB() {
          console.log(dataB);
        }
      `,
      errors: [
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'dataA',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: 'processA',
          },
        },
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'dataB',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: 'processB',
          },
        },
      ],
    },

    // === Section 3: Invalid for "Discourage var" ===
    {
      code: 'var z = 3;',
      errors: [{ messageId: 'useLetConst', data: { variableName: 'z' } }],
    },
    {
      code: 'function oldStyle() { var count = 0; return count; }',
      errors: [{ messageId: 'useLetConst', data: { variableName: 'count' } }],
    },
    {
      code: 'var a = 1, b = 2;', // Multiple declarations
      errors: [{ messageId: 'useLetConst', data: { variableName: 'a' } }],
    },
    {
      code: 'for (var i = 0; i < 10; i++) { console.log(i); }',
      errors: [{ messageId: 'useLetConst', data: { variableName: 'i' } }],
    },
    {
      code: 'if (true) { var blockVar = "should be let"; }',
      errors: [
        { messageId: 'useLetConst', data: { variableName: 'blockVar' } },
      ],
    },
    {
      code: 'var func = function() { return "prefer const"; };',
      errors: [{ messageId: 'useLetConst', data: { variableName: 'func' } }],
    },

    // === Combined violations ===
    {
      code: `
    var utilityData = { helper: true };
    function doWork() {
      window.workResult = utilityData.helper;
    }
  `,
      errors: [
        {
          messageId: 'useLetConst',
          data: { variableName: 'utilityData' },
        },
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'utilityData',
            declarationScopeType: 'module',
            usageScopeType: 'function',
            usageScopeIdentifier: 'doWork',
          },
        },
        {
          messageId: 'noModifyGlobal',
          data: { objectName: 'window', propertyName: 'workResult' },
        },
      ],
    },

    {
      code: `
    var appConfig = { debug: false };
    var userPrefs = { theme: 'dark' };

    function initialize() {
      console.log(appConfig);
    }

    function setupUI() {
      console.log(userPrefs);
    }
  `,
      languageOptions: { sourceType: 'script' },
      errors: [
        {
          messageId: 'useLetConst',
          data: { variableName: 'appConfig' },
        },
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'appConfig',
            declarationScopeType: 'global',
            usageScopeType: 'function',
            usageScopeIdentifier: 'initialize',
          },
        },
        {
          messageId: 'useLetConst',
          data: { variableName: 'userPrefs' },
        },
        {
          messageId: 'moveToNarrowerScope',
          data: {
            variableName: 'userPrefs',
            declarationScopeType: 'global',
            usageScopeType: 'function',
            usageScopeIdentifier: 'setupUI',
          },
        },
      ],
    },
  ],
});

const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
});

const ruleName = 'check-return-values';
const rule = rules[ruleName];

if (!rule) {
  throw new Error(`Rule "${ruleName}" not found. Check plugin export.`);
}

ruleTester.run(ruleName, rule, {
  valid: [
    // Value used
    {
      code: 'const result = someFunction();',
    },
    {
      code: 'let success; success = anotherFunction();',
    },
    {
      code: 'if (checkStatus()) { console.log("OK"); }',
    },
    {
      code: 'const arr = [getValue(), 1];',
    },
    {
      code: 'const obj = { prop: getProp() };',
    },
    {
      code: 'function main() { return process(); }',
    },
    {
      code: 'const val = () => returnsSomething();',
    },
    {
      code: 'console.log(formatData());',
    },
    {
      code: 'const x = 1 + calculate();',
    },
    {
      code: 'const y = ok() && notOk();',
    },
    {
      code: 'const z = !isDisabled();',
    },
    {
      code: 'async function f() { await asyncCall(); }',
    },
    {
      code: 'async function f2() { const res = await asyncCall(); }',
    },
    { code: 'void Math.random();' },
    {
      code: 'const result = Math.random();',
    },
    {
      code: 'void db.logAuditTrail();',
    },
    {
      code: '_ = db.performSideEffect();',
    },
    {
      code: '// return value intentionally ignored\ndb.update(record);',
    },
    {
      code: 'db.update(record); // return value intentionally ignored',
    },
    {
      code: `function updateRecordInDB(record) {
         const success = db.update(record);
         if (!success) {
           console.error('Update failed for record:', record.id);
         }
       }`,
    },
    {
      code: 'const res = obj.method1().method2();',
    },
    {
      code: 'const resultOfLongChain = obj.method1().method2.method3();',
    },
    {
      code: 'new MyClass(arg1, constructorCall());',
    },
    {
      code: 'const template = `value: ${getTemplateValue()}`;',
    },
    {
      code: 'async function test() { await someAsyncFunction(); }',
    },
    {
      code: 'function* gen() { yield getValue(); }',
    },
    {
      code: 'const arrSpread = [...getArray()];',
    },
    {
      code: 'const objSpread = { ...getObject() };',
    },
    {
      code: `
        /* return value intentionally ignored */
        service.call();`,
    },
  ],
  invalid: [
    {
      code: 'someFunction();',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'someFunction' },
        },
      ],
    },
    {
      code: 'db.update(record);',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'db.update' },
        },
      ],
    },
    {
      code: 'Math.random();',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'Math.random' },
        },
      ],
    },
    {
      code: `
        // This comment is not for the line below
        anotherFunction();`,
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'anotherFunction' },
        },
      ],
    },
    {
      code: `function updateRecordInDB(record) {
                db.update(record); 
              }`,
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'db.update' },
        },
      ],
    },
    {
      code: 'obj.method1().method2();',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'obj.method1().method2' },
        },
      ],
    },
    {
      code: 'obj.method1().method2.method3();',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'obj.method1().method2.method3' },
        },
      ],
    },
    {
      code: `
        /* this is some other block comment */
        service.call();`,
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'service.call' },
        },
      ],
    },
  ],
});

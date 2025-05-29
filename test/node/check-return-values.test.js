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
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'let success; success = anotherFunction();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'if (checkStatus()) { console.log("OK"); }',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const arr = [getValue(), 1];',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const obj = { prop: getProp() };',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'function main() { return process(); }',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const val = () => returnsSomething();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'console.log(formatData());',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const x = 1 + calculate();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const y = ok() && notOk();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const z = !isDisabled();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'async function f() { await asyncCall(); }',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'async function f2() { const res = await asyncCall(); }',
      options: [{ requireExplicitIgnore: true }],
    },
    { code: 'void Math.random();', options: [{ requireExplicitIgnore: true }] },
    {
      code: 'const result = Math.random();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'void db.logAuditTrail();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: '_ = db.performSideEffect();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: '// return value intentionally ignored\ndb.update(record);',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'db.update(record); // return value intentionally ignored',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'db.update(record);',
      options: [{ requireExplicitIgnore: false }],
    },
    {
      code: `function updateRecordInDB(record) {
         const success = db.update(record);
         if (!success) {
           console.error('Update failed for record:', record.id);
         }
       }`,
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const res = obj.method1().method2();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const resultOfLongChain = obj.method1().method2.method3();',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'new MyClass(arg1, constructorCall());',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const template = `value: ${getTemplateValue()}`;',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'async function test() { await someAsyncFunction(); }',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'function* gen() { yield getValue(); }',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const arrSpread = [...getArray()];',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'const objSpread = { ...getObject() };',
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: `
        /* return value intentionally ignored */
        service.call();`,
      options: [{ requireExplicitIgnore: true }],
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
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'db.update(record);',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'db.update' },
        },
      ],
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'Math.random();',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'Math.random' },
        },
      ],
      options: [{ requireExplicitIgnore: true }],
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
      options: [{ requireExplicitIgnore: true }],
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
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'obj.method1().method2();',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'obj.method1().method2' },
        },
      ],
      options: [{ requireExplicitIgnore: true }],
    },
    {
      code: 'obj.method1().method2.method3();',
      errors: [
        {
          messageId: 'returnValueNotHandled',
          data: { functionName: 'obj.method1().method2.method3' },
        },
      ],
      options: [{ requireExplicitIgnore: true }],
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
      options: [{ requireExplicitIgnore: true }],
    },
  ],
});

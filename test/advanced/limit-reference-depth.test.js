const { RuleTester } = require('eslint');
const rules = require('../../index').rules;

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
});

ruleTester.run('limit-reference-depth', rules['limit-reference-depth'], {
  valid: [
    // Default options: maxDepth: 3, requireOptionalChaining: true, allowSinglePropertyAccess: false

    // Single property access with allowSinglePropertyAccess: true
    { code: 'obj.a;', options: [{ allowSinglePropertyAccess: true }] },

    // Optional chaining from the start (NEW BEHAVIOR)
    { code: 'obj?.a;' },
    { code: 'obj?.a?.b;' },
    { code: 'obj?.a?.b?.c;' },
    { code: 'item?.details?.name;' }, // This matches the requirement example

    // Computed properties with optional chaining
    { code: 'obj?.[a];' },
    { code: 'obj?.[a]?.[b];' },
    { code: 'obj?.[a]?.[b]?.[c];' },

    // Function calls with optional chaining
    { code: 'getObj()?.a;' },
    { code: 'getObj()?.a?.b;' },
    { code: 'getObj()?.a?.b?.c;' },

    // this with optional chaining
    { code: 'this?.a?.b?.c;' },

    // When requireOptionalChaining is false
    { code: 'obj.a;', options: [{ requireOptionalChaining: false }] },
    { code: 'obj.a.b;', options: [{ requireOptionalChaining: false }] },
    { code: 'obj.a.b.c;', options: [{ requireOptionalChaining: false }] },
    { code: 'this.a;', options: [{ requireOptionalChaining: false }] },
    { code: 'getObj().a;', options: [{ requireOptionalChaining: false }] },

    // Custom maxDepth with optional chaining
    { code: 'obj?.a;', options: [{ maxDepth: 1 }] },
    { code: 'obj?.a?.b;', options: [{ maxDepth: 2 }] },

    // Backward compatibility: allowSinglePropertyAccess for gradual migration
    { code: 'obj.a?.b;', options: [{ allowSinglePropertyAccess: true }] },
    { code: 'obj.a?.b?.c;', options: [{ allowSinglePropertyAccess: true }] },

    // Mixed scenarios with allowSinglePropertyAccess
    {
      code: 'item.details?.name;',
      options: [{ maxDepth: 2, allowSinglePropertyAccess: true }],
    },
  ],

  invalid: [
    // Exceeds maxDepth (default 3)
    {
      code: 'obj?.a?.b?.c?.d;', // depth 4
      errors: [
        {
          messageId: 'tooDeep',
          data: { path: 'obj?.a?.b?.c?.d', chainDepth: 4, maxDepthOption: 3 },
        },
      ],
    },
    {
      code: 'obj.a.b.c.d;', // depth 4, also missing optional chaining
      errors: [
        {
          messageId: 'tooDeep',
          data: { path: 'obj.a.b.c.d', chainDepth: 4, maxDepthOption: 3 },
        },
      ],
    },

    // Exceeds custom maxDepth
    {
      code: 'obj?.a?.b?.c;', // depth 3
      options: [{ maxDepth: 2 }],
      errors: [
        {
          messageId: 'tooDeep',
          data: { path: 'obj?.a?.b?.c', chainDepth: 3, maxDepthOption: 2 },
        },
      ],
    },

    // Missing optional chaining from the start (NEW BEHAVIOR)
    {
      code: 'obj.a;', // Single property access without optional chaining
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'obj.a' },
        },
      ],
    },
    {
      code: 'obj.a?.b;', // First access missing optional chaining
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'obj.a' },
        },
      ],
    },
    {
      code: 'item.details?.name;', // Should be item?.details?.name
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'details', path: 'item.details' },
        },
      ],
    },
    {
      code: 'obj.a?.b?.c;', // First access missing optional chaining
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'obj.a' },
        },
      ],
    },

    // this without optional chaining
    {
      code: 'this.a;',
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'this.a' },
        },
      ],
    },
    {
      code: 'this.a?.b;',
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'this.a' },
        },
      ],
    },

    // Function calls without optional chaining
    {
      code: 'getObj().a;',
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'getObj().a' },
        },
      ],
    },
    {
      code: 'getObj().a?.b;',
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'getObj().a' },
        },
      ],
    },

    // Computed properties without optional chaining
    {
      code: 'obj[a];',
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'obj[a]' },
        },
      ],
    },
    {
      code: 'obj[a]?.[b];',
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'a', path: 'obj[a]' },
        },
      ],
    },

    // Mixed optional and non-optional (after first)
    {
      code: 'obj?.a.b;', // Second access missing optional chaining
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'b', path: 'obj?.a.b' },
        },
      ],
    },
    {
      code: 'obj?.a?.b.c;', // Third access missing optional chaining
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'c', path: 'obj?.a?.b.c' },
        },
      ],
    },

    // Edge cases with allowSinglePropertyAccess: true
    {
      code: 'obj.a.b;', // Second access still needs optional chaining
      options: [{ allowSinglePropertyAccess: true }],
      errors: [
        {
          messageId: 'missingOptionalChaining',
          data: { property: 'b', path: 'obj.a.b' },
        },
      ],
    },
  ],
});

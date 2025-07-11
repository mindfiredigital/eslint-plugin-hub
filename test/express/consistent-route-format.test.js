// test/express/consistent-route-format.test.js

const { RuleTester } = require('eslint');
const rules = require('../../index').rules; // Adjust path if needed to where your rules are exposed

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      // Common Express globals
      app: 'writable',
      router: 'writable',
    },
  },
});

const ruleName = 'consistent-route-format';

ruleTester.run(ruleName, rules[ruleName], {
  valid: [
    // --- Default options: requireLeadingSlash: true, allowTrailingSlash: false ---
    // Valid leading slash, no trailing slash
    { code: "app.get('/users', handler);" },
    { code: "router.post('/items/add', handler);" },
    { code: "app.use('/admin', handler);" },
    // Root path is allowed to have a trailing slash
    { code: "app.get('/', handler);" },
    // Regex paths (ignored by rule logic as they are not simple strings)
    { code: 'app.get(/user\\d+/, handler);' },
    { code: "const userPath = '/users'; app.get(userPath, handler);" },
    // Template literals that are simple strings (valid)
    { code: 'app.get(`/users`, handler);' },
    { code: 'app.post(`/api/v1/items`, handler);' },
    // Template literals with expressions (ignored for trailing slash, checked for leading)
    { code: 'app.get(`/users/${id}`, handler);' },
    { code: 'app.post(`/items/${itemId}/details`, handler);' },

    // --- Options: allowTrailingSlash: true ---
    {
      code: "app.get('/users/', handler);",
      options: [{ allowTrailingSlash: true }],
    },
    {
      code: "router.post('/items/add/', handler);",
      options: [{ allowTrailingSlash: true }],
    },
    {
      code: "app.get('/', handler);", // Root is always allowed, even with allowTrailingSlash: false
      options: [{ allowTrailingSlash: true }],
    },

    // --- Options: requireLeadingSlash: false ---
    {
      code: "app.get('users', handler);", // No leading slash, but allowed
      options: [{ requireLeadingSlash: false }],
    },
    {
      code: "router.post('items/add', handler);",
      options: [{ requireLeadingSlash: false }],
    },
    // Trailing slash still disallowed by default unless explicitly allowed
    {
      code: "app.get('/users', handler);",
      options: [{ requireLeadingSlash: false }],
    },

    // --- Options: requireLeadingSlash: false, allowTrailingSlash: true ---
    {
      code: "app.get('users/', handler);", // No leading, with trailing, both allowed
      options: [{ requireLeadingSlash: false, allowTrailingSlash: true }],
    },
  ],

  invalid: [
    // --- Missing leading slash (default: requireLeadingSlash: true) ---
    {
      code: "app.get('users', handler);",
      output: 'app.get("/users", handler);',
      errors: [
        {
          messageId: 'missingLeadingSlash',
          data: { path: 'users' },
          line: 1,
          column: 9,
          endColumn: 16,
        },
      ],
    },
    {
      code: "router.post('items/add', handler);",
      output: 'router.post("/items/add", handler);',
      errors: [
        {
          messageId: 'missingLeadingSlash',
          data: { path: 'items/add' },
          line: 1,
          column: 13,
          endColumn: 24,
        },
      ],
    },
    // Template literal missing leading slash
    {
      code: 'app.get(`users`, handler);',
      output: 'app.get(`/users`, handler);',
      errors: [
        {
          messageId: 'missingLeadingSlash',
          data: { path: 'users' },
          line: 1,
          column: 9,
        },
      ],
    },
    // Template literal with expression, missing leading slash (no fix suggested)
    {
      code: 'app.get(`users/${id}`, handler);',
      errors: [
        {
          messageId: 'missingLeadingSlash',
          data: { path: '`users/${id}`' },
          line: 1,
          column: 9,
        },
      ],
    },

    // --- Disallowed trailing slash (default: allowTrailingSlash: false) ---
    {
      code: "app.get('/users/', handler);",
      output: 'app.get("/users", handler);',
      errors: [
        {
          messageId: 'disallowedTrailingSlash',
          data: { path: '/users/' },
          line: 1,
          column: 9,
          endColumn: 18,
        },
      ],
    },
    {
      code: "router.post('/items/add/', handler);",
      output: 'router.post("/items/add", handler);',
      errors: [
        {
          messageId: 'disallowedTrailingSlash',
          data: { path: '/items/add/' },
          line: 1,
          column: 13,
          endColumn: 26, // Adjusted endColumn from 25 to 26
        },
      ],
    },
    // Template literal with trailing slash
    {
      code: 'app.post(`/api/v1/items/`, handler);',
      output: 'app.post(`/api/v1/items`, handler);',
      errors: [
        {
          messageId: 'disallowedTrailingSlash',
          data: { path: '/api/v1/items/' },
          line: 1,
          column: 10,
        },
      ],
    },

    // --- Both violations ---
    {
      code: "app.get('users/', handler);",
      output: 'app.get("/users", handler);', // Fixes both
      errors: [
        {
          messageId: 'missingLeadingSlash',
          data: { path: 'users/' },
          line: 1,
          column: 9,
        },
        {
          messageId: 'disallowedTrailingSlash',
          data: { path: 'users/' },
          line: 1,
          column: 9,
        },
      ],
    },

    // --- Trailing slash disallowed with `allowTrailingSlash: false` ---
    {
      code: "app.get('/products/', handler);",
      options: [{ allowTrailingSlash: false }],
      output: 'app.get("/products", handler);',
      errors: [
        {
          messageId: 'disallowedTrailingSlash',
          data: { path: '/products/' },
        },
      ],
    },

    // --- Leading slash required with `requireLeadingSlash: true` ---
    {
      code: "app.post('new-item', handler);",
      options: [{ requireLeadingSlash: true }],
      output: 'app.post("/new-item", handler);',
      errors: [
        {
          messageId: 'missingLeadingSlash',
          data: { path: 'new-item' },
        },
      ],
    },
  ],
});

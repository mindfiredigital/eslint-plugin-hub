const { RuleTester } = require('eslint');
// const plugin = require('../../index'); // Assuming top-level index exports all rules
// const rule = plugin.rules['http-status-code'];
const rule =
  require('../../lib/rules/node/express/open-api-spec/plugin/http-status-code')
    .rules['http-status-code'];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      // Common Express globals
      app: 'writable',
      router: 'writable',
      require: 'readonly',
      module: 'readonly',
      process: 'readonly',
      console: 'readonly',
    },
  },
});

const defaultErrorMessage = (method, expected, actual, resName = 'res') =>
  `Expected ${resName}.status(${expected.join(' or ')}) for ${method} request, but found ${resName}.status(${actual}).`;

const sendStatusErrorMessage = (method, expected, actual, resName = 'res') =>
  `Expected ${resName}.sendStatus(${expected.join(' or ')}) for ${method} request, but found ${resName}.sendStatus(${actual}).`;

ruleTester.run('http-status-code', rule, {
  valid: [
    // Default GET
    "app.get('/users', (req, res) => { res.status(200).send('Ok'); });",
    "router.get('/items', (req, res) => { res.status(200).json([]); });",
    // Default POST
    "app.post('/users', (req, res) => { res.status(201).send('Created'); });",
    // Default DELETE
    "app.delete('/users/:id', (req, res) => { res.status(204).end(); });",
    "app.delete('/users/:id', (req, res) => { res.status(200).send('Deleted OK'); });",
    // Default PUT
    "app.put('/users/:id', (req, res) => { res.status(200).send('Updated'); });",
    "app.put('/users/:id', (req, res) => { res.status(204).send(); });",
    // Default PATCH
    "app.patch('/users/:id', (req, res) => { res.status(200).json({partial: true}); });",
    "app.patch('/users/:id', (req, res) => { res.status(204).end(); });",
    // res.sendStatus
    "app.get('/status', (req, res) => { res.sendStatus(200); });",
    "app.post('/status', (req, res) => { res.sendStatus(201); });",
    // Conditional status
    "app.get('/conditional', (req, res) => { if (req.query.err) { res.status(500).send('Error'); } else { res.status(200).send('OK'); } });",
    // No explicit status (Express defaults to 200, rule doesn't check this case currently)
    "app.get('/implicit', (req, res) => { res.send('Ok by default'); });",
    // Custom response object name
    {
      code: "app.get('/custom', (req, reply) => { reply.status(200).send('Ok'); });",
      options: [{ responseObjectName: 'reply' }],
    },
    // Custom status codes
    {
      code: "app.post('/custom-post', (req, res) => { res.status(200).send('Ok'); });",
      options: [{ validStatusCodesByMethod: { POST: [200, 202] } }],
    },
    // Chained .status().status().send() - last one should count
    "app.get('/chained-status', (req, res) => { res.status(500).status(200).send('Final is 200'); });",
    // Handler as a separate function
    `
      function getUserHandler(req, res) { res.status(200).json({}); }
      app.get('/user-handler', getUserHandler);
    `,
    // Methods not in default config (e.g. all, use) - should not error if no res.status()
    "app.all('/all-path', (req, res, next) => { next(); });",
    "app.use('/middleware', (req, res, next) => { res.header('X-Custom', 'true'); next(); });",
    // Method not in default config, but with res.status() - should not error IF that method has no default config
    // To test this properly, you'd need a method NOT in DEFAULT_STATUS_CODES_BY_METHOD
    // e.g., if 'TRACE' was a known express method but not in defaults
    // "app.trace('/trace-path', (req, res) => { res.status(200).send(); });", // Assuming TRACE has no default expectations
  ],
  invalid: [
    {
      code: "app.get('/users', (req, res) => { res.status(201).send('Wrong'); });",
      errors: [{ message: defaultErrorMessage('GET', [200], 201) }],
    },
    {
      code: "router.post('/items', (req, res) => { res.status(200).json({}); });",
      errors: [{ message: defaultErrorMessage('POST', [201], 200) }],
    },
    {
      code: "app.delete('/users/:id', (req, res) => { res.status(201).end(); });",
      errors: [{ message: defaultErrorMessage('DELETE', [200, 204], 201) }],
    },
    {
      code: "app.put('/users/:id', (req, res) => { res.status(201).send(); });",
      errors: [{ message: defaultErrorMessage('PUT', [200, 204], 201) }],
    },
    {
      code: "app.patch('/users/:id', (req, res) => { res.status(201).json({}); });",
      errors: [{ message: defaultErrorMessage('PATCH', [200, 204], 201) }],
    },
    // res.sendStatus
    {
      code: "app.get('/status-err', (req, res) => { res.sendStatus(201); });", // Changed 404 to 201
      errors: [{ message: sendStatusErrorMessage('GET', [200], 201) }], // Error message reflects 201
    },
    {
      code: "app.post('/status-err-post', (req, res) => { res.sendStatus(200); });",
      errors: [{ message: sendStatusErrorMessage('POST', [201], 200) }],
    },
    // Custom response object name
    {
      code: "app.get('/custom-err', (req, reply) => { reply.status(204).send('Err'); });", // Changed 400 to 204
      options: [{ responseObjectName: 'reply' }],
      errors: [{ message: defaultErrorMessage('GET', [200], 204, 'reply') }], // Error message reflects 204
    },
    // Custom status codes, but still wrong
    {
      code: "app.post('/custom-post-err', (req, res) => { res.status(200).send('Bad'); });", // Changed 400 to 200
      options: [{ validStatusCodesByMethod: { POST: [202] } }],
      errors: [{ message: defaultErrorMessage('POST', [202], 200) }], // Error message reflects 200
    },
    // Chained status, last one is wrong
    {
      code: "app.get('/chained-status-err', (req, res) => { res.status(200).status(201).send('Forbidden'); });", // 201 is not 200 for GET
      errors: [{ message: defaultErrorMessage('GET', [200], 201) }],
    },
  ],
});

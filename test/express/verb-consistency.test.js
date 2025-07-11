const { RuleTester } = require('eslint');
const rule =
  require('../../lib/rules/node/express/open-api-spec/plugin/verb-consistency')
    .rules['verb-consistency'];

const ruleTester = new RuleTester();

ruleTester.run('verb-consistency', rule, {
  valid: [
    { code: "app.get('/users', (req, res) => {})" },
    { code: "router.post('/users', (req, res) => {})" },
    { code: "app.put('/users/:id', (req, res) => {})" },
    { code: "router.delete('/users/:id', (req, res) => {})" },
    { code: "app.patch('/users/:id', (req, res) => {})" },
    {
      code: "app.options('/users', (req, res) => {})",
      options: [
        { allowedVerbs: ['get', 'post', 'put', 'delete', 'patch', 'options'] },
      ],
    },
    {
      code: "app.head('/users', (req, res) => {})",
      options: [
        { allowedVerbs: ['get', 'post', 'put', 'delete', 'patch', 'head'] },
      ],
    },
    { code: "other.get('/users', (req, res) => {})" }, // Not app or router
  ],

  invalid: [
    {
      code: "app.options('/users', (req, res) => {})",
      errors: [
        {
          message:
            'app.options uses an uncommon verb. Consider using one of: GET, POST, PUT, DELETE, PATCH.',
          type: 'Identifier',
        },
      ],
    },
    {
      code: "router.head('/users', (req, res) => {})",
      errors: [
        {
          message:
            'router.head uses an uncommon verb. Consider using one of: GET, POST, PUT, DELETE, PATCH.',
          type: 'Identifier',
        },
      ],
    },
    {
      code: "app.search('/users', (req, res) => {})",
      errors: [
        {
          message:
            'app.search uses an uncommon verb. Consider using one of: GET, POST, PUT, DELETE, PATCH.',
          type: 'Identifier',
        },
      ],
    },
    {
      code: "router.custom('/users', (req, res) => {})",
      errors: [
        {
          message:
            'router.custom uses an uncommon verb. Consider using one of: GET, POST, PUT, DELETE, PATCH.',
          type: 'Identifier',
        },
      ],
    },
    {
      code: "app.options('/users', (req, res) => {})",
      options: [{ allowedVerbs: ['get', 'post'] }],
      errors: [
        {
          message:
            'app.options uses an uncommon verb. Consider using one of: GET, POST.',
          type: 'Identifier',
        },
      ],
    },
  ],
});

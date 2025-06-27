const { RuleTester } = require('eslint');
const rule =
  require('../../lib/rules/node/express/open-api-spec/plugin/plural-resource-paths')
    .rules['plural-resource-paths'];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      app: 'writable',
      router: 'writable',
      buildPath: 'readonly',
    },
  },
});

ruleTester.run('plural-resource-paths', rule, {
  valid: [
    "app.get('/users', (req, res) => {});",
    "router.post('/products', (req, res) => {});",
    "app.put('/items', (req, res) => {});",
    "app.delete('/categories', (req, res) => {});",
    "app.patch('/orders', (req, res) => {});",

    "app.get('/users/:userId/posts', (req, res) => {});",
    "app.get('/products/:productId/reviews', (req, res) => {});",

    "app.get('/status', (req, res) => {});",
    "app.get('/api/v1/news', (req, res) => {});",
    "app.get('/series', (req, res) => {});",
    "app.get('/auth', (req, res) => {});",
    "app.post('/login', (req, res) => {});",
    "app.post('/logout', (req, res) => {});",
    "app.get('/health', (req, res) => {});",
    "app.get('/ping', (req, res) => {});",
    "app.get('/search', (req, res) => {});",
    "app.get('/process', (req, res) => {});", // Exception

    "app.use('/middleware', (req, res, next) => next());",
    'app.listen(3000);',
    "myObject.get('not a route');",

    // Root path
    "app.get('/', (req, res) => {});",

    // Non-literal path (rule should ignore)
    'app.get(buildPath(), (req, res) => {});',

    // Paths with non-alphabetic characters
    "app.get('/api-v1/users', (req, res) => {});",
    "app.get('/users-admin', (req, res) => {});",

    // Paths with segments that are not standard resources
    "app.get('/users/123/profile', (req, res) => {});",

    // Mixed case that should be valid because they are plural
    "app.get('/Users', (req, res) => {});",
    "app.get('/PRODUCTS', (req, res) => {});",

    // Irregular plurals are valid
    "app.get('/children', (req, res) => {});",
    "app.get('/people', (req, res) => {});",
    "app.get('/feet', (req, res) => {});",
    "app.get('/teeth', (req, res) => {});",
    "app.get('/mice', (req, res) => {});",

    // Plural form 'books' is valid
    "app.get('/books', (req, res) => {});",
  ],
  invalid: [
    {
      code: "app.get('/user', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'user', suggestion: 'users' },
        },
      ],
    },
    {
      code: "router.post('/product/:id', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'product', suggestion: 'products' },
        },
      ],
    },
    {
      code: "app.put('/users/:userId/post', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'post', suggestion: 'posts' },
        },
      ],
    },
    {
      code: "app.delete('/category/:id', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'category', suggestion: 'categories' },
        },
      ],
    },
    {
      code: "app.patch('/api/v1/order', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'order', suggestion: 'orders' },
        },
      ],
    },
    {
      code: "app.get('/document', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'document', suggestion: 'documents' },
        },
      ],
    },
    {
      // Multiple singular segments
      code: "app.get('/category/:catId/product/:prodId', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'category', suggestion: 'categories' },
        },
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'product', suggestion: 'products' },
        },
      ],
    },
    {
      // Only one error expected now
      code: "router.get('/books/:bookId/chapter', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'chapter', suggestion: 'chapters' },
        },
      ],
    },
    {
      code: "app.put('/articles/:id/comment', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'comment', suggestion: 'comments' },
        },
      ],
    },
    // Irregular plurals
    {
      code: "app.get('/person/:id', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'person', suggestion: 'people' },
        },
      ],
    },
    {
      code: "app.get('/child/:childId/toy', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'child', suggestion: 'children' },
        },
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'toy', suggestion: 'toys' },
        },
      ],
    },
    {
      code: "app.get('/mouse/:id', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'mouse', suggestion: 'mice' },
        },
      ],
    },
    // Mixed case singular
    {
      code: "app.get('/User/:id', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'User', suggestion: 'Users' },
        },
      ],
    },
    {
      code: "app.get('/PRODUCT/:id', (req, res) => {});",
      errors: [
        {
          messageId: 'resourcePathSingular',
          data: { segment: 'PRODUCT', suggestion: 'PRODUCTS' },
        },
      ],
    },
  ],
});

# Express

## Express plugin Configuration

To ensure consistent coding standards and best practices in Angular projects, the ESLint Plugin Hub provides several Angular-specific rules. These rules enforce best practices for naming conventions, component structure, and the usage of services, inputs, and DOM manipulation within Angular projects.

### Express Rules

| Rule Name                            | Description                                                     |
| ------------------------------------ | --------------------------------------------------------------- |
| `consistent-route-format`      | Enforce consistent formatting for Express route paths: always start with a leading slash and disallow trailing slashes (unless it\'s the root "/").                  |
| `http-status-code`           | Ensure that Express.js route handlers use appropriate HTTP status codes based on the HTTP method.                  |
| `plural-resource-paths` | Enforce plural naming for resource paths in Express routes to promote RESTful API design.        |
| `verb-consistency`       | Ensure Express routes use standard REST verbs only (GET, POST, PUT, DELETE, PATCH). |


### Configuration

After installing the plugin, you'll need to add the Angular-specific rules from `eslint-plugin-hub` to your ESLint configuration file (e.g., `eslintrc.config.mjs`,`.eslintrc.json`, `.eslintrc.js`, or `.eslintrc.yaml`).

Here’s how to configure the Angular-specific rules:

### Import Express Rules

```javascript
import hub from '@mindfiredigital/eslint-plugin-hub';
import globals from 'globals';

export default [
  // Extends the espress config preset from the plugin
  hub.configs['flat/express'],
  {
    languageOptions: {
      globals: globals.builtin,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    // Add any additional rules or overrides here
  },
];
```

or

```json
{
  "env": {
    "es2024": true
  },
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "extends": ["plugin:@mindfiredigital/hub/express"]
  // Add any additional rules or overrides here
}
```

### Express Rule Details

### consistent-route-format

**Description:**

Enforces consistent formatting for Express route paths. By default, it requires that all route paths start with a leading slash (/) and do not have a trailing slash, with an exception for the root path (/), which is always considered valid.

**Rationale:**
Standardizing route path definitions across a project is crucial for maintainability and preventing common bugs. In frameworks like Express.js, the router can often treat /users and users/ as distinct routes, which can lead to unexpected behavior or duplicated endpoints. Enforcing a consistent format improves code readability and ensures that route definitions are predictable and unambiguous. This rule helps prevent these issues by automatically flagging and fixing non-compliant path formats.

**Options**
The rule accepts a single object with the following properties:

- `allowTrailingSlash`
Type: boolean

Description: If set to true, the rule will permit trailing slashes on all routes. If false, a trailing slash will be flagged as an error (unless it's the root path /).

Default: false

Example Usage:

```json

// In your ESLint config rules section:
{
  "rules": {
    "hub/consistent-route-format": ["warn", { "allowTrailingSlash": true }]
  }
}
```
`requireLeadingSlash`
Type: boolean

Description: If set to true, the rule will require a leading slash for all non-empty route paths.

Default: true

Example Usage:

```json

// In your ESLint config rules section:
{
  "rules": {
    "hub/consistent-route-format": ["warn", { "requireLeadingSlash": false }]
  }
}
```
Example of Full Configuration in eslint.config.js
```js

// eslint.config.js
// Assuming 'hubPlugin' is your imported plugin '@mindfiredigital/eslint-plugin-hub'
// ... other imports and configurations ...
{
  plugins: {
    "hub": hubPlugin,
  },
  rules: {
    "hub/consistent-route-format": ["error", {
      "requireLeadingSlash": true,
      "allowTrailingSlash": false 
    }],
    // ... other rules
  }
}
```
Examples
Scenario 1: Default Options
With the default configuration

```json
 "hub/consistent-route-format": ["warn"], which implies { "requireLeadingSlash": true, "allowTrailingSlash": false }
 ```

Valid (Should NOT produce warnings):
```javaScript

// Correctly formatted paths
app.get('/', handler);
app.post('/users', handler);
router.use('/api/v1/items', middleware);

// Template literal with no dynamic parts is also checked
app.delete(`/${entityId}`, handler); 
Invalid (Should PRODUCE warnings and be auto-fixed):
JavaScript

// Missing leading slash
app.get('users', handler); // 🚨 Invalid


// Auto-fix will change it to: app.get('/users', handler);
// ESLint Warning: Route path "users" should start with a leading "/".
```

```javaScript

// Disallowed trailing slash
app.put('/products/', handler); // 🚨 Invalid

// Auto-fix will change it to: app.put('/products', handler);
// ESLint Warning: Trailing slash in route path "/products/" is not allowed.

// Both errors present
router.use('utils/', handler); // 🚨 Invalid

// Auto-fix will change it to: router.use('/utils', handler);
// ESLint Warning: Route path "utils/" should start with a leading "/". (The autofix corrects both issues in one pass).

// Scenario 2: Option allowTrailingSlash: true
// Configuration: "hub/consistent-route-format": ["warn", { "allowTrailingSlash": true }]

Valid (Should NOT produce warnings):
JavaScript

// Trailing slashes are now allowed
app.get('/users/', handler);
app.post('/api/v1/', handler);
Invalid (Should PRODUCE warnings):
JavaScript

// A leading slash is still required
app.get('users/', handler); // 🚨 Invalid: Missing leading slash

// Auto-fix will change it to: app.get('/users/', handler);
// ESLint Warning: Route path "users/" should start with a leading "/".
```

Scenario 3: Complex Paths (Template Literals)
The rule can also handle template literals. It will fix simple ones and report errors on complex ones.

```javascript

// Simple template literal (no expressions)
app.get(`users`, handler); // 🚨 Invalid: Missing leading slash

// Auto-fix will change it to: app.get(`/users`, handler);
// ESLint Warning: Route path "users" should start with a leading "/".


// Complex template literal with an expression
app.get(`users/:${userId}`, handler); // 🚨 Invalid: Missing leading slash

// This case is NOT auto-fixable to avoid breaking the template literal's logic.
// ESLint Warning: Route path "users/:${userId}" should start with a leading "/".
```

`http-status-code`

**Description:**
Ensures that Express.js route handlers use appropriate and conventional HTTP status codes based on the HTTP method being handled. This rule helps maintain predictable API behavior.

**Rationale:**
Using standard HTTP status codes is a cornerstone of building robust and understandable RESTful APIs. Clients rely on these codes to understand the outcome of a request. For example, a POST request that successfully creates a new resource should return a 201 Created status, not a generic 200 OK. This rule enforces these conventions for success responses, making your API more explicit and easier for developers to consume. It intelligently ignores error codes (4xx and 5xx), as their usage is highly dependent on runtime logic.

**Options:**
The rule accepts a single object with the following properties:

`responseObjectName`
Type: string

Description: The identifier used for the response object within your route handlers. This is useful if your codebase follows a convention other than the standard res.

Default: "res"

Example Usage:

```json

// In your ESLint config rules section:
{
  "rules": {
    "hub/http-status-code": ["error", { "responseObjectName": "response" }]
  }
}
```
validStatusCodesByMethod
Type: object

Description: An object to override the default allowed status codes for specific HTTP methods. Keys should be uppercase HTTP method names ('GET', 'POST', etc.), and values should be an array of accepted integer status codes.

Default:

```javaScript

{
  GET: [200],
  POST: [201],
  PUT: [200, 204],
  PATCH: [200, 204],
  DELETE: [200, 204],
  OPTIONS: [200, 204],
  HEAD: [200, 204],
}
```
Example Usage:

```json

// In your ESLint config rules section, to allow 202 for POST:
{
  "rules": {
    "hub/http-status-code": [
      "warn", 
      { 
        "validStatusCodesByMethod": {
          "POST": [201, 202] 
        }
      }
    ]
  }
}
```
Example of Full Configuration in eslint.config.js:
```javaScript

// eslint.config.js
// Assuming 'hubPlugin' is your imported plugin '@mindfiredigital/eslint-plugin-hub'
// ... other imports and configurations ...
{
  plugins: {
    "hub": hubPlugin,
  },
  rules: {
    "hub/http-status-code": ["error", {
      "responseObjectName": "res",
      "validStatusCodesByMethod": {
        "POST": [201], // Sticking to the default for POST
        "PUT": [200]    // Custom: Only allow 200 for PUT
      }
    }],
    // ... other rules
  }
}
```
Examples
Scenario 1: Default Options
Using the default configuration "hub/http-status-code": ["error"].

Valid (Should NOT produce warnings):
```javaScript

// Correct status for POST (201 Created)
app.post('/users', (req, res) => {
  res.status(201).json({ id: 1, name: 'New User' });
});

// Correct status for GET (200 OK)
app.get('/users', (req, res) => {
  res.status(200).send(users);
});

// Correct status for DELETE using sendStatus (204 No Content)
app.delete('/users/1', (req, res) => {
  res.sendStatus(204);
});

// Error codes are always ignored
app.get('/users/99', (req, res) => {
  res.status(404).send('Not Found');
});
Invalid (Should PRODUCE warnings):
```
```javaScript

// Using 200 OK for a POST request instead of 201 Created
app.post('/items', (req, res) => {
  res.status(200).json({ status: 'success' }); // 🚨 Invalid
});
ESLint Warning: Expected res.status(201) for POST request, but found res.status(200).
```
```javaScript

// Using 200 OK via sendStatus for a POST request
app.post('/items', (req, res) => {
  res.sendStatus(200); // 🚨 Invalid
});
ESLint Warning: Expected res.sendStatus(201) for POST request, but found res.sendStatus(200).

Scenario 2: Option validStatusCodesByMethod
Configuration: "hub/http-status-code": ["warn", { "validStatusCodesByMethod": { "POST": [200, 201] } }]

This configuration adds 200 as a valid success code for POST requests.
```

Valid (Should NOT produce warnings):
```javaScript

// 200 is now a valid success code for POST requests
app.post('/items', (req, res) => {
  res.status(200).json({ status: 'success' });
});

// The original 201 is still valid
app.post('/users', (req, res) => {
  res.status(201).json({ id: 1, name: 'New User' });
});
Invalid (Should PRODUCE warnings):
```
```JavaScript

// Using 204 is still not allowed by our custom config
app.post('/legacy', (req, response) => {
  response.status(204).send(); // 🚨 Invalid
});
ESLint Warning: Expected response.status(200 or 201) for POST request, but found response.status(204).

### 4. plural-resource-paths

**Description:**
Enforces plural naming for resource paths in Express routes to promote RESTful API design conventions. It uses a Natural Language Processing (NLP) library to intelligently detect and suggest plural forms for singular nouns found in route segments.

**Rationale**:
A core principle of RESTful API design is to use nouns to represent resources. Conventionally, top-level routes that refer to a collection of resources should be plural (e.g., /users, /articles, /products). This creates a predictable and intuitive API structure where /users represents the list of all users, and /users/123 represents a single user from that collection. This rule helps enforce this best practice, leading to cleaner and more maintainable API codebases.

How It Works:
This rule inspects string literals in Express route definitions (like app.get(...) or router.post(...)). It splits the path into segments and analyzes each one.

NLP-Powered: It uses the compromise NLP library to identify if a segment is a singular noun and to generate an accurate plural suggestion (e.g., "person" → "people", "goose" → "geese").

Exclusions: The rule is smart enough to ignore:

Route parameters (e.g., :userId).

Segments containing numbers or non-alphabetic characters.

A built-in list of common exceptions that are often singular (e.g., api, status, news, auth, v1).

Capitalization: Suggestions will respect the original segment's capitalization (e.g., User → Users).

Non-Fixable: This rule provides suggestions but does not offer an auto-fix, as programmatic pluralization can sometimes be imperfect or not match the developer's intent.

**Options**:
This rule does not have any configurable options.

Examples
Valid (Should NOT produce warnings) ✅
```JavaScript

// Plural resource paths are correct.
app.get('/users', handler);
router.post('/articles', handler);

// The root path is always ignored.
app.get('/', handler);

// Nested plural resources are correct.
app.get('/articles/:articleId/comments', handler);

// Segments that are route parameters are ignored.
app.get('/users/:userId/posts', handler);

// Words in the built-in exception list are ignored.
app.get('/api/v1/status', handler);
app.get('/news', handler);
Invalid (Should PRODUCE warnings) 🚨
```

```js

// 'user' is a singular noun.
app.get('/user', handler);
ESLint Warning: Resource path segment "user" should be plural. Suggestion: "users".

// 'article' and 'comment' are singular nouns.
router.post('/article/:id/comment', handler);
ESLint Warning (1/2): Resource path segment "article" should be plural. Suggestion: "articles".
ESLint Warning (2/2): Resource path segment "comment" should be plural. Suggestion: "comments".

// The rule correctly handles irregular nouns and preserves capitalization.
app.get('/Person/:id', handler);
ESLint Warning: Resource path segment "Person" should be plural. Suggestion: "People".
```

### 4. verb-consistency

**Description:**
Ensures that Express routes are defined using a standard set of RESTful verbs. By default, it allows GET, POST, PUT, DELETE, and PATCH.

**Rationale:**
A key principle of RESTful API design is the use of a uniform interface, which includes leveraging standard HTTP verbs to indicate actions on resources. Sticking to a consistent set of primary verbs makes an API predictable, easier to understand, and simpler for clients to consume. While other methods like HEAD or OPTIONS have valid uses, this rule encourages focusing on the core CRUD (Create, Read, Update, Delete) verbs to maintain a clean and conventional API surface.

**Options**:
The rule accepts a single object with the following property:

allowedVerbs
Type: array of string

Description: A list of lowercase HTTP verb strings that should be considered valid. Providing this option will override the default list entirely.

Default: ['get', 'post', 'put', 'delete', 'patch']

Example Usage:

```json

// In your ESLint config rules section:
{
  "rules": {
    "hub/verb-consistency": [
      "warn",
      {
        "allowedVerbs": ["get", "post", "put", "delete", "patch", "options", "head"]
      }
    ]
  }
}
```
Example of Full Configuration in eslint.config.js:

```json
// eslint.config.js
// Assuming 'hubPlugin' is your imported plugin '@mindfiredigital/eslint-plugin-hub'
// ... other imports and configurations ...
{
  plugins: {
    "hub": hubPlugin,
  },
  rules: {
    "hub/verb-consistency": ["error", {
      // Custom configuration to also allow 'options'
      "allowedVerbs": ["get", "post", "put", "delete", "patch", "options"]
    }],
    // ... other rules
  }
}
```
Examples

Scenario 1: Default Options
Using the default configuration "hub/verb-consistency": ["warn"].

Valid (Should NOT produce warnings) ✅

```javaScript
// All default verbs are allowed.
app.get('/users', handler);
app.post('/users', handler);
app.put('/users/:id', handler);
router.patch('/users/:id', handler);
router.delete('/users/:id', handler);
// Invalid (Should PRODUCE warnings) 🚨
```
```javascript
// 'options' and 'head' are not in the default list.
app.options('/users', handler);
router.head('/users', handler);
// ESLint Warning (1/2): app.options uses an uncommon verb. Consider using one of: GET, POST, PUT, DELETE, PATCH.
// ESLint Warning (2/2): router.head uses an uncommon verb. Consider using one of: GET, POST, PUT, DELETE, PATCH.
```

Scenario 2: Option allowedVerbs
Configuration:

```json
"hub/verb-consistency": ["warn", { "allowedVerbs": ["get", "post", "options"] }]
```

This custom configuration only allows get, post, and options.

Valid (Should NOT produce warnings) ✅
```javaScript

// These verbs are in our custom allowed list.
app.get('/items', handler);
app.post('/items', handler);
router.options('/items', handler);
Invalid (Should PRODUDE warnings) 🚨

// 'delete' and 'put' are no longer in the allowed list for this configuration.
app.delete('/items/:id', handler);
router.put('/items/:id', handler);
// ESLint Warning (1/2): app.delete uses an uncommon verb. Consider using one of: GET, POST, OPTIONS.
// ESLint Warning (2/2): router.put uses an uncommon verb. Consider using one of: GET, POST, OPTIONS.
```

### Conclusion

These Angular-specific ESLint rules are designed to promote better coding practices and maintainability in Angular projects. By enforcing limits on inputs, disallowing direct DOM manipulation, and following naming conventions, you'll ensure a clean, maintainable, and efficient codebase.

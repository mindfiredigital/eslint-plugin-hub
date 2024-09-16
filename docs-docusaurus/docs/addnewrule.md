# Add New Rule

This guide will walk you through the process of adding a new rule to the ESLint Plugin Hub. Follow these steps to contribute a new rule to the project.

## Prerequisites

- Ensure you have Node.js and npm (or yarn) installed on your system.
- Fork and clone the ESLint Plugin Hub repository.
- Install project dependencies by running `npm install` or `yarn install` in the project root.

## Steps to Add a New Rule

1. **Use the Rule Generator**

   Start by using our Rule Generator script to scaffold the necessary files for your new rule:

   ```bash
   npm run generate-rule your-rule-name [rule-type]
   ```

   or if you use yarn:

   ```bash
   yarn generate-rule your-rule-name [rule-type]
   ```

   Replace `your-rule-name` with the name of your new rule (in kebab-case), and `[rule-type]` with either 'general', 'react', or 'angular'. If you don't specify a rule type, the script will prompt you to choose one.

2. **Implement the Rule Logic**

   Open the generated rule file (e.g., `lib/rules/your-rule-name.js`) and implement your rule logic. The generated file will contain a basic structure that you can build upon:

   ```javascript
   module.exports = {
     meta: {
       type: 'suggestion', // Can be 'problem', 'suggestion', or 'layout'
       docs: {
         description: 'Description of your rule',
         category: 'Fill in appropriate category',
         recommended: false,
         url: 'https://eslint.org/docs/rules/your-rule-name',
       },
       fixable: null, // Or 'code' or 'whitespace'
       schema: [], // Add schema if the rule has options
     },

     create: function (context) {
       return {
         // Add visitors for the AST nodes your rule needs to check
       };
     },
   };
   ```

3. **Write Tests**

   Open the generated test file (e.g., `tests/lib/rules/your-rule-name.js`) and write tests for your rule. Ensure you cover various scenarios, including both valid and invalid code examples:

   ```javascript
   const rule = require('../../../lib/rules/your-rule-name'),
     RuleTester = require('eslint').RuleTester;

   const ruleTester = new RuleTester();
   ruleTester.run('your-rule-name', rule, {
     valid: [
       // Add valid code examples
     ],
     invalid: [
       // Add invalid code examples
     ],
   });
   ```

4. **Update Rule Documentation**

   Create a new Markdown file in the appropriate documentation folder based on your rule type:

   - For general rules: `docs-docsaurus/docs/general.md`
   - For React rules: `docs-docsaurus/docs/react.md`
   - For Angular rules: `docs-docsaurus/docs/angular.md`

   #### Include the following sections in your documentation:

   # your-rule-name

   Description of what your rule does and why it's useful.

   ## Rule Details

   This rule aims to...

   Examples of **incorrect** code for this rule:

   ```javascript
   // Add examples of code that breaks the rule
   ```

   Examples of **correct** code for this rule:

   ```javascript
   // Add examples of code that passes the rule
   ```

   ## Options

   If your rule has options, describe them here.

   ## When Not To Use It

   Describe scenarios when this rule might not be desirable.

5. **Update the Main Documentation**

   Add a link to your new rule in the appropriate section of the main documentation file (`docs-docsaurus/docs/intro.md` or similar).

6. **Run Tests**

   Ensure all tests pass by running:

   ```bash
   npm test
   ```

   or

   ```bash
   yarn test
   ```

7. **Commit Your Changes**

   Commit your new rule, tests, and documentation:

   ```bash
   git add .
   git commit -m "Add new rule: your-rule-name"
   ```

8. **Create a Pull Request**

   Push your changes to your fork and create a Pull Request on the main ESLint Plugin Hub repository. Provide a clear description of your new rule in the Pull Request.

## Best Practices

- Ensure your rule has a clear purpose and doesn't overlap significantly with existing rules.
- Write clear, concise documentation with good examples.
- Include both positive and negative test cases.
- Consider the performance implications of your rule, especially for large codebases.
- Be responsive to feedback during the review process.

By following these steps, you'll be able to contribute a well-structured, thoroughly tested, and properly documented new rule to the ESLint Plugin Hub. Thank you for your contribution!

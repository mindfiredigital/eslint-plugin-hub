# Contributing

We welcome contributions to the ESLint Plugin Hub! Here's how you can contribute:

1. **Fork the repository**: Start by forking the ESLint Plugin Hub repository to your GitHub account.

2. **Clone your fork**: Clone your forked repository to your local machine.

   ```bash
   git clone https://github.com/your-username/eslint-plugin-hub.git
   cd eslint-plugin-hub
   ```

3. **Install dependencies**: Install the project dependencies.

   ```bash
   npm install
   ```

   or if you use yarn:

   ```bash
   yarn install
   ```

4. **Create a new branch**: Create a new branch for your feature or bugfix.

   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Use the Rule Generator**: If you're adding a new rule, use our Rule Generator script to scaffold the necessary files:

   ```bash
   npm run generate-rule your-rule-name [rule-type]
   ```

   or if you use yarn:

   ```bash
   yarn generate-rule your-rule-name [rule-type]
   ```

   Replace `your-rule-name` with the name of your new rule (in kebab-case), and `[rule-type]` with either 'general', 'react', or 'angular'. If you don't specify a rule type, the script will prompt you to choose one.

6. **Implement your changes**:

   - If you've generated a new rule, implement the rule logic in the generated rule file and add tests in the generated test file.
   - For other changes, make your code changes and add or update tests as necessary.

7. **Update documentation**: Update the README.md file to include documentation for your new rule or changes.

8. **Run tests**: Ensure all tests pass.

   ```bash
   npm test
   ```

   or:

   ```bash
   yarn test
   ```

9. **Commit your changes**: Commit your changes with a clear and descriptive commit message.

   ```bash
   git commit -m "Add new rule: your-rule-name"
   ```

10. **Push to your fork**: Push your changes to your GitHub fork.

    ```bash
    git push origin feature/your-feature-name
    ```

11. **Create a Pull Request**: Go to the original ESLint Plugin Hub repository on GitHub and create a new Pull Request from your fork. Provide a clear description of your changes in the Pull Request.

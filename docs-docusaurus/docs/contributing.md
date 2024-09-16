# Contributing

We're thrilled that you're interested in contributing to ESLint Plugin Hub! This document outlines the process for contributing to our project. Whether you're fixing bugs, improving documentation, or proposing new features, your contributions are welcome.

## Getting Started

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

## Making Changes

1. **Implement your changes**: Make your code changes and add or update tests as necessary.

2. **Follow coding standards**: Ensure your code adheres to the project's coding standards and style guidelines.

3. **Write meaningful commit messages**: Use clear and descriptive commit messages that explain the purpose of your changes.

## Updating Documentation

1. **Update relevant documentation**: If your changes affect the user-facing behavior of the plugin, update the corresponding documentation.

2. **Document new features**: For new features or rules, create appropriate documentation that explains their purpose, usage, and configuration options.

3. **Update README if necessary**: If your changes affect the overall usage or setup of the plugin, update the README.md file accordingly.

## Testing

1. **Write tests**: Add or update tests to cover your changes. We strive for high test coverage to ensure the reliability of our plugin.

2. **Run tests**: Ensure all tests pass before submitting your changes.

   ```bash
   npm test
   ```

   or:

   ```bash
   yarn test
   ```

## Submitting Your Contribution

1. **Push to your fork**: Push your changes to your GitHub fork.

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**: Go to the original ESLint Plugin Hub repository on GitHub and create a new Pull Request from your fork.

3. **Describe your changes**: In the Pull Request, provide a clear and detailed description of your changes. Include the motivation for the change and any potential impacts.

4. **Reference related issues**: If your Pull Request addresses an existing issue, reference it in the description using the GitHub issue linking syntax (e.g., "Fixes #123").

## Pull Request Review Process

1. **Code review**: A maintainer will review your Pull Request. They may suggest changes or ask for clarifications.

2. **Address feedback**: If changes are requested, make the necessary updates and push them to your branch. The Pull Request will automatically update.

3. **Approval and merge**: Once your Pull Request is approved, a maintainer will merge it into the main branch.

## Additional Resources

- **Adding New Rules**: If you're specifically interested in contributing new ESLint rules, please refer to our detailed guide on [How to Add a New Rule](./addnewrule.md).

## Questions?

If you have any questions or need further clarification on the contribution process, feel free to open an issue asking for guidance.

Thank you for contributing to ESLint Plugin Hub! Your efforts help make this project better for everyone.

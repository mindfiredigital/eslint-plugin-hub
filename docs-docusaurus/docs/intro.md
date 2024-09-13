# Introduction

**eslint-plugin-hub** is a comprehensive ESLint plugin designed to help enforce code quality and consistency across various JavaScript and TypeScript projects. The plugin provides a set of custom linting rules that help developers maintain a high standard of coding practices while adhering to specific conventions for general, React, and Angular projects.

By integrating **eslint-plugin-hub** into your workflow, you can enforce strict naming conventions, file structure guidelines, and other coding best practices. This plugin allows teams to maintain cleaner codebases, minimize bugs, and improve collaboration.

## Key Features

- **General Rules**: A wide range of rules for common coding standards such as naming conventions, file structure, and variable declarations, applicable to any JavaScript or TypeScript project.
- **React-Specific Rules**: Enforce coding standards specific to React applications, ensuring best practices for component structure, hook usage, and JSX formatting.
- **Angular-Specific Rules**: Enforce Angular-specific coding conventions, ensuring consistency in component, service, and module development.
- **Customizable Options**: Each rule is configurable, allowing you to tailor the plugin to your project’s unique needs.
- **TypeScript Support**: Out-of-the-box support for linting TypeScript files (`.ts` and `.tsx`), ensuring that both JavaScript and TypeScript projects maintain the same level of quality and consistency.

## Why Use eslint-plugin-hub?

The primary goal of **eslint-plugin-hub** is to provide an all-in-one solution for maintaining code quality and consistency in JavaScript and TypeScript projects. Here are some reasons why you should integrate this plugin into your development workflow:

- **Enforce Consistent Coding Standards**: Ensure that your entire team follows the same rules and standards across different projects, reducing the risk of bugs and increasing code readability.
- **Improved Collaboration**: By enforcing uniform practices, code reviews become easier, and team members can collaborate more effectively.
- **React and Angular Focused**: Tailored rules for React and Angular development help streamline coding practices for component-based architectures, reducing boilerplate and avoiding common pitfalls.
- **Highly Configurable**: Each rule can be customized to fit your project's specific needs, whether you're enforcing naming conventions, limiting the number of function parameters, or standardizing folder and file naming.
- **Increased Code Quality**: Consistent, clean code helps prevent bugs and makes future refactoring or scaling of the codebase easier.

## Available Rule Categories

The plugin is divided into three main categories:

- **General Rules**: Applies to all JavaScript and TypeScript projects, ensuring consistency in code structure, naming conventions, and code formatting.
- **React Rules**: Ensures best practices in React development, covering component naming, hooks, and JSX syntax.
- **Angular Rules**: Focuses on Angular-specific guidelines, including consistent naming and structure for components, services, and modules.

Each category comes with a set of rules that you can enable or configure based on your project’s needs.

## Rules

This plugin provides the following rules:

| Rule                                 | Description                                               | Fixable |
| ------------------------------------ | --------------------------------------------------------- | ------- |
| `vars-camelcase`                     | Enforces camelCase naming convention for variables.       | true    |
| `vars-descriptive`                   | Enforces variable names to start with a verb.             | false   |
| `class-pascalcase`                   | Enforces PascalCase naming convention for class names.    | true    |
| `filename-kebabcase`                 | Enforces kebab-case naming convention for filenames.      | true    |
| `function-camelcase`                 | Enforces camelCase naming convention for function names.  | true    |
| `function-descriptive`               | Enforces function names to start with a verb.             | false   |
| `angular-no-forbidden-services`      | Disallows the use of forbidden Angular services.          | true    |
| `angular-no-unused-inputs`           | Disallows unused inputs in Angular components.            | false   |
| `angular-no-direct-dom-manipulation` | Disallows direct DOM manipulation in Angular.             | true    |
| `angular-limit-input`                | Enforces a limit on the number of inputs in Angular.      | false   |
| `angular-filenaming`                 | Enforces naming conventions for Angular files.            | true    |
| `file-kebabcase`                     | Enforces kebab-case naming convention for files.          | true    |
| `max-lines-per-file`                 | Enforces a maximum number of lines per file.              | false   |
| `max-lines-per-function`             | Enforces a maximum number of lines per function.          | false   |
| `consistent-return`                  | Enforces consistent return statements.                    | true    |
| `max-function-params`                | Enforces a maximum number of parameters per function.     | true    |
| `no-single-character-vars`           | Disallows single character variable names.                | true    |
| `vars-lowercase`                     | Enforces lowercase naming convention for variables.       | false   |
| `folder-lowercase`                   | Enforces lowercase naming convention for folders.         | true    |
| `file-lowercase`                     | Enforces lowercase naming convention for filenames.       | true    |
| `folder-pascalcase`                  | Enforces PascalCase naming convention for folders.        | true    |
| `folder-kebabcase`                   | Enforces kebab-case naming convention for folders.        | true    |
| `folder-camelcase`                   | Enforces camelCase naming convention for folders.         | true    |
| `file-camelcase`                     | Enforces camelCase naming convention for filenames.       | true    |
| `function-pascalcase`                | Enforces PascalCase naming convention for function names. | true    |
| `file-pascalcase`                    | Enforces PascalCase naming convention for filenames.      | true    |
| `vars-snakecase`                     | Enforces snake_case naming convention for variables.      | true    |
| `vars-pascalcase`                    | Enforces PascalCase naming convention for variables.      | true    |
| `class-pascalcase`                   | Enforces PascalCase naming convention for classes.        | true    |
| `function-camelcase`                 | Enforces camelCase naming convention for functions.       | true    |
| `function-descriptive`               | Enforces descriptive names for functions.                 | false   |
| `vars-camelcase`                     | Enforces camelCase naming convention for variables.       | true    |
| `vars-descriptive`                   | Enforces descriptive names for variables.                 | false   |

---

With **eslint-plugin-hub**, you can streamline your codebase, enforce best practices, and ensure that your project maintains a high level of quality across different JavaScript and TypeScript frameworks.

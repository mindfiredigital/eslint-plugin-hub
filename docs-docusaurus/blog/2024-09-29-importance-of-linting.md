---
title: How ESLint Plugin Hub Helps You Write Better Code
slug: how-eslint-plugin-hub-helps
authors: [anand-kumar]
tags: [eslint, code-quality, coding-standards, javascript]
---

### The Importance of Linting

Linting tools like ESLint are vital in helping developers catch syntax errors, poor code formatting, and potential bugs before they make it into production. But with `@mindfiredigital/eslint-plugin-hub`, we take things a step further by enforcing **naming conventions**, **file organization**, and **function standards**.

<!-- truncate -->

![Welcome Image](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnk3NHBleHJ4bXR6d2U2c3JqOHJmamxvYjdvdjB5bWtxMnA1OWxieCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Ws6T5PN7wHv3cY8xy8/giphy.webp)

### Key Features that Set ESLint Plugin Hub Apart

1. **Naming Conventions**: The plugin enforces camelCase for variables, PascalCase for classes, and kebab-case for filenames. This ensures consistency across your entire project.
   - Example: Variables like `myVariable` and class names like `MyClass` are enforced by the rules.
2. **File Structure Rules**: Keep your folders and files organized by enforcing kebab-case for filenames or lower-case folder names. This prevents common issues like case-sensitive errors in cross-platform development.
3. **React and Angular Specific Rules**: The plugin supports popular frameworks like React and Angular, offering rules that enforce the proper naming of components, filenames, and best practices for using inputs in Angular.

### Boosting Team Productivity

When everyone on your team adheres to the same set of rules, it reduces the cognitive load of reviewing or writing new code. Developers spend less time debating stylistic choices and more time building features.

### Examples of Rules in Action

Here’s how some of the key rules in the plugin work:

- **file-kebabcase**: Ensures that filenames are always in kebab-case format (`my-file.js`).
- **function-descriptive**: Warns when function names aren’t descriptive enough, promoting clarity.
- **react-component-name-match-filename**: Makes sure React component names match their filenames.

By catching these issues early, the plugin helps you avoid refactoring down the line.

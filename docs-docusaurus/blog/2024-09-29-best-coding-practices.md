---
title: Best Coding Practices Enforced by ESLint Plugin Hub
slug: best-coding-practices
authors: [anand-kumar]
tags: [best-practices, eslint, naming-conventions, code-quality]
---

### Why Coding Standards Matter

Adopting consistent coding standards is crucial for maintaining a clean, scalable, and easy-to-understand codebase. It’s not just about readability—having structured naming conventions and optimized functions makes collaboration smoother and helps future developers quickly grasp your project.

This is where `@mindfiredigital/eslint-plugin-hub` comes in. It automatically enforces coding best practices, allowing developers to focus on solving problems without worrying about inconsistent code.

<!-- truncate -->

![Welcome Image](https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ3h6YzY2d3E2d3Rnc3hxbmNzYXEybGRuazg2emR5NTM5MDV4MjE4byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.webp)

### Key Best Practices Enforced by the Plugin

1. **Consistent Naming Conventions**:

   - **PascalCase for Classes**: PascalCase ensures class names stand out and remain distinct from variables or functions.
     - Example: `class UserProfile` instead of `class userProfile`.
   - **camelCase for Variables and Functions**: A widely accepted standard in JavaScript that improves code consistency by using camelCase for both variables and functions.
     - Example: `function getUserData()` instead of `function GetUserData()`.
   - **Descriptive Names**: Encourages meaningful and self-explanatory names for variables and functions, aiding future code comprehension.
     - Example: `calculateTotalPrice()` instead of `calcPrice()`.

2. **Folder and File Organization**:

   - **kebab-case for Filenames**: Enforcing kebab-case for filenames promotes uniformity and reduces potential cross-platform issues like case sensitivity.
     - Example: `user-profile.js` instead of `UserProfile.js`.
   - **Lowercase Folder Names**: Using lowercase for folder names keeps things simple and standardized across your project.

3. **Managing Function Complexity**:
   - **Limit Lines per Function**: By restricting the number of lines a function can have, the plugin promotes writing smaller, more modular code.
   - **Limit Function Parameters**: This rule limits the number of function parameters, encouraging developers to pass objects or arrays when working with more complex data.

By following these steps, your project will automatically adhere to coding best practices, ensuring high-quality code throughout development.

---

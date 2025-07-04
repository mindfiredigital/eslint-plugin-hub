# ESLint Report Generator
## Overview

To provide a comprehensive overview of code quality and maintain a historical record of linting issues, the ESLint Plugin Hub includes a built-in report generation tool. This tool introduces a new command, eslint-report, that analyzes your project and generates detailed reports of all ESLint errors and warnings in both PDF and CSV formats.

These reports are invaluable for code reviews, quality assurance audits, and tracking improvements to your codebase over time.

Features
Feature

Description

PDF & CSV Output

Generates two distinct report files: a human-readable, branded PDF and a data-friendly CSV.

Automatic Grouping

The PDF report automatically groups all issues under "Errors" and "Warnings" for quick assessment.

Customizable Logo

The PDF report can be branded with your company logo by placing a logo.png in the static/img folder.

Standalone CLI

A simple command-line interface that can be run on any project with a local ESLint installation.

Getting Started
Installation
The report generator is a command-line tool included with the eslint-plugin-hub package. To make the command available in your project, you must first install the plugin.

For local development across multiple projects, you can use npm link:

# In your eslint-plugin-hub project directory
npm link

# In your target project directory (e.g., mern-ecom-api)
npm link eslint-plugin-hub

For a single project or in a CI/CD environment, install it as a development dependency:

npm install @mindfiredigital/eslint-plugin-hub --save-dev

Running the Report Generator
Once installed, you can run the report generator from the root of your project. The command accepts an optional path to the project you want to analyze. If no path is provided, it will analyze the current directory.

# Run on the current project
npx eslint-report .

# Or run on a different project using a relative path
npx eslint-report ../path/to/another-project

### Configuration
For easier use, it is highly recommended to add the command to the scripts section of your project's package.json.

```json
{
  "scripts": {
    "lint": "eslint . --fix",
    "lint:report": "eslint-report ."
  }
}
```

You can then generate a report at any time by running:

npm run lint:report

Including the Logo
For the PDF report to correctly display your company logo, you must ensure the static folder is included when the eslint-plugin-hub package is published or linked. Add the following "files" array to your eslint-plugin-hub/package.json:

```json
{
  "name": "eslint-plugin-hub",
  "version": "1.0.0",
  "main": "index.js",
  "bin": {
    "eslint-report": "./bin/report-generation-cli.js"
  },
  "files": [
    "bin",
    "lib",
    "rules",
    "static"
  ]
}

Output
After running the command, a new directory named eslint-reports will be created in the root of the project you analyzed. This directory contains the following files:

File Name

Description

report.pdf

A professionally formatted, landscape-oriented PDF. It features your company logo, a summary of all issues grouped by severity, and clear tables.

report.csv

A Comma-Separated Values file containing all the raw issue data. This file is ideal for importing into spreadsheets or other data analysis tools.

Conclusion
The ESLint Report Generator provides a powerful and convenient way to visualize and track the quality of your codebase. By integrating this tool into your development workflow, you can easily share detailed reports with your team, monitor progress, and maintain a high standard of code quality across all your projects.
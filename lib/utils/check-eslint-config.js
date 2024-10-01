const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// List of possible ESLint config files
const eslintConfigFiles = [
  '.eslintrc.js',
  'eslint.config.js',
  'eslint.config.mjs',
  '.eslintrc.json',
  '.eslintrc.yaml',
  '.eslintrc.yml',
];

const projectDir = process.cwd();

// Check if any ESLint configuration file exists
const hasEslintConfig = eslintConfigFiles.some(configFile =>
  fs.existsSync(path.join(projectDir, configFile))
);

if (!hasEslintConfig) {
  console.log(`
    WARNING: No ESLint configuration found in your project.
  `);

  // Set up readline for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    'Would you like to automatically install ESLint and set up configuration? (y/n): ',
    userResponse => {
      const response = userResponse.toLowerCase();

      if (response === 'y') {
        try {
          // Run ESLint configuration setup using npm init @eslint/config@latest
          console.log('Setting up basic ESLint configuration...');
          execSync('npm init @eslint/config@latest', { stdio: 'inherit' });

          console.log(`
            ESLint has been successfully installed and configured!
          
            To customize your setup further, check the eslint.config* file created in your project.
            Don't forget to add "@mindfiredigital/eslint-plugin-hub" to the ESLint configuration file under "plugins".
          
            For more details, visit the [npm package page](https://www.npmjs.com/package/@mindfiredigital/eslint-plugin-hub) or the [official documentation](https://mindfiredigital.github.io/eslint-plugin-hub/docs/configuration).
          `);
        } catch (error) {
          console.error(
            'An error occurred during the installation or setup process:',
            error.message
          );
        }
      } else {
        console.log(
          'Skipping ESLint setup. Please make sure to configure it manually.'
        );
      }

      rl.close(); // Close the readline interface after the response
    }
  );
}

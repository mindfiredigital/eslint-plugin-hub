const fs = require('fs');
const path = require('path');
const { ruleTemplate } = require('./templates/rule-template'); // Adjust path as needed
const { testTemplate } = require('./templates/test-template');

const ruleName = process.argv[2];

if (!ruleName) {
  console.error('Please provide a rule name.');
  process.exit(1);
}

// Function to convert kebab-case to camelCase
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

// Define paths
const rulesDir = path.join(__dirname, '..', 'lib', 'rules');
const ruleFile = path.join(rulesDir, `${ruleName}.js`);
const testFile = path.join(__dirname, '..', 'test', `${ruleName}.test.js`);
const indexFile = path.join(__dirname, '..', 'index.js');

// Create rule file
fs.writeFileSync(ruleFile, ruleTemplate(ruleName).trim(), 'utf8');
console.log(`Rule file created: ${ruleFile}`);

// Create test file
fs.writeFileSync(testFile, testTemplate(ruleName).trim(), 'utf8');
console.log(`Test file created: ${testFile}`);

// Update index.js
const indexContent = fs.readFileSync(indexFile, 'utf8');
const camelCaseRuleName = toCamelCase(ruleName);
const ruleImport = `const ${camelCaseRuleName} = require('./lib/rules/${ruleName}');`;

// New regex pattern to match the entire rules object
const rulesObjectPattern = /(module\.exports\s*=\s*{\s*rules:\s*{[^}]*})/;

const updatedIndexContent = indexContent
  .replace(/(const .+ = require\('.+'\);)/, `$1\n${ruleImport}`)
  .replace(rulesObjectPattern, match => {
    // Insert the new rule at the end of the rules object, before the closing brace
    return match.replace(/}(\s*)$/, `  ...${camelCaseRuleName}.rules,\n}$1`);
  });

fs.writeFileSync(indexFile, updatedIndexContent, 'utf8');
console.log(`Index file updated: ${indexFile}`);

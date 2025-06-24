// ... any existing node rules ...
const expressRules = require('./express/index.js');

module.exports = {
  rules: {
    // ... existing node rules ...
    ...expressRules.rules,
  },
};

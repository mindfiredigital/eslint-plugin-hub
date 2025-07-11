const openApiSpecRules = require('./open-api-spec/index.js');
// Add other sub-categories of express if any

module.exports = {
  rules: {
    ...openApiSpecRules.rules,
  },
};

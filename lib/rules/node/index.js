const expressRules = require('./express/index.js');

module.exports = {
  rules: {
    ...expressRules.rules,
  },
};

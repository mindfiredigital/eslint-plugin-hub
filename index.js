const checkFilenames = require('./lib/rules/filename-kebabcase');
const checkClass = require('./lib/rules/class-pascalcase');
const functionCamelcase = require('./lib/rules/function-camelcase');
const functionDescriptive = require('./lib/rules/function-descriptive');
const camelCase = require('./lib/rules/vars-camelcase');
const descriptiveVars = require('./lib/rules/vars-descriptive');

module.exports = {
  rules: {
    ...checkFilenames.rules,
    ...checkClass.rules,
    ...functionCamelcase.rules,
    ...functionDescriptive.rules,
    ...camelCase.rules,
    ...descriptiveVars.rules,
  },
};

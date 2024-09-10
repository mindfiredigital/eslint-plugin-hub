const checkFilenames = require('./lib/rules/filename-kebabcase');
const folderLowercase = require('./lib/rules/folder-lowercase');
const filenameLowercase = require('./lib/rules/filename-lowercase');
const folderPascalcase = require('./lib/rules/folder-pascalcase');
const folderKebabcase = require('./lib/rules/folder-kebabcase');
const folderCamelcase = require('./lib/rules/folder-camelcase');
const filenameCamelcase = require('./lib/rules/filename-camelcase');
const functionPascalcase = require('./lib/rules/function-pascalcase');
const filenamePascalcase = require('./lib/rules/filename-pascalcase');
const varsSnakecase = require('./lib/rules/vars-snakecase');
const varsPascalcase = require('./lib/rules/vars-pascalcase');
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
    ...varsPascalcase.rules,
    ...varsSnakecase.rules,
    ...filenamePascalcase.rules,
    ...functionPascalcase.rules,
    ...filenameCamelcase.rules,
    ...folderCamelcase.rules,
    ...folderKebabcase.rules,
    ...folderPascalcase.rules,
    ...filenameLowercase.rules,
    ...folderLowercase.rules,
  },
};

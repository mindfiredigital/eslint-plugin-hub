const fileKebabcase = require('./lib/rules/file-kebabcase');
const varsLowercase = require('./lib/rules/vars-lowercase');
const folderLowercase = require('./lib/rules/folder-lowercase');
const fileLowercase = require('./lib/rules/file-lowercase');
const folderPascalcase = require('./lib/rules/folder-pascalcase');
const folderKebabcase = require('./lib/rules/folder-kebabcase');
const folderCamelcase = require('./lib/rules/folder-camelcase');
const fileCamelcase = require('./lib/rules/file-camelcase');
const functionPascalcase = require('./lib/rules/function-pascalcase');
const filePascalcase = require('./lib/rules/file-pascalcase');
const varsSnakecase = require('./lib/rules/vars-snakecase');
const varsPascalcase = require('./lib/rules/vars-pascalcase');
const classPascal = require('./lib/rules/class-pascalcase');
const functionCamelcase = require('./lib/rules/function-camelcase');
const functionDescriptive = require('./lib/rules/function-descriptive');
const varsCamelcase = require('./lib/rules/vars-camelcase');
const descriptiveVars = require('./lib/rules/vars-descriptive');

module.exports = {
  rules: {
    ...fileKebabcase.rules,
    ...classPascal.rules,
    ...functionCamelcase.rules,
    ...functionDescriptive.rules,
    ...varsCamelcase.rules,
    ...descriptiveVars.rules,
    ...varsPascalcase.rules,
    ...varsSnakecase.rules,
    ...filePascalcase.rules,
    ...functionPascalcase.rules,
    ...fileCamelcase.rules,
    ...folderCamelcase.rules,
    ...folderKebabcase.rules,
    ...folderPascalcase.rules,
    ...fileLowercase.rules,
    ...folderLowercase.rules,
    ...varsLowercase.rules,
  },
};

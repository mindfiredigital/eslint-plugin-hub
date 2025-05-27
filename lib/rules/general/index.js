const fileKebabcase = require('./plugin/file-kebabcase');
const maxLinesPerFile = require('./plugin/max-lines-per-file');
const maxLinesPerFunction = require('./plugin/max-lines-per-function');
const consistentReturn = require('./plugin/consistent-return');
const maxFunctionParams = require('./plugin/max-function-params');
const noSingleCharacterVars = require('./plugin/no-single-character-vars');
const varsLowercase = require('./plugin/vars-lowercase');
const folderLowercase = require('./plugin/folder-lowercase');
const fileLowercase = require('./plugin/file-lowercase');
const folderPascalcase = require('./plugin/folder-pascalcase');
const folderKebabcase = require('./plugin/folder-kebabcase');
const folderCamelcase = require('./plugin/folder-camelcase');
const fileCamelcase = require('./plugin/file-camelcase');
const functionPascalcase = require('./plugin/function-pascalcase');
const filePascalcase = require('./plugin/file-pascalcase');
const varsSnakecase = require('./plugin/vars-snakecase');
const varsPascalcase = require('./plugin/vars-pascalcase');
const classPascal = require('./plugin/class-pascalcase');
const functionCamelcase = require('./plugin/function-camelcase');
const functionDescriptive = require('./plugin/function-descriptive');
const varsCamelcase = require('./plugin/vars-camelcase');
const descriptiveVars = require('./plugin/vars-descriptive');
const limitDataScope = require('./plugin/limit-data-scope');

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
    ...noSingleCharacterVars.rules,
    ...maxFunctionParams.rules,
    ...consistentReturn.rules,
    ...maxLinesPerFunction.rules,
    ...maxLinesPerFile.rules,
    ...limitDataScope.rules,
  },
};

const fileKebabcase = require('./lib/rules/general/file-kebabcase');
const angularFilenaming = require('./lib/rules/angular/angular-filenaming');
const reactFilenamePascalCase = require('./lib/rules/react/react-filename-pascalcase');
const maxLinesPerFile = require('./lib/rules/general/max-lines-per-file');
const maxLinesPerFunction = require('./lib/rules/general/max-lines-per-function');
const consistentReturn = require('./lib/rules/general/consistent-return');
const maxFunctionParams = require('./lib/rules/general/max-function-params');
const noSingleCharacterVars = require('./lib/rules/general/no-single-character-vars');
const varsLowercase = require('./lib/rules/general/vars-lowercase');
const folderLowercase = require('./lib/rules/general/folder-lowercase');
const fileLowercase = require('./lib/rules/general/file-lowercase');
const folderPascalcase = require('./lib/rules/general/folder-pascalcase');
const folderKebabcase = require('./lib/rules/general/folder-kebabcase');
const folderCamelcase = require('./lib/rules/general/folder-camelcase');
const fileCamelcase = require('./lib/rules/general/file-camelcase');
const functionPascalcase = require('./lib/rules/general/function-pascalcase');
const filePascalcase = require('./lib/rules/general/file-pascalcase');
const varsSnakecase = require('./lib/rules/general/vars-snakecase');
const varsPascalcase = require('./lib/rules/general/vars-pascalcase');
const classPascal = require('./lib/rules/general/class-pascalcase');
const functionCamelcase = require('./lib/rules/general/function-camelcase');
const functionDescriptive = require('./lib/rules/general/function-descriptive');
const varsCamelcase = require('./lib/rules/general/vars-camelcase');
const descriptiveVars = require('./lib/rules/general/vars-descriptive');

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
    ...reactFilenamePascalCase.rules,
    ...angularFilenaming.rules,
  },
};

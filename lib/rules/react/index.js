const reactComponentNameMatchFilename = require('./plugin/react-component-name-match-filename');
const reactFilenamePascalCase = require('./plugin/react-filename-pascalcase');

module.exports = {
  rules: {
    ...reactComponentNameMatchFilename.rules,
    ...reactFilenamePascalCase.rules,
  },
};

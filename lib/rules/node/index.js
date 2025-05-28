const fixedLoopBounds = require('./plugin/fixed-loop-bounds');

module.exports = {
  rules: {
    ...fixedLoopBounds.rules,
  },
};

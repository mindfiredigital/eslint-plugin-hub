module.exports = {
  rules: {
    'vars-pascalcase': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Description of the rule',
        },
        fixable: 'code',
        schema: [], // no options
      },
      create: function (context) {
        return {
          // callback functions
        };
      },
    },
  },
};

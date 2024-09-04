const nlp = require('compromise');

function isVerb(word) {
  const doc = nlp(word);
  return doc.verbs().out('array').length > 0;
}

module.exports = {
  isVerb,
};

//const visit = require('unist-util-visit').visit;
const loadWords = require('./customDictionary');

//import visit from 'unist-util-visit';
//import { loadWords } from './customDictionary'; // Adjust path as necessary

async function customDictionary() {
  const words = loadWords();
  const { visit } = await import('unist-util-visit');

  function transformer(tree, file) {
    visit(tree, 'Text', (node) => {
      words.forEach(({ word, reason }) => {
        if (node.value.includes(word)) {
          const message = file.message(reason, node);
          message.ruleId = word;
          message.source = 'custom-dictionary';
        }
      });
    });
  }

  return transformer;
}

// Export the customDictionary function
module.exports = { customDictionary };
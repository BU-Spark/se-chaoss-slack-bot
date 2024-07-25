const fs = require('fs').promises;
const path = require('path');
const { join, dirname } = path;

// Initialize the list of bad words
let words = [];

// Define the path to the custom badword json file
const CUSTOM_WORDS_FILE_PATH = join(__dirname, process.env["CUSTOM_WORDS_FILE_NAME"]);

// Function to load bad words from the custom.json file
// will create a blank file if there is an error reading the file
async function loadWords() {
  try {
    const data = await fs.readFile(CUSTOM_WORDS_FILE_PATH, 'utf8');
    words = JSON.parse(data);
    logger.debug("Words loaded:", words);
  } catch (err) {
    console.error("Error reading or parsing file:", err);
    await createBlankJson(); // Creates a blank file if there is an error reading the file
  }
}

let initialized = false;

async function init() {
  if (!initialized) {
    loadBadWords();
    initialized = true;
  }
}

// Function to create a blank JSON file for bad words
async function createBlankJson() {
  try {
    await fs.writeFile(CUSTOM_WORDS_FILE_PATH, JSON.stringify([]), 'utf8');
    words = [];
  } catch (err) {
    console.error("Error writing blank JSON file:", err);
  }
}

// Function to add a word to the list
function addWord(word, reason) {
  init();
  words.push({ word, reason });
  saveWords();
}

// Function to remove a word from the list
function removeWord(word) {
  init();
  const originalLength = words.length;
  words = words.filter(w => w.word.toLowerCase() !== word.toLowerCase());
  const isRemoved = originalLength !== words.length;
  saveWords();
  return isRemoved; // Returns true if a word was removed
}

// Function to save the updated list of words to the file
async function saveWords() {
  init();
  try {
    await fs.writeFile(FILE_PATH, JSON.stringify(words, null, 2), 'utf8');
  } catch (err) {
    console.error("Error saving words to file:", err);
  }
}

// Function to find words in a message
function findWords(message) {
  init();
  const regex = new RegExp(`\\b(${words.map(w => w.word).join('|')})\\b`, 'ig');
  const matches = message.match(regex);
  if (matches) {
    const matchedWords = [...new Set(matches.map(word => word.toLowerCase()))];
    return words.filter(bw => matchedWords.includes(w.word.toLowerCase()));
  }
  return [];
}

// Function to get descriptions of all bad words
const getWordReasons = () => {
  init();
  return words.map(w => `${w.word} - ${w.reason}`).join('\n');
};

// do need this
// Export the functions for use in other parts of the application
module.exports = {
  //loadAlex,
  loadWords,
  addWord,
  removeWord,
  findWords,
  getWordReasons,
};

/*

async function loadAlex() {
  alex = await import('alex');
}

const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'custom.json');

let badWords = [];
function loadBadWords() {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            createBlankJson(); // Creates a blank file if there is an error reading the file
            return;
        }
        try {
            badWords = JSON.parse(data);
            debugLog("Bad words loaded:", badWords);
        } catch (parseError) {
            console.error("Error parsing JSON from file:", parseError);
            createBlankJson(); // Reset file with blank JSON if parsing fails
        }
    });
}

function createBlankJson() {
    fs.writeFile(FILE_PATH, JSON.stringify([]), 'utf8', (err) => {
        if (err) {
            console.error("Error writing blank JSON file:", err);
            return;
        }
        debugLog("Blank JSON file created successfully.");
        badWords = [];
    });
}

// Features to customize the words that should be flagged
function addBadWord(word, reason) {
  badWords.push({ word, reason });
  saveBadWords();
}

function removeBadWord(word) {
  const originalLength = badWords.length;
  badWords = badWords.filter(bw => bw.word.toLowerCase() !== word.toLowerCase());
  saveBadWords();
  return originalLength !== badWords.length; // Returns true if something was removed
}

function saveBadWords() {
  try {
      // Write the JSON synchronously to the file
      fs.writeFileSync(FILE_PATH, JSON.stringify(badWords, null, 2), 'utf8');
      debugLog("Bad words updated successfully.");
  } catch (err) {
      console.error("Error saving bad words to file:", err);
  }
}

function findBadWords(message) {
  const regex = new RegExp(`\\b(${badWords.map(bw => bw.word).join('|')})\\b`, 'ig');
  const matches = message.match(regex);
  if (matches) {
    const matchedWords = [...new Set(matches.map(word => word.toLowerCase()))];
    return badWords.filter(bw => matchedWords.includes(bw.word.toLowerCase()));
  }
  return [];
}

const getBadWordsDescriptions = () => {
  return badWords.map(bw => `${bw.word} - ${bw.reason}`).join('\n');
};

// Functionality for customizing the dictionary for the "Why?" button
//loadAlex().then(() => {
//  loadBadWords()

*/
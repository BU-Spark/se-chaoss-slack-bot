const fs = require('fs');
const path = require('path');
const dictionary = require('./customDictionary');
const i18next = require('i18next');
const Backend = require('i18next-fs-backend');

// Global variable to store the flagged words
let flaggedWord;
// Use a Map as a simple server-side cache
const definitionsCache = new Map();
// Load Alex.js dictionary, which contains a list of insensitive words
let alex;
// filename for custom dictionary
//const FILE_PATH = path.join(__dirname, 'custom.json');

let badWords = [];
// flag to only init once on lazy load
let initialized = false;

async function init() {
  if (!initialized) {
    alex = await import('alex');
    loadBadWords();
    initialized = true;
    i18next.use(Backend).init({
      backend: {
        loadPath: path.join(__dirname, 'locales', '{{lng}}.json')
      },
      lng: "en",
      fallbackLng: "en",
      interpolation: {
        escapeValue: false
      }
    }, (err, t) => {
      if (err) return console.error(err);
    });

  }
}

const checkMessage = async (user, channel, text, originalTimestamp, attempts = 1) => {
  await init();
  const lowerText = text.toLowerCase();
  const alexCheck = alex.text(lowerText).messages;
  //const alexChecker = [...alexCheck]; // original check
  let newFinder = dictionary.findBadWords(text.toLowerCase())
  logger.debug(newFinder)
  if (newFinder.length > 0) {
    newFinder.forEach(wordy => {
      alexCheck.push({
        reason: i18next.t('flagged_message_warning', { wordy.word, wordy.reason }),
        actual: wordy.word,
      });
    })
  }

  if (alexCheck.length > 0) {
    const reason = alexCheck.map(word => word.reason).join(i18next.t('connector_word'));
    flaggedWord = alexCheck.map(word => word.actual);

    setTimeout(async () => {
      const warningMessage = i18next.t('flagged_message_warning', { text, reason });
      talksWithThemButton(message.channel, user, warningMessage);
    }, 1000);

    setTimeout(async () => {
      try {
        const history = await app.client.conversations.history({
          channel: channel,
          latest: originalTimestamp,
          inclusive: true,
          limit: 1,
          token: process.env.SLACK_BOT_TOKEN,
        });

        const currentMessage = history.messages[0];
        if (attempts >= 3) {
          deleteMessage(channel, originalTimestamp);
          talksWithThem(channel, user, i18next.t('flagged_message_deletion'));
        } else if (currentMessage.text !== text) {
          checkMessage(user, channel, currentMessage.text, originalTimestamp, attempts + 1);
        } else {
          deleteMessage(message.channel, message.ts);
          talksWithThem(message.channel, user, i18next.t('message_deletion_notice'));
          talksWithThemPrivate(user, i18next.t('what_you_said', { text }))
        }
      } catch (error) {
        console.error("Error checking for message edit:", error);
      }
    }, 60000);
  } else if (attempts > 1) {
    talksWithThem(channel, user, i18next.t('message_update_thanks'));
  }
};

module.exports = { checkMessage };



// Remaining functions for dictionary operations remain unchanged
function getDictionaryEntry(word) {
  return new Promise((resolve, reject) => {
    if (!word) {
      reject(new Error("No word provided"));
      return;
    }

    const firstLetter = word.charAt(0).toLowerCase();
    const filePath = path.join(__dirname, 'dict', `${firstLetter}.json`);

    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const dict = JSON.parse(data);
        const entry = dict[word];
        if (entry) {
          resolve(entry);
        } else {
          reject(new Error(`No entry found for word: ${word}`));
        }
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

function getWrapper(word) {
  return new Promise((resolve, reject) => {
    getDictionaryEntry(word).then(entry => {
      const mappedDef = entry.meanings.map(meaning => meaning.def);
      resolve(mappedDef);
    }).catch(error => {
      console.error(error);
      resolve(["Sorry, the definition was not loaded."]);
    });
  });
}

const loadDictionary = (word) => {
  const filePath = path.join('./dict', `${word[0].toLowerCase()}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return [JSON.parse(data), filePath];
  } catch (error) {
    console.error('Error reading the file:', error);
    return [{}];
  }
};

const saveDictionary = (filePath, dict) => {
  try {
    const data = JSON.stringify(dict, null, 2);
    fs.writeFileSync(filePath, data, 'utf8');
  } catch (error) {
    console.error('Error writing to the file:', error);
  }
};

const addWord = (word, definition) => {
  const [dict, filePath] = loadDictionary(word);
  dict[word] = { "meanings": [{ "def": definition }] };
  saveDictionary(filePath, dict);
};

const deleteWord = (word) => {
  const [dict, filePath] = loadDictionary(word);
  if (dict[word]) {
    delete dict[word];
    saveDictionary(filePath, dict);
  } else {
    console.log("Word not found!");
  }
};

const editWord = (word, newDefinition) => {
  const [dict, filePath] = loadDictionary(word);
  if (dict[word]) {
    dict[word].meanings[0].def = newDefinition;
    saveDictionary(filePath, dict);
  } else {
    console.log("Word not found to edit!");
  }
};



const fs = require('fs');
const path = require('path');
const { debugLog } = require('../../utils/utilities');
const dictionary = require('./retext-custom/customDictionary');

// Global variable to store the flagged words
let flaggedWord;
// Use a Map as a simple server-side cache
const definitionsCache = new Map();
// Load Alex.js dictionary, which contains a list of insensitive words
let alex;
// filename for custom dictionary
const FILE_PATH = path.join(__dirname, 'custom.json');

let badWords = [];
// flag to only init once on lazy load
let initialized = false;

async function init() {
  if (!initialized) {
    alex = await import('alex');
    loadBadWords();
    initialized = true;
  }
}

import i18n from 'i18next';

i18n.init({
  resources: {
    en: {
      translation: {
        "welcome_message": "Welcome to our application!",
        "error_message": "An error occurred. Please try again."
      }
    },
    de: {
      translation: {
        "welcome_message": "Willkommen zu unserer Anwendung!",
        "error_message": "Ein Fehler ist aufgetreten. Bitte versuche es erneut."
      }
    }
  },
  lng: "en", // if you're using a language detector, you can omit this
  fallbackLng: "en",

  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  }
});

// Usage
console.log(i18n.t('welcome_message')); // Output: Welcome to our application!
const checkMessage = async (user, channel, text, originalTimestamp, attempts = 1) => {
  init();
  const lowerText = text.toLowerCase();
  const alexCheck = alex.text(lowerText).messages;
  const alexChecker = [...alexCheck]; // original check
  let newFinder = dictionary.findBadWords(text.toLowerCase())
  debugLog(newFinder)
  if (newFinder.length > 0) {
    newFinder.forEach(wordy => {
      alexCheck.push({
        reason: `Don't use ${wordy.word}, ${wordy.reason}`,
        actual: wordy.word,
      });
    })
  }

  if (alexCheck.length > 0) {
    const reason = alexCheck.map(word => word.reason).join(", and ");
    flaggedWord = alexCheck.map(word => word.actual);

    setTimeout(async () => {
      talksWithThemButton(message.channel, user, `Hey there! Your message "${text}" has been flagged. ${reason}. We're all about promoting respect and inclusivity here! Could you please take a moment to revise it? We will give you 1 minute to edit your message before it deletes. To do so, hover over your message, click the three dots, then click edit message.`);
    }, 1000);

    setTimeout(async () => {
      try {
        const history = await app.client.conversations.history({
          channel: channel,
          latest: originalTimestamp,
          inclusive: true,
          limit: 1,
          token: process.env.SLACK_BOT_TOKEN,
        });

        const currentMessage = history.messages[0];
        if (attempts >= 3) {
          deleteMessage(channel, originalTimestamp);
          talksWithThem(channel, user, "You didn't edit the message after several warnings. The message has been deleted.");
        } else if (currentMessage.text !== text) {
          checkMessage(user, channel, currentMessage.text, originalTimestamp, attempts + 1);
        } else {
          deleteMessage(message.channel, message.ts);
          talksWithThem(message.channel, user, "Uh oh! Just a heads up, we've removed your message because it included insensitive language. No worries though! We've sent a copy of your message to your private DM with DEI Bot. When you have a moment, please edit it your message and retry sending it.");
          talksWithThemPrivate(user, `Copy of your deleted message: ${text}`)
        }
      } catch (error) {
        console.error("Error checking for message edit:", error);
      }
    }, 60000);
  } else if (attempts > 1) {
    talksWithThem(channel, user, "Thank you for updating your message!");
  }
};

app.message(async ({ message, client, say }) => {
  if (!message.text && !message.file) {
    return;
  }

  checkMessage(message.user, message.channel, message.text, message.ts);
});

function getDictionaryEntry(word) {
  return new Promise((resolve, reject) => {
    if (!word) {
      reject(new Error("No word provided"));
      return;
    }

    const firstLetter = word.charAt(0).toLowerCase();
    const filePath = path.join(__dirname, 'dict', `${firstLetter}.json`);

    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const dict = JSON.parse(data);
        const entry = dict[word];
        if (entry) {
          resolve(entry);
        } else {
          reject(new Error(`No entry found for word: ${word}`));
        }
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
}

function getWrapper(word) {
  return new Promise((resolve, reject) => {
    getDictionaryEntry(word).then(entry => {
      const mappedDef = entry.meanings.map(meaning => meaning.def);
      resolve(mappedDef);
    }).catch(error => {
      console.error(error);
      resolve(["Sorry, the definition was not loaded."]);
    });
  });
}

const loadDictionary = (word) => {
  const filePath = path.join('./dict', `${word[0].toLowerCase()}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return [JSON.parse(data), filePath];
  } catch (error) {
    console.error('Error reading the file:', error);
    return [{}];
  }
};

const saveDictionary = (filePath, dict) => {
  try {
    const data = JSON.stringify(dict, null, 2);
    fs.writeFileSync(filePath, data, 'utf8');
  } catch (error) {
    console.error('Error writing to the file:', error);
  }
};

const addWord = (word, definition) => {
  const [dict, filePath] = loadDictionary(word);
  dict[word] = { "meanings": [{ "def": definition }] };
  saveDictionary(filePath, dict);
};

const deleteWord = (word) => {
  const [dict, filePath] = loadDictionary(word);
  if (dict[word]) {
    delete dict[word];
    saveDictionary(filePath, dict);
  } else {
    console.log("Word not found!");
  }
};

const editWord = (word, newDefinition) => {
  const [dict, filePath] = loadDictionary(word);
  if (dict[word]) {
    dict[word].meanings[0].def = newDefinition;
    saveDictionary(filePath, dict);
  } else {
    console.log("Word not found to edit!");
  }
};
*/
module.exports = { checkMessage };

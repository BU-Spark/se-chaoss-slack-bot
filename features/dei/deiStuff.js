const fs = require('fs');
const path = require('path');
const dictionary = require('./retext-custom-dictionary/customDictionary').default;

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

// Function to check for insensitive words in messages
const checkMessage = async (user, channel, text, originalTimestamp, attempts = 1) => {
  init();
  const lowerText = text.toLowerCase();
  const alexCheck = alex.text(lowerText).messages;
  const alexChecker = [...alexCheck]; // original check
  let newFinder = dictionary.findBadWords(text.toLowerCase())
  logger.debug(newFinder)
  if (newFinder.length > 0) {
    newFinder.forEach(wordy => {
      alexCheck.push({
        reason: `Don't use ${wordy.word}, ${wordy.reason}`,
        actual: wordy.word,
      });
    })
  }

  //insensitive words were found
  if (alexCheck.length > 0) {
    const reason = alexCheck.map(word => word.reason).join(", and ");
    // unbypass cuz new stuff
    flaggedWord = alexCheck.map(word => word.actual);

    // Warn user that their message contains bad words
    setTimeout(async () => {
      talksWithThemButton(message.channel, user, `Hey there! Your message "${text}" has been flagged. ${reason}. We're all about promoting respect and inclusivity here! Could you please take a moment to revise it? We will give you 1 minute to edit your message before it deletes. To do so, hover over your message, click the three dots, then click edit message.`);
    }, 1000);

    // Wait 1 minute before checking the message again
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
        if (attempts >= 3) { // a set limit for editing the message to prevent infinite loops
          deleteMessage(channel, originalTimestamp);
          talksWithThem(channel, user, "You didn't edit the message after several warnings. The message has been deleted.");
        } else if (currentMessage.text !== text) { // your original message has been edited
          checkMessage(user, channel, currentMessage.text, originalTimestamp, attempts + 1); // check the message again for insensitive words
        } else { //message was flagged but not edited, so now it will be deleted
          deleteMessage(message.channel, message.ts);
          talksWithThem(message.channel, user, "Uh oh! Just a heads up, we've removed your message because it included insensitive language. No worries though! We've sent a copy of your message to your private DM with DEI Bot. When you have a moment, please edit it your message and retry sending it.");
          talksWithThemPrivate(user, `Copy of your deleted message: ${text}`)
        }
      } catch (error) {
        console.error("Error checking for message edit:", error);
      }
    }, 60000); // 1 minute wait (!!!!)
  } else if (attempts > 1) { // if the message has been edited and is now fine after finding insensitive words
    talksWithThem(channel, user, "Thank you for updating your message!");
  }
};


// Functionality for customizing the dictionary for the "Why?" button
app.message(async ({ message, client, say }) => {
  if (!message.text && !message.file) {
    return;
  }

  // Initial call to check the message
  checkMessage(message.user, message.channel, message.text, message.ts);
}});
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
      resolve(mappedDef);  // Resolve the promise with the definitions
    }).catch(error => {
      console.error(error);
      resolve(["Sorry, the definition was not loaded."]);  // Resolve with a default message
    });
  });
}

// Helper function to load the dictionary
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

// Helper function to save the dictionary
const saveDictionary = (filePath, dict) => {
  try {
    const data = JSON.stringify(dict, null, 2);
    fs.writeFileSync(filePath, data, 'utf8');
  } catch (error) {
    console.error('Error writing to the file:', error);
  }
};

// Add a word to the dictionary
const addWord = (word, definition) => {
  const [dict, filePath] = loadDictionary(word);
  dict[word] = { "meanings": [{ "def": definition }] };
  saveDictionary(filePath, dict);
};

// Delete a word from the dictionary
const deleteWord = (word) => {
  const [dict, filePath] = loadDictionary(word);
  if (dict[word]) {
    delete dict[word];
    saveDictionary(filePath, dict);
  } else {
    console.log("Word not found!");
  }
};

// Edit a word's definition in the dictionary
const editWord = (word, newDefinition) => {
  const [dict, filePath] = loadDictionary(word);
  if (dict[word]) {
    dict[word].meanings[0].def = newDefinition;
    saveDictionary(filePath, dict);
  } else {
    console.log("Word not found to edit!");
  }
};

// moved to features/dei/regActions.js
// Handle the "Why?" button click
/* app.action('learn_more', async ({ ack, user, channel, body, context }) => {
  // Acknowledge the action
  await ack();

  // Create an array of promises using getWrapper function to get definitions
  const promises = flaggedWord.map(word => getWrapper(word).then(definitions => {
    return { word, definitions };
  }).catch(error => {
    console.error(`Failed to fetch definition for ${word}:`, error);
    return { word, error: error.message };
  }));

  // Wait for all promises to resolve
  const results = await Promise.all(promises);

  // Store the definitions for each word in the cache
  results.forEach(result => {
    definitionsCache.set(result.word, { definitions: result.definitions, index: 0 });
  });

  // send the first definition and a button to request an alt definition for each word using the button
  results.forEach(async (result, i) => {
    if (result.definitions && result.definitions.length > 0) {
      await app.client.chat.postEphemeral({
        channel: body.channel.id,
        user: body.user.id,
        text: `*Definition 1 for ${result.word}*: ${result.definitions[0]}`,
        blocks: [{
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Definition 1 for ${result.word}*: ${result.definitions[0]}`
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Show another definition"
            },
            "action_id": `definition_next_${result.word}`
          }
        }],
        token: context.botToken,
      });
    } else {
      await app.client.chat.postEphemeral({
        channel: body.channel.id,
        user: body.user.id,
        text: `*No definition found for ${result.word}*`,
        token: context.botToken,
      });
    }
  });
}); */


// moved to features/dei/regActions.js
// handles the second button click
/*
app.action(/^definition_next_/, async ({ ack, body, channel, context, action }) => {
  // Acknowledge the action
  await ack();

  // Get the word from the action ID
  const word = action.action_id.split('_')[2];

  // Get the definitions and the current index from the cache
  const cache = definitionsCache.get(word);
  const definitions = cache.definitions;
  const index = cache.index;

  // Check if there are more definitions
  if (index + 1 < definitions.length) {
    // Update the index in the cache
    definitionsCache.set(word, { definitions, index: index + 1 });

    // Send the next definition
    await app.client.chat.postEphemeral({
      channel: body.channel.id,
      user: body.user.id,
      text: `*Definition ${index + 2} for ${word}*: ${definitions[index + 1]}`,
      token: context.botToken,
    });
  } else {
    // Send a message saying "That's all"
    await app.client.chat.postEphemeral({
      channel: body.channel.id,
      user: body.user.id,
      text: `That's all for "${word}".`,
      token: context.botToken,
    });
  }
});
 */


//moved to dictionary.js
/* // Features to customize the words that should be flagged
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
      logger.debug("Bad words updated successfully.");
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
 */


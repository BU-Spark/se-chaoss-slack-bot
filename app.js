const { App, LogLevel } = require('@slack/bolt');
const dotenv = require('dotenv');
const axios = require('axios').default;
const utils = require('./utils');
const path = require('path');

// Define the start path and the file name to search for
const startPath = path.resolve(__dirname);
const fileName = '.env';

// Call the function to find all .env files
const envFiles = utils.findEnvFilesSync(startPath, fileName);

envFiles.forEach(file => {
  console.log(`Loading environment variables from: ${file}`);
  dotenv.config({ path: file });
});

// Define a synchronous sleep function
function sleepSync(milliseconds) {
  const start = new Date().getTime();
  while (new Date().getTime() < start + milliseconds);
}

// sleep based on DEBUG environment variable to give time to attach debugger
if (process.env.DEBUG_DELAY) {
  console.log('DEBUG_DELAY is true, sleeping for 30 seconds...');
  sleepSync(30000); // Sleep for 30000 milliseconds (30 seconds)
  console.log('Woke up!');
} else {
  console.log('DEBUG_DELAY is false, not sleeping.');
}

// Initializes app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000,
});

app.logger.setLevel(process.env.DEBUG ? LogLevel.DEBUG : LogLevel.INFO);
app.logger.debug("logger initialized, loglevel: ", app.logger.getLevel());

utils.getAppName(app);

/* check the feature-flag, if enabled, include the chaoss-slackbot hooks
this will also include the chaoss-africa hooks */
if (process.env.CHAOSS_FEATURE) {
  const chaossSlackbot = require('chaoss-slackbot');
  chaossSlackbot(app);
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

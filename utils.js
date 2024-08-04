const path = require('path');
const fs = require('fs');

function findEnvFilesSync(startPath, fileName) {
  const results = [];

  function recursiveReadDirSync(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        recursiveReadDirSync(filePath);
      } else if (path.basename(filePath) === fileName) {
        results.push(filePath);
      }
    }
  }

  try {
    recursiveReadDirSync(startPath);
  } catch (err) {
    console.error(err);
  }

  return results;
}

async function getAppName(app) {
  try {
    const result = await app.client.auth.test({
      token: process.env.SLACK_BOT_TOKEN
    });

    app.logger.debug(`Bot name: ${result.user}`);
    app.appName = result.user;
    return result.user;
  } catch (error) {
    app.logger.error('Error fetching bot name:', error);
  }
}

module.exports = { findEnvFilesSync, getAppName };
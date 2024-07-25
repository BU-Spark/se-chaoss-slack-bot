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

module.exports = { findEnvFilesSync };
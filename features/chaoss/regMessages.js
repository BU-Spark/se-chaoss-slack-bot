const newbie = require('./responses/newbie');

module.exports = function setupHooks(app) {

  // ********************************NEWBIES*********/
  //This responds to a member when they  type newbie in any channel where the bot is present
  app.message(/newbie/i, async ({ message, client, logger }) => {
    newbie.newHere(message, client, logger);
  });
}
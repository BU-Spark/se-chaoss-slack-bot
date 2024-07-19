const chaossAfrica = require('./actions/africa');

module.exports = function setupHooks(app) {
  //This responds to a member when they  type africa in any channel where the bot is present
  app.message(/africa-info/i, async ({ message, client, logger }) => {
    chaossAfrica.chaossAfrica(message, client, logger);
  });
}

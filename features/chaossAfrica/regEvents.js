const joinChaossAfrica = require('./events/joinChaossAfrica');

module.exports = function setupHooks(app) {
  app.logger.debug(__dirname + __filename + ": made it to setupHooks in regEvents.js");
  // *******When a user join chaossafrica channel, the bot sends a welcome message and the goal of the community******//
  app.event('member_joined_channel', async ({ event, client, logger }) => {
    logger.debug(__dirname + __filename + ": member_joined_channel" + event);
    joinChaossAfrica.joinChaossAfrica(event, client, logger)
  })
}

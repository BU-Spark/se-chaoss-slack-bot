const joinChaossAfrica = require('./events/joinChaossAfrica');

module.exports = function setupHooks(app) {
  // *******When a user join chaossafrica channel, the bot sends a welcome message and the goal of the community******//
  app.event('member_joined_channel', async ({ event, client, logger }) => {
    joinChaossAfrica.joinChaossAfrica(event, client, logger)
  })
}

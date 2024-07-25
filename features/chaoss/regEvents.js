const joinTeam = require('./events/joinTeam');
const memberJoinChannel = require('./events/joinChannel');
const outreachyPrompt = require('./events/outreachyPrompt');

module.exports = function setupHooks(app) {
  app.logger.debug(__dirname + __filename + ": made it to chaoss_eventHooks");

  // When a user joins the team, the bot sends a DM to the newcommer asking them how they would like to contribute
  app.event('team_join', async ({ event, client, logger }) => {
    app.logger.debug(__dirname + __filename + ": in team_join event");
    joinTeam.joinTeamSlack(event, client, logger); // this is the function that sends the DM
    memberJoinChannel.memberJoin(event, client, logger); // this is for the #projectbot channel
  });

  // *************Send message about outreachy**********/
  app.message(/outreachy/i, async ({ message, say, logger }) => {
    outreachyPrompt.outreachyMessage(message, say, logger);
  });
}
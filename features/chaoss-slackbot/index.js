const theActions = require('./actions/actionResponses');
const mentorshipAction = require('./actions/mentorshipAction');
const mentorshipResponses = require('./actions/mentorshipResponses');
const chaossAfrica = require('./actions/africa');

const joinTeam = require('./events/joinTeam');
const memberJoinChannel = require('./events/joinChannel');
const outreachyPrompt = require('./events/outreachyPrompt');
const joinChaossAfrica = require('./events/joinChaossAfrica');

const newbie = require('./responses/newbie');

//module.exports = function setupHooks(app) {
module.exports = function(app) {

    //## Action Hooks

    // handle the button click and show the responses
    app.action('develop', async ({ ack, say }) => {
        await ack();
        theActions.develop(say);
    });

    app.action('joinMeet', async ({ ack, say }) => {
        // Acknowledge the action
        await ack();
        theActions.joinMeet(say);
    });

    app.action('contribute', async ({ ack, say }) => {
        // Acknowledge the action
        await ack();
        theActions.contribute(say);
    });

    app.action('helpWithWebsite', async ({ ack, say }) => {
        await ack();
        theActions.helpWithWebsite(say);
    });

    app.action('docs', async ({ ack, say }) => {
        await ack();
        theActions.docs(say);
    });

    app.action('mentorship', async ({ ack, say }) => {
        await ack();
        mentorshipAction.mentorship(say);
    });

    // this handler is for the nested radio buttons above
    app.action('mentorship_selection', async ({ action, ack, say }) => {
        await ack();
        console.log(action.selected_option.value);
        if (action.selected_option.value === 'outreachy') {
            mentorshipResponses.outreachy(say);
        }
        if (action.selected_option.value === 'gsoc') {
            mentorshipResponses.gsoc(say);
        }
        if (action.selected_option.value === 'gsod') {
            mentorshipResponses.gsod(say);
        }
    });

    app.action('implement_metrics', async ({ ack, say }) => {
        await ack();
        theActions.implement_metrics(say);
    });

    app.action('learn_something_else', async ({ ack, say }) => {
        await ack();
        theActions.learn_something_else(say);
    });

    app.action('faqs', async ({ ack, say }) => {
        await ack();
        theActions.faqs(say);
    });

    //## Event Hooks

    // When a user joins the team, the bot sends a DM to the newcommer asking them how they would like to contribute
    app.event('team_join', async ({ event, client, logger }) => {
        app.logger.debug(__dirname + __filename + ": in team_join event");
        joinTeam.joinTeamSlack(event, client, logger); // this is the function that sends the DM
        memberJoinChannel.memberJoin(event, client, logger); // this is for the #projectbot channel
    });

    // *******When a user join chaossafrica channel, the bot sends a welcome message and the goal of the community******//
    app.event('member_joined_channel', async ({ event, client, logger }) => {
      logger.debug(__dirname + __filename + ": member_joined_channel" + event);
      joinChaossAfrica.joinChaossAfrica(event, client, logger)
    })


    //## Message Hooks

    // *************Send message about outreachy**********/
    app.message(/outreachy/i, async ({ message, say, logger }) => {
        outreachyPrompt.outreachyMessage(message, say, logger);
    });

    // ********************************NEWBIES*********/
    //This responds to a member when they  type newbie in any channel where the bot is present
    app.message(/newbie/i, async ({ message, client, logger }) => {
        newbie.newHere(message, client, logger);
    });

  //This responds to a member when they  type `africa-info` in any channel where the bot is present
  app.message(/africa-info/i, async ({ message, client, logger }) => {
    chaossAfrica.chaossAfrica(message, client, logger);
  });
};


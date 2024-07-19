const theActions = require('./actions/actionResponses');
const mentorshipAction = require('./actions/mentorshipAction');
const mentorshipResponses = require('./actions/mentorshipResponses');

module.exports = function setupHooks(app) {
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
};
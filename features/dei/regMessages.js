const msgChecker = require('./messageChecker');

module.exports = function setupHooks(app) {
    // listen for all messages
    app.message(async ({ message, client, say }) => {
        if (!message.text && !message.file) {
            return;
        }
        msgChecker.checkMessage(message.user, message.channel, message.text, message.ts);
    })
};
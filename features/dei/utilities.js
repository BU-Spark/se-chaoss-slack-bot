async function deleteMessage(app, channel, ts) {
    try {
        const result = await app.client.chat.delete({
            channel: channel,
            ts: ts,
            token: process.env.DELETE_TOKEN, // Use the admin (user) token for this operation
        });
        logger.debug("!! im delete bad msg !!");
    } catch (error) {
        console.error(error);
        if (error.data && error.data.error === 'cant_delete_message') {
            console.log('!! Please make sure the DELETE_TOKEN is correct !!');
        } else {
            console.log("delete err generic.");
        }
    }
}

// Privately DM's the user
async function talksWithThemPrivate(app, userId, message) {
    //async function dmUser(app, userId, message) {
    try {
        const result = await app.client.chat.postMessage({
            channel: userId,
            text: message,
        });
        logger.debug("Private message sent:", result);
    } catch (error) {
        console.error("Failed to send private message:", error);
    }
}

// button to learn more
//async function talksWithThemButton(app, channel, user, message) {
async function talksWithThemButton(app, channel, user, message) {
    try {
        const result = await app.client.chat.postEphemeral({
            channel: channel,
            user: user,
            text: message,
            token: process.env.SLACK_BOT_TOKEN,
            blocks: [
                {
                    type: 'section',
                    text: {
                        type: 'mrkdwn',
                        text: message,
                    },
                    accessory: {
                        type: 'button',
                        text: {
                            type: 'plain_text',
                            text: 'Why?',
                        },
                        style: 'primary',
                        action_id: 'learn_more',
                    },
                },
            ],
        });
        logger.debug("Ephemeral message with button sent:", result);
    } catch (error) {
        console.error("Failed to send ephemeral message with button:", error);
    }
}

async function talksWithThem(app, channel, user, message) {
    //async function channelEphemeralMsg(app, channel, user, message) {
    try {
        const result = await app.client.chat.postEphemeral({
            channel: channel,
            user: user,
            text: message,
            token: process.env.SLACK_BOT_TOKEN,
        });
        logger.debug("Ephemeral message sent:", result);
    } catch (error) {
        console.error("Failed to send ephemeral message:", error);
    }
}

module.exports = {
    talksWithThemPrivate,
    talksWithThemButton,
    talksWithThem,
    deleteMessage
 };

const adminCommands = require('./adminCommands');

// Commands to help admins manage the bad words list and dictionary for the "Why?" button
const adminHelpText = `
*Available Commands for Admins:*

*!addword <word> <reason>* - Adds a word to the bad words list with a specific reason. Usage: \`!addword example "This is a bad word because..."\`
*!removeword <word>* - Removes a word from the bad words list. Usage: \`!removeword example\`
*!adddefinition <word> <definition>* - Adds a definition to a word in the dictionary. Usage: \`!adddefinition conjecture "A conclusion deduced by surmise or guesswork."\`
*!editdefinition <word> <newDefinition>* - Updates an existing definition of a word in the dictionary. Usage: \`!editdefinition conjecture "An inference or conclusion drawn or deduced by surmise or guesswork."\`
*!removefromdict <word>* - Removes a word and its definitions from the dictionary. Usage: \`!removefromdict conjecture\`
*!badwords* - Prints all custom badwords and their reason for blockage
`;

// Help for regular users
const helpText = `
This bot monitors for bad or insensitive language and reminds users to not use it. Where possible, the bot will also try to explain why the language is harmful.
`;

module.exports = function setupHooks(app) {
    app.message(/^!dei help$/i, async ({ message, client, say }) => {
        if (message.channel_type === 'im') {
            const userInfo = await client.users.info({ user: message.user });
            if (userInfo.user.is_admin) { // Ensure that the user is an admin
                await say({
                    channel: message.channel,
                    text: adminHelpText
                });
            } else {
                await say({
                    channel: message.channel,
                    text: helpText
                });
            }
        }
    });

    app.message('message.im', async ({ message, say }) => {
        if (!message.text && !message.file) {
            return;
        }
        const user = result.user;
        const text = message.text.trim();
        const addCommand = text.match(/^!addword\s+(\S+)\s+(.+)$/i);
        const removeCommand = text.match(/^!removeword\s+(\S+)$/i);
        const addDefinitionCommand = text.match(/^!adddefinition\s+(\S+)\s+(.+)$/i);
        const editDefinitionCommand = text.match(/^!editdefinition\s+(\S+)\s+(.+)$/i);
        const removeFromDictCommand = text.match(/^!removefromdict\s+(\S+)$/i);
        const badWordList = text.match(/^!badwords\s+(\S+)$/i);

        if (addCommand || removeCommand || addDefinitionCommand ||
            editDefinitionCommand || removeFromDictCommand || badWordList) {
            if (!user.is_admin) { //return as fast as possible
                await say("Sorry, you do not have the permissions to access this command.");
            }
            else {
                //couldn't figure out a cheap way to make this a switch
                if (addCommand) {
                    const sayBack = adminCommands.addCommand(message, client);
                    await say(sayBack);
                } else if (removeCommand) {
                    const sayBack = adminCommands.removeCommand(message, client);
                    await say(sayBack);
                } else if (addDefinitionCommand) {
                    const sayBack = adminCommands.addDefinitionCommand(message, client);
                    await say(sayBack);
                } else if (editDefinitionCommand) {
                    const sayBack = adminCommands.editDefinitionCommand(message, client);
                    await say(sayBack);
                } else if (removeFromDictCommand) {
                    const sayBack = adminCommands.removeFromDictCommand(message, client);
                    await say(sayBack);
                } else if (badWordList) {
                    const sayBack = adminCommands.getBadWordsDescriptionsCommand(message, client);
                    await say(sayBack);
                }
            }
        }
        else {
            //not a command, so do nothing
            return;
        }
    });

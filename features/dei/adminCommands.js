/*
async function addCommand(message, client) {
    const [, word, reason] = addCommand;
    dictionary.addWord(word, reason);
    return `Added "${word}" to the bad words list with reason: ${reason}. Please use !adddefinition to add a definition for this offensive word as well.`;
}

async function removeCommand(message, client, logger) {
    const [, word] = message.match(/^!removeword\s+(\S+)$/i) || [];
    removed = dictionary.removeWord(word);
    if (removed) {
        return (`Removed "${word}" from the bad words list.`);
    }
    return (`Could not find "${word}" in the bad words list.`);
}

async function addDefinitionCommand(message, client, logger) {
    const [, word, definition] = message.match(/^!adddefinition\s+(\S+)\s+(.+)$/i) || [];
    //use addWord to add the definition
    dictionary.addWord(word, definition);
    return `Added definition for "${word}": ${definition}.`;
}

async function editDefinitionCommand(message, client, logger) {
    const [, word, newDefinition] = message.match(/^!editdefinition\s+(\S+)\s+(.+)$/i) || [];
    //use addWord to edit the definition
    dictionary.addWord(word, newDefinition);
    return `Updated definition for "${word}" to: ${newDefinition}.`;
}

async function removeFromDictCommand(message, client, logger) {
    const [, word] = message.match(/^!removefromdict\s+(\S+)$/i) || [];
    dictionary.removeWord(word);
    return `Removed "${word}" from the dictionary.`;
}

/* i think i don't need this here
async function getBadWordsReasonsCommand(message, client, logger) {
    const badWordReasons = dictionary.getWordReasons();
    return `Bad Words Reasons: ${badWordReasons.join(', ')}`;
}

,
    getBadWordsReasonsCommand

module.exports = {
    addCommand,
    removeCommand,
    addDefinitionCommand,
    editDefinitionCommand,
    removeFromDictCommand
};
*/
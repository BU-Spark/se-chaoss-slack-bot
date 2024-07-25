module.exports = function setupHooks(app) {
  // Handle the "Why?" button click
  app.action('learn_more', async ({ ack, user, channel, body, context }) => {
    // Acknowledge the action
    await ack();

    // Create an array of promises using getWrapper function to get definitions
    const promises = flaggedWord.map(word => getWrapper(word).then(definitions => {
      return { word, definitions };
    }).catch(error => {
      console.error(`Failed to fetch definition for ${word}:`, error);
      return { word, error: error.message };
    }));

    // Wait for all promises to resolve
    const results = await Promise.all(promises);

    // Store the definitions for each word in the cache
    results.forEach(result => {
      definitionsCache.set(result.word, { definitions: result.definitions, index: 0 });
    });

    // send the first definition and a button to request an alt definition for each word using the button
    results.forEach(async (result, i) => {
      if (result.definitions && result.definitions.length > 0) {
        await app.client.chat.postEphemeral({
          channel: body.channel.id,
          user: body.user.id,
          text: `*Definition 1 for ${result.word}*: ${result.definitions[0]}`,
          blocks: [{
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": `*Definition 1 for ${result.word}*: ${result.definitions[0]}`
            },
            "accessory": {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Show another definition"
              },
              "action_id": `definition_next_${result.word}`
            }
          }],
          token: context.botToken,
        });
      } else {
        await app.client.chat.postEphemeral({
          channel: body.channel.id,
          user: body.user.id,
          text: `*No definition found for ${result.word}*`,
          token: context.botToken,
        });
      }
    });
  });

  // handles the second button click
  app.action(/^definition_next_/, async ({ ack, body, channel, context, action }) => {
    // Acknowledge the action
    await ack();

    // Get the word from the action ID
    const word = action.action_id.split('_')[2];

    // Get the definitions and the current index from the cache
    const cache = definitionsCache.get(word);
    const definitions = cache.definitions;
    const index = cache.index;

    // Check if there are more definitions
    if (index + 1 < definitions.length) {
      // Update the index in the cache
      definitionsCache.set(word, { definitions, index: index + 1 });

      // Send the next definition
      await app.client.chat.postEphemeral({
        channel: body.channel.id,
        user: body.user.id,
        text: `*Definition ${index + 2} for ${word}*: ${definitions[index + 1]}`,
        token: context.botToken,
      });
    } else {
      // Send a message saying "That's all"
      await app.client.chat.postEphemeral({
        channel: body.channel.id,
        user: body.user.id,
        text: `That's all for "${word}".`,
        token: context.botToken,
      });
    }
  });
}
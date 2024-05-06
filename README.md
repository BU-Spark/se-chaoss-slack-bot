# CHAOSS SLACK BOT

## About

This holds the code to the CHAOSS slack bot for newcomers to the project.  Built with  [Bolt for JavaScript](https://slack.dev/bolt-js/concepts). For an open source community to grow, supporting newcomers and providing them with the information they need to contribute is really important. CHAOSS Slack Bot aims to provide a solution to this problem. Thanks for checking us out!

## Documentation
For more information about this project, read the [CHAOSS Slack Bot Docs](https://github.com/chaoss/chaoss-slack-bot/wiki).

## Bot Functions

- When a user joins the team, sends a message in a predefined channel asking them to introduce themselves.
- When a user joins the team, sends an interactive message via DM to determine how they intend to contribute and provide the relevant resources.
- When a user types “newbie” in a channel or to the bot directly, sends an interactive message showing ways you can contribute.
- When a user types “outreachy” in a channel or to the bot directly, responds with information about Outreachy.
- Responds when a user says "hello", "hey" or "hi".
- Can send a DM to all users in the workspace, triggered by the message “intro-CHAOSS”.
- When a user sends a non-inclusive word, the bot deletes it
- When the bot deletes a message, it sends the user a private message to explain why their message was flagged, potentional alternatives and a "Learn more" button
- When a user presses the "Learn more" button, they will privately be provided with a definition of the word(s) that was flagged
- When a definition is sent to the user, a "Show another definition" button is displayed
- When the "Show another definition" button is pressed, an alternative definiton is displayed until it runs out of definitions
- Administrators can manage a custom list of blocked words, but all standard offensive/non-inclusive terms are already blocked

## Technical Overview
- The bot itself is written in JavaScript, particularly using the Bolt framework to implement the Slack API
- Words are parsed using the [alex](https://github.com/get-alex/alex) library, which implements the [retext](https://github.com/retextjs/retext) NLP engine.
- To accomodate for additional flagged words, the filesystem module is used to create a custom JSON which stores the words and definitions of these words.
- The ephemeral message provides definitions loaded from the provided dictionary in the repo, which is a copy of the [Wordset dictionary](https://github.com/wordset/wordset-dictionary/tree/master).

## Running the bot
- To run the bot, it is first advised to install all applicable npm packages.
- Afterwards, environment variables must be set. The bot requires a slack bot token, signing secret, and app token, to all be set with the following names: SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN
- Additionally, the bot requires a Slack user token of an administrator to be supplied as the DELETE_TOKEN. This is imperative to the bots function, as without the user token, moderation can not occur.
- Ensure that proper permissions are given to app.js, as it will need to read and write to custom.json in the root directory.
- After all these steps are followed, simply run "node app.js" to run the bot.

## Currently Known Issues
- At the moment, the bot does not have any issues, bugs, or errors. However, please open a GitHub issue to track any issues that are found.

## Deployment
- The deployment of this bot does not require any particularly specific instructions. You can follow the section titled **Running the bot** as an alternative. These instructions apply to any deployment services or other hosted application services. As long as the environment variables are set and the file system permissions are correct, alongside the applicable node modules being installed, the bot will deploy properly.

## Getting Started
If you're interested in cloning our bot for your Slack workspace, you can follow the steps in the [CONTRIBUTING.md](https://github.com/chaoss/chaoss-slack-bot/blob/main/CONTRIBUTING.md) to setup, and [https://slack.dev/bolt-js/deployments/heroku](https://slack.dev/bolt-js/deployments/heroku) or [https://slack.dev/bolt-js/deployments/aws-lambda](https://slack.dev/bolt-js/deployments/aws-lambda) to deploy.

## Contributing

To contribute to CHAOSS Slack bot, please follow the guidelines found in our [CONTRIBUTING.md](https://github.com/chaoss/chaoss-slack-bot/blob/main/CONTRIBUTING.md) and our [Code of Conduct](https://github.com/chaoss/.github/blob/main/CODE_OF_CONDUCT.md). We love pull requests! We welcome contributions from everyone, whether it's your 1st or your 100th. If you get stuck, please feel free to [ask for help](https://github.com/chaoss/chaoss-slack-bot/issues/new)!

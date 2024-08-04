async function chaossAfrica(message, client, logger) {
	try {
		const chaossChannels = {
			communityManagers: process.env.CHAOSS_CHANNEL_COMMUNITY_MANAGERS,
			designers: process.env.CHAOSS_CHANNEL_DESIGNERS,
			developers: process.env.CHAOSS_CHANNEL_DEVELOPERS,
			technicalWriters: process.env.CHAOSS_CHANNEL_TECHNICAL_WRITERS,
			researchers: process.env.CHAOSS_CHANNEL_RESEARCHERS
		};
		helper = process.env.CHAOSS_AFRICA_HELP_USER_ID;
		return await client.chat.postMessage({
			channel: message.user,
			blocks: [
				{
					type: "section",
					text: {
						type: "mrkdwn",
						text: `Welcome <@${message.user}>! The goal of CHAOSS Africa is to identify and solve challenges African Open Source Contributors face and also contribute to the larger CHAOSS group. We usually have our community meetings, once every two weeks, Thursdays at 3 PM WAT!

            \nIn the meantime, you should check out our different focus group channels and join one of them depending on your skillset:

            - <#${chaossChannels.communityManagers}> for community managers
            - <#${chaossChannels.designers}> for designers
            - <#${chaossChannels.developers}> for developers
            - <#${chaossChannels.technicalWriters}> for technical writers
            - <#${chaossChannels.researchers}> for researchers and data scientists

            \nIf you have any questions, you can ask <@U0174P1MDAP> or on the channel.

            `,
					},
				},
			],
			text: `Welcome to CHAOSS Africa, <@${helper}>! 🎉.`,
		});
	} catch (error) {
		console.log(error);
		logger.error(error);
	}
}

exports.chaossAfrica = chaossAfrica;

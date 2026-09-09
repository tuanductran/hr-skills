import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';

import { commands } from './commands/index.ts';
import { env } from './env.ts';

// Slash-command-only bot: no message content or member intents needed.
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commandsByName = new Map(commands.map((command) => [command.data.name, command]));

client.once(Events.ClientReady, (readyClient) => {
	console.log(
		`Logged in as ${readyClient.user.tag}. Serving ${commandsByName.size} command(s).`,
	);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isAutocomplete()) {
		const command = commandsByName.get(interaction.commandName);
		if (!command?.autocomplete) return;

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(
				`Error executing autocomplete for "${interaction.commandName}":`,
				error,
			);
		}
		return;
	}

	if (!interaction.isChatInputCommand()) return;

	const command = commandsByName.get(interaction.commandName);

	if (!command) {
		console.warn(`Received unknown command: ${interaction.commandName}`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`Error executing command "${interaction.commandName}":`, error);

		const errorReply = {
			content: 'Something went wrong while running that command.',
			flags: MessageFlags.Ephemeral,
		} as const;

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(errorReply);
		} else {
			await interaction.reply(errorReply);
		}
	}
});

await client.login(env.DISCORD_TOKEN);

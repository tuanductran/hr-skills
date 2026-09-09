/**
 * Registers this bot's slash commands with Discord.
 *
 * Run manually (`bun run deploy-commands`) whenever a command is added,
 * removed, or its options change — not on every bot boot. If
 * `DISCORD_GUILD_ID` is set, commands are registered to that guild only
 * (near-instant propagation, ideal for development). Otherwise they're
 * registered globally (can take up to an hour to propagate everywhere).
 */

import { REST, Routes } from 'discord.js';

import { commands } from './commands/index.ts';
import { env } from './env.ts';

const body = commands.map((command) => command.data.toJSON());
const rest = new REST().setToken(env.DISCORD_TOKEN);

const route = env.DISCORD_GUILD_ID
	? Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, env.DISCORD_GUILD_ID)
	: Routes.applicationCommands(env.DISCORD_CLIENT_ID);

console.log(
	`Deploying ${body.length} command(s) ${env.DISCORD_GUILD_ID ? `to guild ${env.DISCORD_GUILD_ID}` : 'globally'}…`,
);

const result = await rest.put(route, { body });
const deployedCount = Array.isArray(result) ? result.length : 0;

console.log(`Deployed ${deployedCount} command(s) successfully.`);

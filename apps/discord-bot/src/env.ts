/**
 * Environment configuration.
 *
 * Bun loads `.env` (and `.env.local`) automatically — no `dotenv` dependency
 * needed. This module only validates that the required variables are present
 * and exports them as a typed, readonly object so the rest of the bot never
 * touches `process.env` directly.
 */

function required(name: string): string {
	const value = Bun.env[name];

	if (!value || value.trim().length === 0) {
		throw new Error(
			`Missing required environment variable "${name}". Copy .env.example to .env and fill it in.`,
		);
	}

	if (name === 'DISCORD_TOKEN' && !value.includes('.')) {
		throw new Error(
			`Invalid DISCORD_TOKEN format. It looks like you copied the Client Secret instead of the Bot Token.\nGo to Discord Developer Portal → Applications → [Your App] → Bot → Reset Token to copy your Bot Token (it should contain "." separators).`,
		);
	}

	return value;
}

export const env = {
	/** Discord bot token, from the Discord Developer Portal → Bot → Token. */
	DISCORD_TOKEN: required('DISCORD_TOKEN'),
	/** Discord application (client) ID, used to register slash commands. */
	DISCORD_CLIENT_ID: required('DISCORD_CLIENT_ID'),
	/**
	 * Optional guild ID for instant, guild-scoped command deployment during
	 * development. Global command deployment (omit this) can take up to an
	 * hour to propagate.
	 */
	DISCORD_GUILD_ID: Bun.env['DISCORD_GUILD_ID'],
} as const;

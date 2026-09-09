# hr-skills-discord-bot

Discord bot for discovering [HR Skills](../../README.md) — search, inspect, and
get related-skill recommendations, backed by the same `registry/skills.json`
and search/recommendation logic (`hr-skills-build`) that powers `apps/web`.

Slash-command only, built on [`discord.js@14.27.0`](https://discord.js.org/docs/packages/discord.js/14.27.0),
100% Bun + TypeScript.

## Commands

| Command | Description |
| --- | --- |
| `/skill-find query:<text> [domain] [limit]` | Search the registry by keyword, optionally filtered to one domain |
| `/skill-info id:<id or alias>` | Show full detail for one skill |
| `/skill-random` | Surface a random skill |
| `/skill-recommend id:<id or alias> [limit]` | Show skills commonly used together with a given skill |

## Setup

1. Create an application at the [Discord Developer Portal](https://discord.com/developers/applications),
   add a Bot user, and invite it to your server with the `applications.commands` scope.
2. Copy `.env.example` to `.env` and fill in `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`,
   and (optionally, for fast local iteration) `DISCORD_GUILD_ID`.
3. From the repo root, build the workspace's TypeScript packages once so
   `hr-skills-build` / `hr-skills-ref` resolve:

   ```sh
   bun install
   bun run build
   ```

4. Generate the registry the bot reads from, if it isn't already committed
   or is stale:

   ```sh
   bun run registry
   ```

5. Register the slash commands with Discord (run again whenever a command
   is added, removed, or its options change):

   ```sh
   cd apps/discord-bot
   bun run deploy-commands
   ```

6. Start the bot:

   ```sh
   bun run start   # or: bun run dev  (watch mode)
   ```

## Notes

- This is a Gateway bot (`discord.js` `Client` + `client.login`), so it needs
  a long-running process — a VPS with `pm2`/`systemd`, a container, etc.
  Not deployable to a request/response serverless platform (Vercel Functions,
  Cloudflare Workers) as-is; that would require rewriting it as an HTTP
  Interactions endpoint instead of a Gateway client.
- The registry is read once at startup and cached in memory
  (`src/registry.ts`). Redeploy the bot after running `bun run registry`
  at the repo root to pick up registry changes.

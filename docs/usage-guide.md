# Usage guide

This guide explains how to load this package into Claude, ChatGPT, or
another AI tool so you can start asking HR questions right away.

## What's in this package

| File / folder | What it is |
| --- | --- |
| `SKILL.md` | The root skill router — an overview of every HR skill included |
| `skills/hr-*/` | One folder per HR skill, each with its own `SKILL.md` and optional `content/`, `prompts/`, `examples/` files |
| `LICENSE` | Usage license for the content |
| `docs/usage-guide.md` | This file |
| `.claude-plugin/marketplace.json` | Only present in `.skill` packages — a manifest Claude's marketplace tooling reads; not needed for manual upload |

## Using it with Claude

Claude has a dedicated Skills feature that reads `SKILL.md` frontmatter
directly.

**claude.ai:**

1. Go to **Settings > Features > Skills** (or **Settings > Customize >
   Skills**, depending on your plan).
2. Upload this package.
3. Claude reads the `SKILL.md` files automatically and lists the available
   HR skills. Skills activate automatically when your question matches a
   skill's description, or you can enable/disable individual skills from
   the Skills menu in a chat.

**Claude Code:**

```bash
# Extract the archive first, then copy the skills you want
cp -r skills/hr-recruiting ~/.claude/skills/   # one skill
cp -r skills/hr-* ~/.claude/skills/             # the full set
```

Once copied, simply describe your HR task — Claude Code automatically
discovers and loads the most relevant skill.

If you don't have Skills access, any `SKILL.md` (and its `content/`,
`prompts/`, `examples/` files) is also plain Markdown — upload it as
Project Knowledge instead and reference it directly in chat.

## Using it with ChatGPT

ChatGPT doesn't read Claude's `SKILL.md` frontmatter, but it can still use
the content as reference material through a custom GPT's Knowledge:

1. Create a custom GPT (or open an existing one) and go to **Configure >
   Knowledge**.
2. Upload this package as a zip file.
3. Ask questions in chat — the GPT retrieves relevant HR skill content to
   answer them.

Two limits to keep in mind: knowledge uploads share a per-account storage
cap, and very large zip files have occasionally failed to extract for some
users — if that happens, zip and upload a single skill folder (for example
just `skills/hr-recruiting/`) instead of the whole package.

## Using it with other AI tools

Any tool that accepts file or zip uploads for a knowledge base (self-hosted
RAG tools, other vendor assistants, IDE-integrated agents) can generally
use this package the same way as ChatGPT: upload it, and let the tool's own
retrieval index the Markdown content. Tools that implement the open Agent
Skills specification can read `SKILL.md` frontmatter directly, the same way
Claude does.

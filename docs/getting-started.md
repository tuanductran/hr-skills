# Getting started

HR Skills is a collection of 15 AI skill files for Claude that cover the full range of HR work — from recruiting and onboarding to compliance, analytics, and leadership development.

Each skill is a `SKILL.md` file that Claude reads to understand what HR tasks it can help with and how to approach them professionally.

## How it works

1. You install one or more skills into Claude.
2. Claude reads the skill file and gains structured HR knowledge.
3. You describe your HR task in plain language — Claude picks up the right skill and assists.

## Quick start

### Claude code (CLI)

Copy any skill into your `~/.claude/skills/` directory:

```bash
cp -r skills/hr-recruiting ~/.claude/skills/
```

Then ask Claude Code:

```text
Write a job description for a Senior Software Engineer
```

### claude.ai

Open a project on claude.ai, go to **Project knowledge**, and upload the `SKILL.md` file for the skill you want. Or paste the file contents directly into the conversation.

## Try your first skill

The fastest way to see HR Skills in action:

1. Install `hr-recruiting`:

   ```bash
   cp -r skills/hr-recruiting ~/.claude/skills/
   ```

2. Open Claude Code and type:

   ```text
   Create behavioral interview questions for a Product Manager role
   ```

Claude will use the recruiting skill to generate structured, competency-based questions.

## Next steps

- [Installation guide](./installation.md) — all install methods in detail
- [All skills](./skills.md) — full list with descriptions and trigger phrases
- [Contributing](./contributing.md) — add your own HR skill

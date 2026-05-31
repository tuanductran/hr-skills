---
description: Scaffold a new hr-* skill directory and SKILL.md template
---

# New skill

Ask the user for the skill name. It must start with `hr-` and use kebab-case only (for example `hr-retention`, `hr-interviewing`). If the name does not follow this format, prompt again.

Once you have a valid name, derive two values:

- `<full-name>` — the full name the user provided (e.g. `hr-retention`)
- `<short-name>` — the part after `hr-` (e.g. `retention`)

Then:

1. Create the directory `skills/<full-name>/`
2. Create `skills/<full-name>/SKILL.md` using the template below — replace every `<full-name>`, `<short-name>`, and `<placeholder>` with appropriate content based on the skill name the user provided
3. Tell the user: "Skill scaffolded. Now edit the file to add real content, then run `bun run sync` followed by `bun run validate`."

Use this exact template:

````markdown
---
name: <full-name>
description: >
  A concise description of at least 50 characters that explains what this skill
  covers and when to use it. Include HR trigger phrases such as "write a [task]",
  "create a [deliverable]", or "analyze [topic]".
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR <short-name>

Brief one-paragraph overview of what this skill covers and who it helps.

## Supported tasks

- [Task 1]
- [Task 2]
- [Task 3]
- [Task 4]
- [Task 5]
- [Task 6]
- [Task 7]
- [Task 8]

## Key prompts

### [Subtopic 1]

1. "[Prompt for [context]]"
2. "[Prompt for [role] focused on [area]]"
3. "[Prompt using [variable] to [goal]]"
4. "[Prompt that addresses [scenario]]"

### [Subtopic 2]

1. "[Prompt for [context]]"
2. "[Prompt for [role] focused on [area]]"
3. "[Prompt using [variable] to [goal]]"
4. "[Prompt that addresses [scenario]]"

### [Subtopic 3]

1. "[Prompt for [context]]"
2. "[Prompt for [role] focused on [area]]"
3. "[Prompt using [variable] to [goal]]"
4. "[Prompt that addresses [scenario]]"

## Tips
- [Professional best-practice tip 1]
- [Professional best-practice tip 2]
- [Professional best-practice tip 3]
- [Professional best-practice tip 4]
````

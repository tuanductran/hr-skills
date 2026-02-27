# skills-ref

Reference library for Agent Skills — validate, read, and generate prompts from `SKILL.md` files.

TypeScript port of [agentskills/agentskills skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref), compiled with `tsc`.

## Installation

```bash
bun install
bun run build
```

## CLI usage

```bash
# Validate a skill directory
node dist/cli.js validate path/to/skill

# Read skill properties as JSON
node dist/cli.js read-properties path/to/skill

# Generate <available_skills> XML for agent prompts
node dist/cli.js to-prompt path/to/skill-a path/to/skill-b
```

After `bun link` or installing globally, use `skills-ref` directly:

```bash
skills-ref validate skills/hr-recruiting
skills-ref read-properties skills/hr-analytics
skills-ref to-prompt skills/hr-recruiting skills/hr-analytics
```

## Programmatic API

```typescript
import { validate, readProperties, toPrompt } from "skills-ref";

// Validate a skill directory
const errors = validate("skills/hr-recruiting");
if (errors.length === 0) console.log("Valid!");

// Read properties
const props = readProperties("skills/hr-recruiting");
console.log(props.name, props.description);

// Generate prompt XML
const xml = toPrompt(["skills/hr-recruiting", "skills/hr-analytics"]);
console.log(xml);
```

## Output formats

### `read-properties` (JSON)
```json
{
  "name": "hr-recruiting",
  "description": "Help HR managers with end-to-end recruiting...",
  "metadata": {
    "author": "Tuan Duc Tran",
    "version": "1.0.0"
  }
}
```

### `to-prompt` (XML)
```xml
<available_skills>
<skill>
<name>hr-recruiting</name>
<description>Help HR managers with end-to-end recruiting...</description>
<location>/path/to/skills/hr-recruiting/SKILL.md</location>
</skill>
</available_skills>
```

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Validation errors or parse error |

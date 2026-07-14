---
name: hr-root-router-maintaining
description: "Maintenance guide for the root SKILL.md router in the hr-skills monorepo. Use this skill when adding a new HR skill package, removing a deprecated skill, renaming a skill directory, moving a skill between routing sections, or auditing the router for consistency with the actual skills/ directory."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR root router maintenance

The root `SKILL.md` at the repository root is the entry point for the entire HR Skills library. It does not contain HR knowledge — its only job is to route requests to the right specialized skill package under `skills/`.

This skill tells AI assistants exactly how to update that router whenever the library changes.

## Supported tasks

- Add a new skill entry to the correct routing section
- Remove a deprecated skill from the routing table
- Rename a skill entry when its directory is renamed
- Move a skill entry between routing sections
- Audit router for skills missing from the table or directories missing from `skills/`
- Update the frontmatter `description` field when new domains are added
- Suggest which routing section a new skill belongs in
- Generate a complete, ready-to-paste router table row
- Validate that all `skills/<n>/SKILL.md` paths resolve correctly

## Router structure

The root `SKILL.md` has this layout — every edit must preserve it exactly:

```text
frontmatter (---...---)
  name: hr-skills
  description: "..."       ← update when adding an entirely new domain
  metadata:
    author: Tuan Duc Tran
    version: "1.0.0"       ← bump patch version on every router change

# HR Skills              ← H1, never change
intro paragraph          ← never change

## How to use this skill ← never change
numbered rules 1-5       ← never change

## Routing tables        ← H2, never change
### <Section name>       ← H3 section headers (see canonical list below)
| Skill | Use when... |  ← routing table rows
...

## Notes                 ← H2, never change
```

## Canonical routing sections

These are the current H3 section headers in order. New skills go into an existing section whenever possible. Only add a new H3 section when no existing one fits.

1. `### Talent acquisition & recruiting`
2. `### Onboarding, offboarding & people operations`
3. `### Performance, talent & career management`
4. `### Compensation, benefits & rewards`
5. `### Learning & development`
6. `### Organizational development, design & change`
7. `### Workforce planning & analytics`
8. `### HR technology, data & AI`
9. `### Compliance, labor relations & risk`
10. `### Culture, engagement, experience & wellbeing`
11. `### Project management & global/local context`
12. `### Software-engineering & technical hiring specialists`

Section 12 has a two-column format `| Skill | Discipline |` instead of `| Skill | Use when the task involves... |` — use the discipline column for tech-specialist skills.

## Key prompts

### Adding a new skill

1. "Add [hr-new-skill] to the root SKILL.md router. The skill covers [description of scope]. Suggest the right section and generate the table row."
2. "I just created skills/hr-[name]/SKILL.md. Update the router to include it. Here is the skill's description field: [paste description]."
3. "Generate a router table row for a new skill called hr-[name] that handles [scope]. Include the markdown link in the correct format."

### Removing or renaming a skill

1. "Remove hr-[old-name] from the root SKILL.md router. The skill directory has been deleted."
2. "Rename hr-[old-name] to hr-[new-name] in the router. Update the link and keep everything else the same."
3. "hr-[name] has been merged into hr-[other-name]. Remove the old entry and update the surviving skill's 'Use when' description to cover both scopes."

### Moving a skill between sections

1. "Move hr-[name] from '### [current section]' to '### [target section]' in the router."
2. "hr-[name] fits better under [section] than its current section. Relocate it and keep the row content unchanged."

### Auditing the router

1. "Audit the root SKILL.md against the actual skills/ directory and list any mismatches: skills in the directory not in the router, or router entries pointing to non-existent directories."
2. "Check every markdown link in the routing tables and confirm the target path exists under skills/."
3. "List all skills currently in the router by section."

### Updating scope

1. "The router description field doesn't mention [new domain]. Update it to include [domain] without making the description longer than it currently is."
2. "Add a note to the ## Notes section explaining [new convention]."

## Editing rules

Follow these rules exactly when editing the root `SKILL.md`.

**Table row format** — always use this exact format, no variation:

```markdown
| [hr-skill-name](skills/hr-skill-name) | One-line description of when to use this skill |
```

- The link text is the skill slug only, no spaces, no decoration.
- The link target is `skills/hr-skill-name` — a relative path, no leading slash, no `.md`.
- The "Use when" column starts with a noun phrase or verb phrase describing the task, not "Use when the task involves" — that prefix lives in the column header only.

**Section 12 row format** (tech-specialist skills):

```markdown
| [hr-skill-name](skills/hr-skill-name) | Short discipline label (e.g. "Backend engineering, APIs, databases") |
```

**Version bump** — every time the router changes, increment the patch version in frontmatter:

```yaml
version: "1.0.0"  →  version: "1.0.1"
```

**Placement within a section** — insert new rows alphabetically by skill slug within the section, unless there is a logical grouping reason to place it elsewhere (e.g. keep closely related skills adjacent).

**Never touch:**

- The `## How to use this skill` block
- The `## Notes` block (unless explicitly asked)
- The H1 `# HR Skills` title
- The intro paragraph under H1
- Existing rows unless they are the target of the edit

## Section assignment guide

Use this table to decide which section a new skill belongs in:

| If the skill covers... | Put it in... |
|---|---|
| Finding, attracting, assessing, or hiring candidates | Talent acquisition & recruiting |
| Starting or ending employment, HR ops, admin | Onboarding, offboarding & people operations |
| Performance, growth, career paths, coaching | Performance, talent & career management |
| Pay, benefits, rewards, job levels | Compensation, benefits & rewards |
| Training, skills, learning programs | Learning & development |
| Org structure, culture change, OD | Organizational development, design & change |
| Headcount forecasting, HR data, workforce models | Workforce planning & analytics |
| HR systems, AI tools, automation, data | HR technology, data & AI |
| Legal, compliance, labor law, risk | Compliance, labor relations & risk |
| Employee experience, culture, DEI, wellbeing | Culture, engagement, experience & wellbeing |
| Cross-functional projects, global/Vietnam context | Project management & global/local context |
| Hiring for a specific technical discipline | Software-engineering & technical hiring specialists |

## Tips

- Always read the existing router table before inserting a new row — confirm the skill does not already exist under a different name before adding a duplicate.
- When unsure which section fits, read the new skill's `description` field and match its primary verb (recruiting vs managing vs analyzing vs designing) to the section guide above.
- After any edit, do a quick count: the number of `| [hr-` links in the router should equal the number of directories under `skills/` that contain a `SKILL.md`.
- The router description field is a single long string — when updating it, preserve the existing domains and append; never replace the whole string.
- Tech-specialist skills (section 12) are meant to be loaded alongside a functional skill (hr-recruiting, hr-job-description, hr-interviewing), not instead of one — if the new skill is a standalone functional skill mistakenly placed in section 12, move it to the correct section.
- Bump the patch version on every router edit so contributors can track the change history without diffing the full file.

## Common mistakes

- Adding a new skill row but forgetting to bump `version` in frontmatter.
- Using an absolute path `skills/hr-name/SKILL.md` instead of the relative path `skills/hr-name` in the link target — the router links point to directories, not files.
- Inserting the row into the wrong table column order (link column must come first, "Use when" second).
- Duplicating an existing entry under a different section without removing the original.
- Adding a new H3 section when the skill clearly fits an existing section — check all 12 sections before creating a new one.
- Editing the `## How to use this skill` block when only a routing table change was needed.
- Forgetting to update the `description` frontmatter field when an entirely new domain (not covered by any existing skill) is added.

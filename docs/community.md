# Community and contributor workflow

This guide supports contributor onboarding, good first issues, review workflow, and sustainability work from issue #50.

## Contributor onboarding

1. Read `README.md`, `docs/getting-started.md`, `docs/skill-format.md`, and `docs/taxonomy.md`.
2. Install dependencies with `bun install`.
3. Create work on a branch that targets `dev`, not `main`.
4. Make the smallest useful change and follow the Conventional Commit format.
5. Run the affected checks before opening a pull request.

## Good first issues

Good first issues should be low-risk, clearly scoped, and useful without requiring deep repository context.

| Issue type | Good first issue criteria | Suggested label |
|------------|---------------------------|-----------------|
| Skill copy improvement | Fix terminology, improve a prompt, or clarify a tip in one skill. | `good first issue`, `content` |
| Example expansion | Add one realistic workflow example using an existing skill. | `good first issue`, `examples` |
| Glossary update | Add or refine a knowledge-base term with a practical HR use case. | `good first issue`, `docs` |
| Metadata cleanup | Improve tags or category alignment for one skill. | `good first issue`, `taxonomy` |
| Test coverage | Add one validation or export compatibility test. | `good first issue`, `tooling` |

## Contribution workflow

- For skill changes, edit the relevant `skills/hr-*/SKILL.md` file and companion `content/hr-*/README.md` only when the human-readable guide also needs to change.
- For new skill directories, run `bun run sync`, `bun run catalog`, and `bun run zip` after adding the skill.
- For metadata or taxonomy changes, update `docs/taxonomy.md`, validation rules, and catalog rendering together.
- For agent export changes, update `packages/hr-skills-build/src/agent-exports.ts`, tests, and installation or usage docs.

## Skill review workflow

Reviewers should check:

- HR-specific value rather than generic management advice
- correct metadata category, tags, status, and recruiting workflow
- 8–12 supported tasks and 4–6 tips
- prompt placeholders for variable user input
- blank lines before lists
- no time-sensitive legal, market, or tool claims unless clearly scoped and maintainable
- validation, catalog generation, and relevant tests pass

## Sustainability

The project accepts community contributions through issues and pull requests. Maintainers should:

- keep `CODEOWNERS`, funding configuration, and issue templates current
- recognize sponsors and repeat contributors in release notes or dedicated documentation when appropriate
- prioritize roadmap work that improves skill quality, compatibility, and contributor experience
- avoid accepting broad rewrites without reviewable scope and clear user value

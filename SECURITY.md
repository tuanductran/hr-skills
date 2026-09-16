# Security policy

## Supported versions

Only the latest version published on `main` is actively maintained.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

If you discover a security issue in this project, report it privately:

- **Email:** [tuanductran.dev@gmail.com](mailto:tuanductran.dev@gmail.com)
- **GitHub:** Use [GitHub private vulnerability reporting](https://github.com/tuanductran/hr-skills/security/advisories/new)

Please include:

- A description of the vulnerability
- Steps to reproduce it
- Any potential impact

You will receive a response within 72 hours. Once a fix is confirmed, a patch will be released and the issue will be disclosed publicly.

## Scope

This repository contains HR prompt content (Markdown) and TypeScript build tooling. Security concerns most likely to apply:

- **Dependency vulnerabilities** in `package.json` dependencies and devDependencies
- **Supply-chain issues** in the Bun/Node ecosystem packages used by the build tooling
- **Sensitive data** accidentally committed (for example credentials or personal information)
- **Prompt-injection and instruction-safety risks** in skill content consumed by AI agents
- **Generated-artifact integrity** when manifests or registries are produced from skill metadata

`SKILL.md` files do not execute code by themselves, but they are instruction content that an AI agent may read and follow. They can therefore carry prompt-injection, unsafe-instruction, misleading-link, credential-disclosure, or other supply-chain risks. The repository's security validators scan skill content for several known dangerous patterns, but those checks are defense-in-depth rather than a proof that content is safe.

When evaluating a report involving skill content, distinguish between:

1. **Repository execution risk** — whether the repository tooling executes something unexpectedly.
2. **Agent instruction risk** — whether a skill can cause an AI agent or downstream integration to take an unsafe or unintended action.
3. **Distribution integrity risk** — whether generated manifests or packaged skill content differ from the canonical source.

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

- **Dependency vulnerabilities** in `package.json` devDependencies
- **Supply chain issues** in the Bun/Node ecosystem packages used by the build tooling
- **Sensitive data** accidentally committed (for example credentials, personal information)

Prompt content itself (the `SKILL.md` files) does not execute code and poses no direct security risk.

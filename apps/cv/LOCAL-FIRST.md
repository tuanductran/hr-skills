# CV Studio local-first architecture

`apps/cv` is a browser-only CV Builder. It does not require login, a backend, or a network connection after the application is loaded.

## Storage model

CV envelopes are stored in IndexedDB under the `hr-skills-cv` database. The current draft pointer is kept in localStorage only as a pointer; the document content remains in IndexedDB. Writes are serialized through a queue so autosave operations cannot overwrite one another out of order.

The database uses an explicit versioned migration hook. Version 2 adds `updatedAt` and `archivedAt` indexes without rewriting existing records. Future migrations should be additive and guarded by `oldVersion`.

## Workspace behavior

The editor supports a genuinely new CV route using `/?new=1`, resumes the current CV after reload, and supports opening a specific document through `/?id=<id>`. The drafts workspace supports search, archive/restore, duplicate, permanent delete, full-workspace JSON backup, collision-safe import and multi-tab refresh notifications.

## Backup and privacy

The export file contains all local CV envelopes and should be kept private. Imports validate each document through the canonical `hr-cv` Valibot schema and always assign a new ID, so an import cannot silently overwrite an existing local CV. The application does not provide cloud sync, recovery, account access, or encrypted backup in this MVP.

## Commands

```bash
bun install
bun run --cwd apps/cv dev
bun run --cwd apps/cv typecheck
bun run --cwd apps/cv test:unit
bun run --cwd apps/cv test:e2e:server
```

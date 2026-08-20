# apps/jd local-first architecture

`apps/jd` is intentionally a local-first MVP. It does not require an account, a database, or a network request to create and edit a job description.

## Storage model

Draft documents are stored in the browser's IndexedDB database `hr-skills-jd`. The current draft ID is stored in localStorage only as a small pointer. Job description content is never placed in cookies because cookies are sent with requests and have a very small size limit.

Each saved draft contains the structured `hr-jd` document, editorial status, version, created timestamp, updated timestamp and archive timestamp. The editorial status flow is `Draft` → `Ready for review` → `Approved` → `Published locally`. The final state is intentionally local-only: it records that the document is approved/published in this browser, but it does not create a public URL, send a network request or publish to an external job board. Autosave is debounced in the editor. The `/drafts` page reads the same local store and supports title search, status filtering, archive, restore, duplicate, permanent delete and resume. A `BroadcastChannel` refreshes open workspace views when another tab changes the store.

## Backup and device changes

Use **Export backup** on `/drafts` before changing browsers or devices. The resulting JSON file can be imported with **Import backup**; every imported record receives a new local ID so a backup cannot overwrite an existing draft. The workspace also supports a full local-workspace backup, while JSON, Markdown and DOCX exports are available from the editor. Invalid JSON/schema files are rejected without writing records. Storage failures, including unavailable or full browser storage, are surfaced as actionable UI errors.

A local browser store is not synchronization or public publishing. If the browser profile is cleared, the drafts are lost unless a backup exists. The product should communicate this limitation clearly instead of pretending that a cookie is a multi-device backup.

## Schema migrations and integrity

The database is opened with an explicit version number. Version 2 creates `updatedAt` and `archivedAt` indexes only when upgrading from an older version, without rewriting existing records. Future schema changes should add a guarded `oldVersion` migration step, preserve backward readability where possible and increment `DB_VERSION`. Writes are serialized through a small in-memory queue so rapid autosave events do not race each other.

## Security boundary

The local-first MVP has no authentication and should not be advertised as a secure shared workspace. Browser profile access is the security boundary. Users should not store highly confidential HR data on shared or unmanaged devices without a future encryption layer.

Passkeys or fingerprint unlock are not implemented in this version. WebAuthn can provide device authentication, but a real multi-device sync system still needs a server-side account, credential registration, conflict policy and encrypted storage. Those features should be added only when synchronization becomes a committed product requirement.

## Future sync seam

The composable `useJdPersistence` owns the storage contract. A future sync adapter can implement the same `load`, `list`, `save`, `archive`, `restore` and `importDrafts` operations over an authenticated API. IndexedDB should remain the offline cache and local draft source while a sync adapter is introduced behind an explicit user opt-in.

## Local commands

```bash
bun install --frozen-lockfile
bun run --cwd apps/jd dev
bun run --cwd apps/jd typecheck
bun run --cwd apps/jd test:unit
bun run --cwd apps/jd test:e2e:server
bun run --cwd apps/jd build
```

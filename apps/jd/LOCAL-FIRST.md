# apps/jd local-first architecture

`apps/jd` is intentionally a local-first MVP. It does not require an account, a database, or a network request to create and edit a job description.

## Storage model

Draft documents are stored in the browser's IndexedDB database `hr-skills-jd`. The current draft ID is stored in localStorage only as a small pointer. Job description content is never placed in cookies because cookies are sent with requests and have a very small size limit.

Each saved draft contains the structured `hr-jd` document, status, version, created timestamp, updated timestamp and archive timestamp. Autosave is debounced in the editor. The `/drafts` page reads the same local store and supports title search, status filtering, archive, restore and resume.

## Backup and device changes

Use **Export backup** on `/drafts` before changing browsers or devices. The resulting JSON file can be imported with **Import backup**. JSON, Markdown and DOCX exports are also available from the editor.

A local browser store is not synchronization. If the browser profile is cleared, the drafts are lost unless a backup exists. The product should communicate this limitation clearly instead of pretending that a cookie is a multi-device backup.

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

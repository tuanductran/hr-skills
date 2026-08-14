import { ClientWidget } from './client-widget';

// Note: a Server Component calling a full fs-backed export like
// `buildRegistry()` from 'hr-skills-build' hits an unrelated, pre-existing
// issue: `skills-ref` computes `ROOT_DIR` via `import.meta.dirname` at
// module load time, which Next's webpack server bundling does not evaluate
// correctly for an externalized workspace package symlinked outside
// `next-app/`. Nothing here works around it — there is deliberately no
// `next.config.ts`, because the server path is out of scope for this
// playground. That's a Next.js/ESM interop wrinkle
// in `skills-ref`, not something the client/server split changed — the fs
// path is already covered by `bun test` / `bun run validate` in
// `packages/hr-skills-build`. What this playground exists to prove is the
// part that's actually new and risky: that `hr-skills-build/client` bundles
// cleanly for the browser. See `client-widget.tsx`.
export default function Page() {
	return (
		<main style={{ fontFamily: 'monospace', padding: 24 }}>
			<h1>hr-skills-build playground (Next.js)</h1>

			<section>
				<h2>Client: parseSkillFrontmatter() via hr-skills-build/client</h2>
				<ClientWidget />
			</section>
		</main>
	);
}

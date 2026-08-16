'use client';

// Smoke test: this is a Client Component, so anything imported here goes
// through the browser bundler. Import from 'hr-skills-build/server' (the
// server surface) here instead of '/client' and the Next build should fail with an
// unresolved node:fs/node:path error — that's the case this file guards
// against.
import { parseSkillFrontmatter } from 'hr-skills-build/client';

const SAMPLE = `---
name: hr-onboarding
description: Helps design onboarding programs. Use when planning new-hire ramp-up.
---
`;

export function ClientWidget() {
	const frontmatter = parseSkillFrontmatter(SAMPLE);
	return (
		<pre style={{ whiteSpace: 'pre-wrap', maxWidth: '100%', overflowX: 'auto' }}>
			{JSON.stringify(frontmatter, null, 2)}
		</pre>
	);
}

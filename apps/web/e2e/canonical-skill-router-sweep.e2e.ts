import { expect, test } from '@playwright/test';

interface SkillIndexEntry {
	id: string;
	domain: string;
}

interface SkillIndexResponse {
	skills: SkillIndexEntry[];
}

test.describe('canonical skill router sweep', () => {
	test('resolves a representative alias from every domain plus the longest canonical ID', async ({
		page,
	}, testInfo) => {
		test.skip(
			testInfo.project.name !== 'desktop-windows-chromium',
			'One Chromium sweep covers all canonical skills without multiplying 146 route visits per device.',
		);
		test.setTimeout(60_000);

		const response = await page.request.get('/data/hr-skills.json');
		expect(response.ok()).toBe(true);
		const snapshot = (await response.json()) as SkillIndexResponse;
		expect(snapshot.skills).toHaveLength(146);
		const byDomain = new Map<string, SkillIndexEntry>();
		for (const skill of snapshot.skills) {
			if (!byDomain.has(skill.domain)) byDomain.set(skill.domain, skill);
		}
		const longestIdSkill = snapshot.skills.reduce((longest, skill) =>
			skill.id.length > longest.id.length ? skill : longest,
		);
		const skillsToAudit = [...byDomain.values()];
		if (!skillsToAudit.some((skill) => skill.id === longestIdSkill.id)) {
			skillsToAudit.push(longestIdSkill);
		}
		expect(skillsToAudit.length).toBeGreaterThanOrEqual(12);

		const browserErrors: string[] = [];

		for (const { id } of skillsToAudit) {
			const legacyAlias = id.replace(/^hr-/, '');
			const skillPage = await page.context().newPage();
			skillPage.on('pageerror', (error) =>
				browserErrors.push(`${id}: ${error.message}`),
			);
			skillPage.on('console', (message) => {
				if (message.type() === 'error')
					browserErrors.push(`${id}: ${message.text()}`);
			});
			try {
				await skillPage.goto(`/skills/${legacyAlias}`, {
					waitUntil: 'domcontentloaded',
				});
				await expect(skillPage).toHaveURL(new RegExp(`/skills/${id}$`));
				await expect(
					skillPage.getByRole('heading', { name: id, exact: true }),
				).toBeVisible();
			} finally {
				await skillPage.close();
			}
		}

		expect(browserErrors, browserErrors.join('\n')).toEqual([]);
	});
});

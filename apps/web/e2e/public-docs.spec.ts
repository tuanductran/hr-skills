import { expect, test } from '@playwright/test';

test.describe('public documentation', () => {
	test('renders the homepage and primary navigation', async ({ page }, testInfo) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/HR Skills/);
		await expect(
			page.getByRole('heading', {
				name: 'Move from HR question to confident next step.',
			}),
		).toBeVisible();
		await expect(
			page.getByText('Use a canonical library of 146 HR Skills'),
		).toBeVisible();
		await expect(page.getByRole('link', { name: 'Catalog' }).first()).toBeVisible();
		if (testInfo.project.name === 'mobile-chromium') {
			await page.getByRole('button', { name: 'Open navigation menu' }).click();
		}
		await expect(page.getByRole('link', { name: /GitHub/ }).first()).toHaveAttribute(
			'href',
			'https://github.com/tuanductran/hr-skills',
		);
	});

	test('filters the catalog and persists URL state', async ({ page }) => {
		await page.goto('/skills?q=hris&domain=hr-technology-ai&tier=full');

		await expect(page).toHaveURL(
			/\/skills\?q=hris&domain=hr-technology-ai&tier=full/,
		);
		await expect(page.getByRole('searchbox', { name: 'Search skills' })).toHaveValue(
			'hris',
		);
		await expect(page.locator('#domain-filter')).toHaveValue('hr-technology-ai');
		await expect(page.locator('#tier-filter')).toHaveValue('full');
		await expect(page.getByText(/\d+ of 146 skills/)).toBeVisible();
		await expect(
			page.getByRole('link').filter({
				has: page.getByRole('heading', { name: 'HRIS', exact: true }),
			}),
		).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear all' })).toBeVisible();
	});

	test('renders a static skill detail page', async ({ page }) => {
		await page.goto('/skills/hr-hris');

		await expect(page).toHaveTitle('HRIS | HR Skills | HR Skills');
		await expect(
			page.getByRole('heading', { name: 'HRIS', exact: true, level: 1 }),
		).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Skill guide' })).toBeVisible();
		await expect(page.getByText('HR information systems')).toBeVisible();
		await expect(page.getByText('Supported tasks')).toBeVisible();
		await expect(page.getByText('Full skill')).toBeVisible();
	});

	test('returns a navigable not-found page for an unknown skill', async ({ page }) => {
		await page.goto('/skills/hr-does-not-exist');

		await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
		await expect(page.getByText('This page could not be found.')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Browse skills' })).toBeVisible();
	});
});

test.describe('public documentation interactions', () => {
	test('updates URL state through user input and clears all filters', async ({
		page,
	}) => {
		await page.goto('/skills');

		const search = page.getByRole('searchbox', { name: 'Search skills' });
		await search.fill('HRIS');
		await expect(page).toHaveURL(/\/skills\?q=HRIS/);

		await page.locator('#domain-filter').selectOption('hr-technology-ai');
		await expect(page).toHaveURL(/q=HRIS&domain=hr-technology-ai/);
		await page.locator('#tier-filter').selectOption('full');
		await expect(page).toHaveURL(/q=HRIS&domain=hr-technology-ai&tier=full/);
		await expect(page.getByText(/\d+ of 146 skills/)).toBeVisible();

		await page.getByRole('button', { name: 'Clear all' }).click();
		await expect(page).toHaveURL(/\/skills$/);
		await expect(search).toHaveValue('');
		await expect(page.locator('#domain-filter')).toHaveValue('');
		await expect(page.locator('#tier-filter')).toHaveValue('');
		await expect(page.getByText('146 of 146 skills')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear all' })).toHaveCount(0);
	});

	test('shows an empty state and recovers through reset catalog', async ({ page }) => {
		await page.goto('/skills?q=term-that-does-not-exist');

		await expect(
			page.getByRole('heading', { name: 'No matching skills' }),
		).toBeVisible();
		await expect(
			page.getByText('Try a broader task or remove one of the active filters.'),
		).toBeVisible();
		await page.getByRole('button', { name: 'Reset catalog' }).click();
		await expect(page).toHaveURL(/\/skills$/);
		await expect(page.getByText('146 of 146 skills')).toBeVisible();
	});

	test('navigates from a homepage domain card to a filtered catalog', async ({
		page,
	}) => {
		await page.goto('/');

		await page.getByRole('link', { name: /HR technology & AI 16 skills/ }).click();
		await expect(page).toHaveURL(/\/skills\?domain=hr-technology-ai/);
		await expect(page.locator('#domain-filter')).toHaveValue('hr-technology-ai');
		await expect(page.getByText('16 of 146 skills')).toBeVisible();
	});

	test('toggles prompt details and follows a related skill', async ({ page }) => {
		await page.goto('/skills/hr-ai');

		const prompts = page.locator('section[aria-labelledby="skill-prompts-heading"]');
		const firstPrompt = prompts.locator('details').first();
		const summary = firstPrompt.locator('summary');
		await expect(summary).toBeVisible();
		await expect(firstPrompt).toHaveAttribute('open', '');
		await summary.click();
		await expect(firstPrompt).not.toHaveAttribute('open', '');
		await summary.click();
		await expect(firstPrompt).toHaveAttribute('open', '');

		const relatedLink = page
			.locator('aside[aria-label="Skill metadata"]')
			.getByRole('link')
			.first();
		await expect(relatedLink).toBeVisible();
		const relatedHref = await relatedLink.getAttribute('href');
		if (!relatedHref) throw new Error('Expected a related skill href');
		await relatedLink.click();
		await expect(page).toHaveURL(
			new RegExp(`${relatedHref.replaceAll('/', '\\/')}$`),
		);
	});

	test('supports keyboard navigation through the primary links', async ({
		page,
	}, testInfo) => {
		if (testInfo.project.name === 'mobile-chromium') {
			test.skip(
				true,
				'Mobile navigation is covered by the Headless UI Dialog interaction test.',
			);
		}
		await page.goto('/');

		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'HR Skills' })).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Catalog' }).first()).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page).toHaveURL(/\/skills$/);
	});

	test('does not create horizontal overflow at the active viewport', async ({
		page,
	}) => {
		await page.goto('/skills');

		const hasHorizontalOverflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		);
		await expect(hasHorizontalOverflow).toBe(false);
	});
});

test.describe('planner API surface', () => {
	test('generates an explainable plan and expands step details', async ({ page }) => {
		await page.goto('/planner');

		await expect(
			page.getByRole('heading', {
				name: 'Turn an HR question into an explainable plan.',
			}),
		).toBeVisible();
		await page
			.getByLabel('Describe your HR task')
			.fill('Design employee onboarding programs');
		await page.getByRole('button', { name: 'Generate plan' }).click();
		await expect(page.getByText('Explainable result', { exact: true })).toBeVisible();
		await expect(
			page.getByText('Detected capabilities', { exact: true }),
		).toBeVisible();
		const firstStep = page.locator('.planner-step__button').first();
		await expect(firstStep).toBeVisible();
		await firstStep.click();
		await expect(page.locator('.planner-step__panel').first()).toBeVisible();
	});

	test('keeps built-in planner examples backed by canonical skills', async ({
		page,
	}) => {
		await page.goto('/planner');
		const examples = [
			'Write a job description for a Senior Product Manager',
			'Design a structured interview process for technical hiring',
			'AI governance',
		];
		for (const example of examples) {
			await page.getByRole('button', { name: example, exact: true }).click();
			await page.getByRole('button', { name: 'Generate plan' }).click();
			await expect(
				page.getByText('Explainable result', { exact: true }),
			).toBeVisible();
			await expect(page.locator('.planner-step__button').first()).toBeVisible();
			await page.getByRole('button', { name: 'Clear result' }).click();
		}
	});
});

test.describe('Phase 7 product surfaces', () => {
	test('explores the registry graph and follows a skill edge', async ({ page }) => {
		await page.goto('/graph');
		await expect(
			page.getByRole('heading', { name: 'See how HR skills connect.' }),
		).toBeVisible();
		await expect(page.getByText('skills', { exact: true }).first()).toBeVisible();
		await expect(page.locator('.graph-card').first()).toBeVisible();
		await expect(page.locator('.graph-card__links a').first()).toHaveAttribute(
			'href',
			/\/skills\//,
		);
	});

	test('replays and expands runtime trace entries', async ({ page }) => {
		await page.goto('/runtime');
		await expect(
			page.getByRole('heading', { name: 'Replay a deterministic workflow trace.' }),
		).toBeVisible();
		await expect(page.getByText('simulated')).toBeVisible();
		const entry = page.locator('.trace-entry').first();
		await expect(entry).toBeVisible();
		await entry.getByRole('button').click();
		await expect(entry.locator('pre')).toBeVisible();
	});

	test('renders evaluation metrics and expandable cases', async ({ page }) => {
		await page.goto('/evaluation');
		await expect(
			page.getByRole('heading', {
				name: 'Evaluate planner behavior against golden cases.',
			}),
		).toBeVisible();
		await expect(page.getByText('cases passing')).toBeVisible();
		const caseCard = page.locator('.evaluation-card').first();
		await expect(caseCard).toBeVisible();
		await caseCard.getByRole('button').click();
		await expect(caseCard.locator('.evaluation-card__panel')).toBeVisible();
	});

	test('renders release metadata from pending changesets', async ({ page }) => {
		await page.goto('/changelog');
		await expect(
			page.getByRole('heading', { name: 'Follow what changed in the platform.' }),
		).toBeVisible();
		const releaseCards = page.locator('.release-card');
		if ((await releaseCards.count()) > 0) {
			await expect(releaseCards.first()).toBeVisible();
			await expect(page.locator('.badge').first()).toBeVisible();
		} else {
			await expect(
				page.getByRole('heading', { name: 'No pending changesets' }),
			).toBeVisible();
		}
	});
});

test.describe('UX redesign flows', () => {
	test('offers two clear homepage starting paths', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByRole('link', { name: /Find a skill/ })).toHaveAttribute(
			'href',
			'/skills',
		);
		await expect(
			page.getByRole('main').getByRole('link', { name: /Build a plan/ }),
		).toHaveAttribute('href', '/planner');
		await expect(
			page.getByRole('link', { name: /I need a practical guide/ }),
		).toBeVisible();
	});

	test('opens the compact explore navigation', async ({ page }, testInfo) => {
		await page.goto('/');
		if (testInfo.project.name === 'mobile-chromium') {
			await page.getByRole('button', { name: 'Open navigation menu' }).click();
		} else {
			await page.locator('summary').filter({ hasText: 'Explore' }).click();
		}
		await expect(page.getByRole('link', { name: 'Skill graph' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Evaluation' })).toBeVisible();
	});

	test('removes one active filter without losing the others', async ({ page }) => {
		await page.goto('/skills?q=onboarding&domain=onboarding-offboarding&tier=full');
		await page
			.getByRole('button', { name: /Area: Onboarding & offboarding/ })
			.click();
		await expect(page).toHaveURL(/q=onboarding&tier=full/);
		await expect(page.getByRole('button', { name: /Maturity: full/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /Area: Onboarding/ })).toHaveCount(
			0,
		);
	});

	test('persists catalog sorting in URL state', async ({ page }) => {
		await page.goto('/skills');
		await page.getByLabel('Sort by').selectOption('tier');
		await expect(page).toHaveURL(/\/skills\?sort=tier/);
		await expect(page.getByLabel('Sort by')).toHaveValue('tier');
	});
});

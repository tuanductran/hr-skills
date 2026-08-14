import { expect, test } from '@playwright/test';

test.describe('public documentation', () => {
	test('renders the homepage and primary navigation', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/HR Skills/);
		await expect(
			page.getByRole('heading', {
				name: 'Skills for thoughtful, operationally excellent people work.',
			}),
		).toBeVisible();
		await expect(page.getByText('Browse 146 content-driven HR Skills')).toBeVisible();
		await expect(
			page.getByRole('link', { name: 'Skill catalog' }).first(),
		).toBeVisible();
		await expect(
			page.getByRole('link', { name: 'Repository' }).first(),
		).toHaveAttribute('href', 'https://github.com/tuanductran/hr-skills');
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
		await expect(page.getByRole('button', { name: 'Clear filters' })).toBeVisible();
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

		await page.getByLabel('Domain').selectOption('hr-technology-ai');
		await expect(page).toHaveURL(/q=HRIS&domain=hr-technology-ai/);
		await page.getByLabel('Tier').selectOption('full');
		await expect(page).toHaveURL(/q=HRIS&domain=hr-technology-ai&tier=full/);
		await expect(page.getByText(/\d+ of 146 skills/)).toBeVisible();

		await page.getByRole('button', { name: 'Clear filters' }).click();
		await expect(page).toHaveURL(/\/skills$/);
		await expect(search).toHaveValue('');
		await expect(page.getByLabel('Domain')).toHaveValue('');
		await expect(page.getByLabel('Tier')).toHaveValue('');
		await expect(page.getByText('146 of 146 skills')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Clear filters' })).toHaveCount(0);
	});

	test('shows an empty state and recovers through reset catalog', async ({ page }) => {
		await page.goto('/skills?q=term-that-does-not-exist');

		await expect(
			page.getByRole('heading', { name: 'No matching skills' }),
		).toBeVisible();
		await expect(
			page.getByText(
				'Try a broader search term or remove one of the active filters.',
			),
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
		await expect(page.getByLabel('Domain')).toHaveValue('hr-technology-ai');
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

	test('supports keyboard navigation through the primary links', async ({ page }) => {
		await page.goto('/');

		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'HR Skills' })).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Home' })).toBeFocused();
		await page.keyboard.press('Tab');
		await expect(
			page.getByRole('link', { name: 'Skill catalog' }).first(),
		).toBeFocused();
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
				name: 'Turn HR intent into an explainable skill plan.',
			}),
		).toBeVisible();
		await page
			.getByLabel('Describe your HR task')
			.fill('Design employee onboarding programs');
		await page.getByRole('button', { name: 'Generate plan' }).click();
		await expect(page.getByText('Result', { exact: true })).toBeVisible();
		await expect(page.getByText('Detected capabilities:')).toBeVisible();
		const firstStep = page.locator('.planner-step__button').first();
		await expect(firstStep).toBeVisible();
		await firstStep.click();
		await expect(page.locator('.planner-step__panel').first()).toBeVisible();
	});
});

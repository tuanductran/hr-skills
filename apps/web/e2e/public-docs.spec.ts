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
		await expect(page.getByText('6 of 146 skills')).toBeVisible();
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

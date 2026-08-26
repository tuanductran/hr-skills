import { expect, test } from '@playwright/test';

test.describe('shell footer and canonical skill routing', () => {
	test('keeps the footer at or below the short 404 viewport and exposes its landmark', async ({
		page,
	}) => {
		await page.goto('/skills/not-a-real-skill', { waitUntil: 'networkidle' });
		await expect(
			page.getByRole('heading', {
				name: 'That skill is not in the current registry.',
			}),
		).toBeVisible();
		const footer = page.getByRole('contentinfo');
		await expect(footer).toBeVisible();
		const layout = await footer.evaluate((element) => {
			const rect = element.getBoundingClientRect();
			return { top: rect.top, bottom: rect.bottom, viewport: window.innerHeight };
		});
		expect(layout.top).toBeGreaterThanOrEqual(layout.viewport - 1);
		expect(layout.bottom).toBeGreaterThanOrEqual(layout.viewport);
	});

	test('redirects legacy and case-variant skill slugs to the canonical hr-prefixed route', async ({
		page,
	}) => {
		await page.goto('/skills/onboarding', { waitUntil: 'networkidle' });
		await expect(page).toHaveURL(/\/skills\/hr-onboarding$/);
		await expect(
			page.getByRole('heading', { name: 'hr-onboarding', exact: true }),
		).toBeVisible();

		await page.goto('/skills/HR-Onboarding', { waitUntil: 'networkidle' });
		await expect(page).toHaveURL(/\/skills\/hr-onboarding$/);
		await expect(
			page.getByRole('heading', { name: 'hr-onboarding', exact: true }),
		).toBeVisible();
	});
});

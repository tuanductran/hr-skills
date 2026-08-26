import { expect, test } from '@playwright/test';

test.describe('Workspace accessible control states', () => {
	test('exposes current navigation, toggle state, labelled clear actions, and Canvas search feedback', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(
			page.locator('a[href="/"][aria-current="page"]').first(),
		).toHaveAttribute('aria-current', 'page');
		await expect(page.locator('button[aria-pressed="true"]').first()).toHaveAttribute(
			'aria-pressed',
			'true',
		);

		const pin = page.getByRole('button', {
			name: 'Pin hr-accessibility-accommodation',
		});
		await expect(pin).toHaveAttribute('aria-pressed', 'false');
		await pin.click();
		await expect(pin).toHaveAttribute('aria-pressed', 'true');

		await page.getByRole('searchbox', { name: 'Search skills' }).fill('onboarding');
		await expect(
			page.getByRole('button', { name: 'Clear skill search' }),
		).toBeVisible();

		await page.goto('/map', { waitUntil: 'networkidle' });
		await expect(
			page.locator('a[href="/map"][aria-current="page"]').first(),
		).toHaveAttribute('aria-current', 'page');
		await expect(page.locator('button[aria-pressed="true"]').first()).toHaveAttribute(
			'aria-pressed',
			'true',
		);
		await page
			.getByRole('searchbox', { name: 'Search supporting skills' })
			.fill('onboarding');
		await expect(
			page.getByRole('button', { name: 'Clear supporting skill search' }),
		).toBeVisible();
	});
});

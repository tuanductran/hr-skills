import { expect, type Page, test } from '@playwright/test';

const touchProject = /android|iphone|ipad/i;

async function expectNoHorizontalScroll(page: Page) {
	const scrollX = await page.evaluate(() => {
		const initial = window.scrollX;
		window.scrollTo({ left: 99999, top: window.scrollY });
		const maximum = window.scrollX;
		window.scrollTo({ left: initial, top: window.scrollY });
		return maximum;
	});
	expect(scrollX).toBeLessThanOrEqual(1);
}

test.describe('touch and orientation behavior', () => {
	test.beforeEach(async ({ page: _page }, testInfo) => {
		test.skip(
			!touchProject.test(testInfo.project.name),
			'Touch checks run only on device-emulation projects.',
		);
	});

	test('touch navigation and disclosures retain an operable route state', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });

		const openNavigation = page.getByRole('button', {
			name: 'Open workspace navigation',
		});
		await expect(openNavigation).toBeVisible();
		await openNavigation.tap();
		await expect(
			page.getByRole('dialog', { name: 'Workspace navigation' }),
		).toBeVisible();
		await expect(
			page.getByRole('button', { name: 'Close workspace navigation' }),
		).toBeVisible();

		await page.getByRole('link', { name: 'People system canvas' }).tap();
		await expect(page).toHaveURL(/\/map/);
		const decisionStage = page.getByRole('button', { name: /Decision stage:/ });
		await expect(decisionStage).toHaveAttribute('aria-expanded', 'false');
		await decisionStage.tap();
		await expect(decisionStage).toHaveAttribute('aria-expanded', 'true');
		await decisionStage.tap();
		await expect(decisionStage).toHaveAttribute('aria-expanded', 'false');
		await expectNoHorizontalScroll(page);
	});

	test('touch composer controls open and close without trapping the user', async ({
		page,
	}) => {
		await page.goto('/skills/hr-onboarding', { waitUntil: 'networkidle' });
		const prepare = page.getByRole('button', { name: 'Prepare for Claude' });
		await prepare.tap();
		await expect(
			page.getByRole('dialog', { name: 'Prepare a Claude prompt' }),
		).toBeVisible();
		await page.getByRole('button', { name: 'Close Claude composer' }).tap();
		await expect(
			page.getByRole('dialog', { name: 'Prepare a Claude prompt' }),
		).toBeHidden();
		await expectNoHorizontalScroll(page);
	});

	test('portrait-to-landscape resize preserves the route and prevents horizontal scroll', async ({
		page,
	}) => {
		await page.goto('/skills/hr-onboarding', { waitUntil: 'networkidle' });
		const portrait = page.viewportSize();
		expect(portrait).not.toBeNull();
		if (!portrait) return;

		await page.setViewportSize({ width: portrait.height, height: portrait.width });
		await expect
			.poll(() => page.evaluate(() => window.innerWidth > window.innerHeight))
			.toBe(true);
		await expect(
			page.getByRole('heading', { name: 'hr-onboarding', exact: true }),
		).toBeVisible();
		await expectNoHorizontalScroll(page);

		await page.setViewportSize(portrait);
		await expect
			.poll(() => page.evaluate(() => window.innerHeight > window.innerWidth))
			.toBe(true);
		await expect(
			page.getByRole('button', { name: 'Prepare for Claude' }),
		).toBeVisible();
		await expectNoHorizontalScroll(page);
	});
});

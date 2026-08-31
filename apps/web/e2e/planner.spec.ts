import { expect, test } from '@playwright/test';

test.describe('planner', () => {
	test('an example intent produces a plan with detected capabilities', async ({
		page,
	}) => {
		await page.goto('/planner');
		await expect(
			page.getByRole('heading', {
				name: 'Turn an HR question into an explainable plan.',
			}),
		).toBeVisible();

		await page
			.getByLabel('Describe your HR task')
			.fill('onboarding, interviewing, recruiting');
		await page.getByRole('button', { name: 'Generate plan' }).click();

		await expect(page.getByText('Explainable result')).toBeVisible();
		await expect(page.getByText('Detected capabilities')).toBeVisible();
	});

	test('an example chip fills the intent field', async ({ page }) => {
		await page.goto('/planner');
		const example = page.getByRole('button', {
			name: /onboarding plan for a growing team/i,
		});
		await example.click();
		await expect(page.getByLabel('Describe your HR task')).toHaveValue(
			'Create an onboarding plan for a growing team',
		);
	});

	test('a plan step expands to show its rationale', async ({ page }) => {
		await page.goto('/planner');
		await page
			.getByLabel('Describe your HR task')
			.fill('onboarding, interviewing, recruiting');
		await page.getByRole('button', { name: 'Generate plan' }).click();
		await expect(page.getByText('Explainable result')).toBeVisible();

		const step = page.locator('.planner-step__button').first();
		await expect(step).toBeVisible();
		await step.click();
		await expect(step).toHaveAttribute('data-state', 'open');
		await expect(page.locator('.planner-step__panel-inner').first()).toBeVisible();
	});

	test('the submit button stays disabled until intent text is entered', async ({
		page,
	}) => {
		await page.goto('/planner');
		await expect(page.getByRole('button', { name: 'Generate plan' })).toBeDisabled();
		await page.getByLabel('Describe your HR task').fill('onboarding');
		await expect(page.getByRole('button', { name: 'Generate plan' })).toBeEnabled();
	});
});

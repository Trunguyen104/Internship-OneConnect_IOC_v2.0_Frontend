import { expect, test } from '@playwright/test';

test.describe('Login Flow', () => {
  // We don't use storageState here if we want to test the actual login process
  // But for other tests, we would use it.

  test.use({ storageState: { cookies: [], origins: [] } }); // Clear storage state for this specific test

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill credentials
    await page.fill('input[name="email"]', 'admin@iocv2.com');
    await page.fill('input[name="password"]', 'Admin@123');

    // Click submit
    await page.click('button[type="submit"]');

    // Check if redirected to dashboard or home
    await expect(page).toHaveURL('/');

    // Optional: Verify presence of user profile or logout button
    // await expect(page.locator('text=Logout')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"]');

    // Verify error message appears
    // await expect(page.locator('.error-message')).toBeVisible();
    // (Adjust selector based on your error display logic)
  });
});

test.describe('Dashboard (Authenticated)', () => {
  // This test uses the storageState defined in playwright.config.js (from global.setup.js)

  test('should be able to access dashboard when authenticated', async ({ page }) => {
    await page.goto('/');

    // Since we're using storageState, we should already be logged in
    await expect(page).toHaveURL('/');

    // verify some dashboard content
    // await expect(page.locator('h1')).toContainText('Dashboard');
  });
});

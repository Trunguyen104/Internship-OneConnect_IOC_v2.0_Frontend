import { test as setup } from '@playwright/test';
import path from 'path';

const storagePath = path.resolve(__dirname, 'storage/storageState.json');

// ... existing imports ...

setup('authenticate', async ({ page }) => {
  // Trace console logs from the browser for debugging
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.text().includes('LOGIN')) {
      console.log(`[BROWSER ${msg.type().toUpperCase()}] ${msg.text()}`);
    }
  });

  console.log('Navigating to /login...');
  await page.goto('/login', { waitUntil: 'load' });

  // 1. Wait for hydration marker - Critical for Next.js dev mode
  console.log('Waiting for hydration...');
  try {
    await page.waitForSelector('#login-page-root[data-hydrated="true"]', { timeout: 30000 });
    console.log('Hydration complete.');
  } catch {
    console.warn('Hydration marker not found within 30s, continuing anyway...');
  }

  // 2. Extra wait to ensure all JS is fully executed (Next.js compilation buffer)
  await page.waitForLoadState('networkidle');

  const emailInput = page.locator('input[name="email"]');
  const passwordInput = page.locator('input[name="password"]');
  const submitButton = page.locator('button[type="submit"]');

  await emailInput.fill('admin@iocv2.com');
  await passwordInput.fill('Admin@123');

  console.log('Submitting login form...');

  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('/api/auth'),
      { timeout: 30000 }
    ),
    submitButton.click(),
  ]);

  if (!response.ok()) {
    const errorBody = await response.text();
    throw new Error(`Login API failed with ${response.status()}: ${errorBody}`);
  }

  console.log('Login successful, waiting for redirect to /user-management...');

  // Use a longer timeout for the first redirect after compilation
  try {
    await page.waitForURL('**/user-management', { timeout: 20000 });
    console.log('Redirect successful!');
  } catch (e) {
    console.error('Timed out waiting for redirect.');
    console.log('Final URL reached:', page.url());

    // Check for error messages on the page if we failed to redirect
    const errorMsg = page.locator('.text-red-500, [role="alert"]');
    if ((await errorMsg.count()) > 0) {
      console.log('Found error on page:', await errorMsg.first().textContent());
    }

    throw e;
  }

  await page.context().storageState({ path: storagePath });
  console.log('Authentication state saved.');
});

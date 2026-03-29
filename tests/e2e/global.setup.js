import { test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const storagePath = path.resolve(__dirname, 'storage/storageState.json');

setup('authenticate', async ({ page, baseURL }) => {
  // 1. Ensure storage directory exists
  const storageDir = path.dirname(storagePath);
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  // 2. Clear previous session if needed
  if (fs.existsSync(storagePath)) {
    // fs.unlinkSync(storagePath);
  }

  // 3. Go to login page
  await page.goto('/login');

  // 4. Fill login credentials
  // Replace with actual selectors for your login form
  await page.fill('input[name="email"]', 'admin@iocv2.com');
  await page.fill('input[name="password"]', 'Admin@123');

  // 5. Submit login
  await page.click('button[type="submit"]');

  // 6. Wait for redirect or home page state
  await page.waitForURL('/');

  // 7. Save storage state to be reused by tests
  await page.context().storageState({ path: storagePath });

  console.log('--- Global Setup: Authentication completed & session saved ---');
});

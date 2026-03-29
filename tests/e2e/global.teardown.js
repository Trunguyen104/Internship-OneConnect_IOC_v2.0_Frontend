import { test as teardown } from '@playwright/test';
import fs from 'fs';
import path from 'path';

teardown('cleanup', async () => {
  const storagePath = path.resolve(__dirname, 'storage/storageState.json');

  if (fs.existsSync(storagePath)) {
    // Optionally remove storage state after all tests are done
    // fs.unlinkSync(storagePath);
  }

  // 3. Clear Test Database or cleanup session data if needed
  // You can call your backend API endpoint to clear the test database
  console.log('--- Global Teardown: Completed ---');
});

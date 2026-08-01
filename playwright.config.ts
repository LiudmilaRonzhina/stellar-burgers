import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: /.*\.pl\.tsx?/,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'],
    channel: 'chrome'
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4000',
    reuseExistingServer: true,
    timeout: 120 * 1000
  }
});

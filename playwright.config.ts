import { defineConfig, devices } from '@playwright/test';

const port = 4321;

// Set when a machine already has a Chromium that does not match this
// Playwright version. Otherwise run `npx playwright install chromium`.
const chromium = {
  ...devices['Desktop Chrome'],
  launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
    : {},
};

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? 'github' : 'list',
  projects: [
    {
      name: 'chromium',
      use: { ...chromium, baseURL: `http://localhost:${port}` },
    },
  ],
  // `npm run check` builds first: the tests read the page list from dist/,
  // which must exist before Playwright collects the tests.
  // --ignore-lock keeps the preview server in the foreground, so Playwright
  // can stop it. It also lets a second server run beside it.
  webServer: [
    {
      command: `npm run preview -- --port ${port} --ignore-lock`,
      url: `http://localhost:${port}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});

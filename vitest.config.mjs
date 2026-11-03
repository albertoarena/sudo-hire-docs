// @ts-check
import { defineConfig } from 'vitest/config';

// Tests of the placeholder and of the built site in dist/. The Playwright tests are in e2e/.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.{js,ts}'],
    environment: 'node',
  },
});

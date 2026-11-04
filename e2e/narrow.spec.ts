import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

test.use({ viewport: { width: 320, height: 640 } });

for (const colorScheme of ['light', 'dark'] as const) {
  for (const path of builtPages()) {
    test(`${path} has no sideways scroll at 320px, ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBe(0);
    });
  }
}

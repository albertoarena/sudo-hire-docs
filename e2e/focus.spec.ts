import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

// Every focus stop shows a solid outline of at least 2px, in light and dark.
for (const colorScheme of ['light', 'dark'] as const) {
  for (const path of builtPages()) {
    test(`${path} shows the focus ring on every stop, ${colorScheme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path);
      const stops = await page.locator('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])').count();

      for (let i = 0; i < stops; i++) {
        await page.keyboard.press('Tab');
        const ring = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement;
          const style = getComputedStyle(el);
          return { tag: el.outerHTML.slice(0, 80), style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
        });
        expect(ring.style, ring.tag).toBe('solid');
        expect(ring.width, ring.tag).toBeGreaterThanOrEqual(2);
      }
    });
  }
}

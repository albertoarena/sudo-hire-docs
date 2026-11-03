import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

test('the home page has its heading', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1, name: 'Sudo Hire' })).toBeVisible();
});

test('the site has a home page', () => {
  expect(builtPages()).toContain('/');
});

// No request to another site before an explicit accept (docs/SCOPE.md,
// "The analytics rule"). This test guards that rule on every page.
for (const path of builtPages()) {
  test(`${path} makes no request to another site before consent`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const otherSites: string[] = [];

    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.protocol === 'data:' || url.protocol === 'blob:') return;
      if (url.origin !== origin) otherSites.push(request.url());
    });

    await page.goto(path, { waitUntil: 'networkidle' });

    expect(otherSites).toEqual([]);
  });
}

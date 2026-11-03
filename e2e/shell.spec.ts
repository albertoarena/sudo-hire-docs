import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

// The seven pages of docs/SCOPE.md. The navigation must reach each of them.
const sitePages = ['/', '/how-it-works/', '/install/', '/settings/', '/sources/', '/privacy/', '/help/'];

test('the site builds every page of the scope', () => {
  expect(builtPages()).toEqual(expect.arrayContaining(sitePages));
});

for (const path of builtPages()) {
  test(`${path} has the shell`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole('banner')).toHaveCount(1);
    await expect(page.getByRole('navigation', { name: 'Questions' })).toHaveCount(1);
    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('contentinfo')).toHaveCount(1);
  });
}

for (const path of sitePages) {
  test(`${path} marks itself as the current page, once`, async ({ page }) => {
    await page.goto(path);

    const current = page.locator('[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveAttribute('href', path);
  });

  test(`${path} marks its question group`, async ({ page }) => {
    await page.goto(path);

    await expect(page.getByRole('navigation', { name: 'Questions' }).locator('[aria-current="true"]')).toHaveCount(1);
  });
}

test('every navigation link reaches a page', async ({ page, request }) => {
  const hrefs = new Set<string>();
  for (const path of sitePages) {
    await page.goto(path);
    for (const href of await page.locator('nav[aria-label="Questions"] a, nav[aria-label="Pages"] a').evaluateAll((links) => links.map((a) => a.getAttribute('href') ?? ''))) {
      hrefs.add(href);
    }
  }

  expect([...hrefs].sort()).toEqual([...sitePages].sort());
  for (const href of hrefs) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
});

test('the skip link moves the focus to the main content', async ({ page }) => {
  await page.goto('/settings/');
  await page.keyboard.press('Tab');

  const skip = page.getByRole('link', { name: 'Skip to the content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
});

test('the contents of a page link to its sections', async ({ page }) => {
  await page.goto('/settings/');

  const links = page.getByRole('navigation', { name: 'On this page' }).getByRole('link');
  await expect(links).toHaveCount(8);
  for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''))) {
    await expect(page.locator(href)).toHaveCount(1);
  }
});

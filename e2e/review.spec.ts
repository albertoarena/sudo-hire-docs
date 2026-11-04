import { expect, test } from '@playwright/test';

// The header, the theme toggle and the contents, after the owner's review of phase 4.

test('the header stays at the top while the page scrolls', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/how-it-works/');
  await page.mouse.wheel(0, 2500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);

  const box = await page.getByRole('banner').boundingBox();
  expect(box?.y).toBe(0);
});

test('the header shows the mark of the app', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('banner').locator('.name svg.mark')).toHaveCount(1);
});

test('the theme follows the system until the reader chooses one', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/install/');
  const toggle = page.getByRole('button', { name: 'Dark theme' });
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect(await background()).toBe('rgb(247, 245, 242)');

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(await background()).toBe('rgb(29, 27, 31)');

  await page.goto('/help/');
  await expect(page.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'true');
  expect(await background()).toBe('rgb(29, 27, 31)');
});

test('a light choice wins over a dark system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark theme' });

  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await page.reload();

  await expect(page.getByRole('button', { name: 'Dark theme' })).toHaveAttribute('aria-pressed', 'false');
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(247, 245, 242)');
});

test('the contents mark the section in view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/how-it-works/');
  const contents = page.getByRole('navigation', { name: 'On this page' });
  const current = contents.locator('[aria-current="location"]');

  await expect(current).toHaveCount(1);
  await expect(current).toHaveText('When does Sudo Hire look for new jobs?');

  await page.locator('#stamp').evaluate((heading) => window.scrollTo(0, heading.getBoundingClientRect().top + window.scrollY - 140));
  await page.mouse.wheel(0, 1);
  await expect(current).toHaveText('What does the stamp on a job mean?');

  await contents.getByRole('link', { name: 'How does Sudo Hire update?' }).click();
  await expect(current).toHaveText('How does Sudo Hire update?');
});

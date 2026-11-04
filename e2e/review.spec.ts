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

test('the theme toggle cycles light, dark and system', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/install/');
  const toggle = page.locator('header button.theme');
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await expect(toggle).toHaveAccessibleName('Theme: system');
  expect(await background()).toBe('rgb(247, 245, 242)');

  await toggle.click();
  await expect(toggle).toHaveAccessibleName('Theme: light');
  expect(await background()).toBe('rgb(247, 245, 242)');

  await toggle.click();
  await expect(toggle).toHaveAccessibleName('Theme: dark');
  expect(await background()).toBe('rgb(29, 27, 31)');

  await page.goto('/help/');
  await expect(toggle).toHaveAccessibleName('Theme: dark');
  expect(await background()).toBe('rgb(29, 27, 31)');

  await toggle.click();
  await expect(toggle).toHaveAccessibleName('Theme: system');
  expect(await background()).toBe('rgb(247, 245, 242)');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBeNull();
});

test('a light choice wins over a dark system, and system follows it', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const toggle = page.locator('header button.theme');
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);

  await expect(toggle).toHaveAccessibleName('Theme: system');
  expect(await background()).toBe('rgb(29, 27, 31)');

  await toggle.click();
  await page.reload();
  await expect(toggle).toHaveAccessibleName('Theme: light');
  expect(await background()).toBe('rgb(247, 245, 242)');
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

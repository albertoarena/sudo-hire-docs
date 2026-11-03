import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// These tests read the built site. `npm run check` builds it first. On its
// own, `npm test` needs `npm run build` before it.
const dist = 'dist';

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

it('builds the home page', () => {
  expect(existsSync(join(dist, 'index.html'))).toBe(true);
});

describe.each(existsSync(dist) ? htmlFiles(dist) : [])('%s', (file) => {
  const html = readFileSync(file, 'utf8');

  it('is in English', () => {
    expect(html).toMatch(/<html\b[^>]*\blang="en"/i);
  });

  it('has a title', () => {
    const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? '';

    expect(title.trim()).not.toBe('');
  });
});

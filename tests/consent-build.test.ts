import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The measurement ID turns the whole feature on. These tests read the two
// builds: `npm run check` makes dist/ with no ID and dist-consent/ with a test ID.
function files(dir: string, extension: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path, extension);
    return entry.name.endsWith(extension) ? [path] : [];
  });
}

describe('the build without a measurement ID', () => {
  const pages = files('dist', '.html');

  it('has pages', () => {
    expect(pages).not.toHaveLength(0);
  });

  // A banner with no tag behind it would ask the reader to agree to nothing.
  // The only scripts are the two inline scripts of the theme toggle and the contents.
  it.each(pages)('%s has no banner, no consent script and no Google', (file) => {
    const html = readFileSync(file, 'utf8');
    const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(([, body]) => body);

    expect(html).not.toContain('id="consent"');
    expect(scripts).toHaveLength(2);
    for (const script of scripts) expect(script).toContain('theme');
    expect(html).not.toMatch(/<script\b[^>]*\bsrc=/i);
    expect(html).not.toMatch(/googletagmanager|google-analytics/i);
  });
});

describe('the build with a measurement ID', () => {
  const pages = files('dist-consent', '.html');

  it('has pages', () => {
    expect(pages).not.toHaveLength(0);
  });

  // The ID reaches the page as data, never as a request.
  it.each(pages)('%s carries the banner, with the ID', (file) => {
    const html = readFileSync(file, 'utf8');

    expect(html).toContain('id="consent"');
    expect(html).toContain('data-measurement-id="G-TESTING000"');
    expect(html).not.toMatch(/<script[^>]*\bsrc="https?:/i);
  });

  // The banner script is inline, so it costs the page no request (DESIGN.md, Scripts).
  it.each(pages)('%s has the banner script inline, with no script file', (file) => {
    const html = readFileSync(file, 'utf8');

    expect(html).toMatch(/<script\b[^>]*>[^<]*sudohire-consent/);
    expect(html).not.toMatch(/<script[^>]*\bsrc=/i);
  });

  it('ships no script file', () => {
    expect(files('dist-consent', '.js')).toEqual([]);
  });
});

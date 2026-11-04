import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

// The content of the built pages in dist/. `npm run check` builds it first.
const dist = 'dist';
const site = 'https://sudohire.dev';

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

// The URL path of a built file: dist/install/index.html is /install/.
function pathOf(file: string): string {
  const url = '/' + relative(dist, file).split(sep).join('/');
  return url.replace(/(^|\/)index\.html$/, '$1');
}

// The text of a page, with the tags, scripts and styles taken out.
function textOf(html: string): string {
  return html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

const files = existsSync(dist) ? htmlFiles(dist) : [];
const pages = files.filter((file) => pathOf(file) !== '/404.html');

it('builds the two pages that the app opens', () => {
  const paths = files.map(pathOf);

  expect(paths).toContain('/privacy/');
  expect(paths).toContain('/help/');
});

describe.each(pages)('%s', (file) => {
  const html = readFileSync(file, 'utf8');
  const path = pathOf(file);

  it('has a description', () => {
    const descriptions = [...html.matchAll(/<meta name="description" content="([^"]*)"/g)];

    expect(descriptions).toHaveLength(1);
    expect(descriptions[0][1].trim()).not.toBe('');
  });

  it('has one canonical on the site', () => {
    const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)];

    expect(canonicals).toHaveLength(1);
    expect(canonicals[0][1]).toBe(site + path);
  });

  it('records the version of the app it was checked against', () => {
    const note = html.match(/<p class="checked">([^<]*)<\/p>/)?.[1] ?? '';

    expect(note).toMatch(/^Checked against sudo-hire (v\d+\.\d+\.\d+|main at [0-9a-f]{7})\.$/);
  });
});

describe.each(files)('%s', (file) => {
  it('names each section in the contents as its heading says', () => {
    const html = readFileSync(file, 'utf8');
    const nav = html.match(/<nav class="contents"[\s\S]*?<\/nav>/)?.[0];
    if (!nav) return;
    const strip = (inner: string) => inner.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').trim();
    const links = [...nav.matchAll(/<a href="#([^"]+)">([\s\S]*?)<\/a>/g)].map(([, id, inner]) => [id, strip(inner)]);
    const headings = [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map(([, id, inner]) => [id, strip(inner)]);

    expect(links).toEqual(headings);
  });

  it('has the favicon of the app', () => {
    const html = readFileSync(file, 'utf8');

    expect(html).toContain('<link rel="icon" href="/favicon.svg" type="image/svg+xml">');
    expect(html).toContain('<link rel="apple-touch-icon" href="/apple-touch-icon.png">');
  });
});

it('ships the favicon files', () => {
  expect(existsSync(join(dist, 'favicon.svg'))).toBe(true);
  expect(existsSync(join(dist, 'apple-touch-icon.png'))).toBe(true);
});

it('ships no script file and loads no script from another site', () => {
  const all = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? all(join(dir, entry.name)) : [join(dir, entry.name)]));

  expect(all(dist).filter((file) => file.endsWith('.js'))).toEqual([]);
  for (const file of files) {
    expect(readFileSync(file, 'utf8'), file).not.toMatch(/<script\b[^>]*\bsrc=/);
  }
});

describe.each(files)('%s', (file) => {
  const html = readFileSync(file, 'utf8');
  const text = textOf(html);

  it('has no placeholder text', () => {
    expect(text).not.toMatch(/\bTODO\b|\blorem\b|\bipsum\b|\bTBD\b/i);
  });

  it('has no em or en dash', () => {
    expect(text).not.toMatch(/[–—]|&[mn]dash;/);
  });

  it('opens every external link in a new tab and says so', () => {
    const links = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];
    const external = links.filter(([, attrs]) => /href="https?:\/\//.test(attrs) && !attrs.includes(`href="${site}`));

    for (const [, attrs, inner] of external) {
      expect(attrs).toContain('target="_blank"');
      expect(attrs).toContain('rel="noopener"');
      expect(inner).toContain('(opens in a new tab)');
    }
  });
});

it('has no em or en dash in a tracked markdown file', () => {
  const tracked = execFileSync('git', ['ls-files', '*.md'], { encoding: 'utf8' }).split('\n').filter(Boolean);

  for (const file of tracked) {
    expect(readFileSync(file, 'utf8'), file).not.toMatch(/[–—]/);
  }
});

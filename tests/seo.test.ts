import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

// The files for search engines and AI tools, and the share tags, in dist/.
// `npm run check` builds it first.
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

function read(name: string): string {
  const file = join(dist, name);
  return existsSync(file) ? readFileSync(file, 'utf8') : '';
}

function meta(html: string, key: string): string[] {
  return [...html.matchAll(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`, 'g'))].map(([, value]) => value);
}

const decode = (text: string) => text.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const files = existsSync(dist) ? htmlFiles(dist) : [];
const pages = files.filter((file) => pathOf(file) !== '/404.html');
const urls = pages.map((file) => site + pathOf(file)).sort();

describe('robots.txt', () => {
  const robots = read('robots.txt');

  it('lets every crawler read every page', () => {
    expect(robots).toMatch(/^User-agent: \*$/m);
    expect(robots).not.toMatch(/^Disallow: *\S/m);
  });

  it('names the sitemap', () => {
    expect(robots).toMatch(new RegExp(`^Sitemap: ${site}/sitemap\\.xml$`, 'm'));
  });
});

describe('sitemap.xml', () => {
  const sitemap = read('sitemap.xml');
  const locs = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, loc]) => loc);

  it('is a sitemap', () => {
    expect(sitemap).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(sitemap).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  });

  it('lists every page once, on the site, and not the 404', () => {
    expect([...locs].sort()).toEqual(urls);
    expect(locs.join(' ')).not.toContain('404');
  });
});

describe('llms.txt', () => {
  const llms = read('llms.txt');
  const links = [...llms.matchAll(/^- \[([^\]]+)\]\(([^)]+)\): (.+)$/gm)];

  it('starts with the name and the summary', () => {
    expect(llms).toMatch(/^# Sudo Hire\n\n> \S.+\n/);
  });

  it('lists every page once, on the site, and not the 404', () => {
    expect(links.map(([, , url]) => url).sort()).toEqual(urls);
    expect(llms).not.toContain('404');
  });

  it('gives each page the description of the page', () => {
    for (const [, , url, description] of links) {
      const file = pages.find((page) => site + pathOf(page) === url)!;
      const html = readFileSync(file, 'utf8');

      expect(description, url).toBe(decode(meta(html, 'description')[0]));
    }
  });

  it('has no em or en dash', () => {
    expect(llms).not.toMatch(/[–—]/);
  });
});

describe('the 404 page', () => {
  const html = read('404.html');

  it('is not indexed', () => {
    expect(meta(html, 'robots')).toEqual(['noindex']);
  });

  it('has no canonical', () => {
    expect(html).not.toContain('rel="canonical"');
  });

  it('links home', () => {
    expect(html).toMatch(/<main[\s\S]*<a href="\/">[\s\S]*<\/main>/);
  });
});

it('gives each page its own description', () => {
  const descriptions = pages.map((file) => meta(readFileSync(file, 'utf8'), 'description')[0]);

  expect(new Set(descriptions).size).toBe(pages.length);
});

describe.each(pages)('%s', (file) => {
  const html = readFileSync(file, 'utf8');
  const path = pathOf(file);

  it('is indexed', () => {
    expect(meta(html, 'robots')).toEqual([]);
  });

  it('has the Open Graph tags', () => {
    expect(meta(html, 'og:type')).toEqual(['website']);
    expect(meta(html, 'og:site_name')).toEqual(['Sudo Hire']);
    expect(meta(html, 'og:url')).toEqual([site + path]);
    expect(meta(html, 'og:title')).toHaveLength(1);
    expect(meta(html, 'og:title')[0]).not.toBe('');
    expect(meta(html, 'og:description')).toEqual(meta(html, 'description'));
    expect(meta(html, 'og:image')).toEqual([`${site}/og.png`]);
    expect(meta(html, 'og:image:alt')).toHaveLength(1);
    expect(meta(html, 'og:image:alt')[0]).not.toBe('');
  });

  it('has the Twitter card', () => {
    expect(meta(html, 'twitter:card')).toEqual(['summary_large_image']);
  });
});

describe('the preview image', () => {
  const file = join(dist, 'og.png');
  const png = existsSync(file) ? readFileSync(file) : Buffer.alloc(0);
  const home = read('index.html');

  it('is a PNG', () => {
    expect(png.subarray(0, 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  });

  it('has the size that its tags give', () => {
    // The IHDR chunk comes first: the width at byte 16, the height at byte 20.
    expect(meta(home, 'og:image:width')).toEqual([String(png.readUInt32BE(16))]);
    expect(meta(home, 'og:image:height')).toEqual([String(png.readUInt32BE(20))]);
  });
});

// @vitest-environment happy-dom
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const html = readFileSync(resolve(import.meta.dirname, '../placeholder/index.html'), 'utf8');
const doc = new DOMParser().parseFromString(html, 'text/html');
const text = doc.body.textContent.replace(/\s+/g, ' ');

describe('the placeholder page', () => {
  it('is a complete page on its own', () => {
    expect(doc.documentElement.getAttribute('lang')).toBe('en');
    expect(doc.querySelector('meta[charset]')).not.toBeNull();
    expect(doc.querySelector('meta[name="viewport"]')).not.toBeNull();
    expect(doc.querySelector('title').textContent.startsWith('Sudo Hire')).toBe(true);
  });

  it('loads nothing from another site', () => {
    const style = doc.querySelector('style').textContent;

    expect(doc.querySelectorAll('script')).toHaveLength(0);
    expect(doc.querySelectorAll('[src]')).toHaveLength(0);
    for (const link of doc.querySelectorAll('link[href]')) {
      expect(link.getAttribute('href').startsWith('data:')).toBe(true);
    }
    expect(style).not.toContain('@import');
    for (const [, url] of style.matchAll(/url\(\s*["']?([^"')]*)/g)) {
      expect(url.startsWith('data:')).toBe(true);
    }
  });

  it('has its own icon, so no browser asks for /favicon.ico', () => {
    expect(doc.querySelector('link[rel="icon"]').getAttribute('href')).toMatch(/^data:image\/svg\+xml,/);
  });

  it('carries the tagline', () => {
    expect(doc.querySelector('.cmd').textContent.replace(/\s+/g, ' ').trim()).toBe('$ sudo hire --remote-from here');
  });

  it('gives a shared link a title and a description', () => {
    expect(doc.querySelector('meta[property="og:title"]').getAttribute('content')).toBe('Sudo Hire');
    expect(doc.querySelector('meta[property="og:description"]').getAttribute('content')).not.toBe('');
    expect(doc.querySelector('meta[property="og:url"]').getAttribute('content')).toBe('https://sudohire.dev/');
  });

  it('gives a shared link a large image that the site serves itself', () => {
    expect(doc.querySelector('meta[property="og:image"]').getAttribute('content')).toBe('https://sudohire.dev/og.png');
    expect(doc.querySelector('meta[name="twitter:card"]').getAttribute('content')).toBe('summary_large_image');
    expect(existsSync(resolve(import.meta.dirname, '../placeholder/og.png'))).toBe(true);
  });

  it('shows the admitted stamp from the first frame', () => {
    const keyframes = doc.querySelector('style').textContent.match(/@keyframes land\{from\{([^}]*)\}/)[1];

    expect(keyframes).not.toContain('opacity');
  });

  it('shows one stamp per example job, for eligibility only', () => {
    for (const job of doc.querySelectorAll('.job')) {
      expect(job.querySelectorAll('.stamp')).toHaveLength(1);
    }
    expect([...doc.querySelectorAll('.stamp')].map((s) => s.textContent.trim().replace(/\s+/g, ' '))).toEqual(['IT Admitted', 'US Only']);
  });

  it('follows the device theme', () => {
    expect(doc.querySelector('style').textContent).toContain('prefers-color-scheme:dark');
  });

  it('only links out over HTTPS, in a new tab', () => {
    const links = [...doc.querySelectorAll('a[href]')];

    expect(links).not.toHaveLength(0);

    for (const link of links) {
      expect(link.getAttribute('href').startsWith('https://')).toBe(true);
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });

  it('tells the copyright holder\'s sites where a visit came from', () => {
    const hrefs = [...doc.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));

    expect(hrefs).toEqual([
      'https://albertoarena.it/?utm_source=sudohire.dev&utm_medium=referral&utm_campaign=placeholder',
      'https://sudoplay.dev/?utm_source=sudohire.dev&utm_medium=referral&utm_campaign=placeholder',
    ]);
  });

  it('makes no promise before the release', () => {
    expect(text).not.toMatch(/download|available now|\bfree\b|open source|notari[sz]|signed|\bv?\d+\.\d+/i);
    expect(html).not.toMatch(/™|®|&trade;|&reg;/);
  });
});

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import worker from '../src/worker.js';

// wrangler.jsonc, read as JSON once its comment lines are gone.
const config = JSON.parse(
  readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('//'))
    .join('\n'),
);

describe('the deploy config', () => {
  it('deploys the placeholder', () => {
    expect(config.assets.directory).toBe('./placeholder');
  });

  it('sends a missing address to the worker', () => {
    expect(config.main).toBe('src/worker.js');
    expect(config.assets.not_found_handling).toBeUndefined();
  });

  it('serves the site on sudohire.dev and www.sudohire.dev', () => {
    expect(config.routes).toEqual([
      { pattern: 'sudohire.dev', custom_domain: true },
      { pattern: 'www.sudohire.dev', custom_domain: true },
    ]);
  });
});

describe('the worker', () => {
  it.each([
    'https://sudohire.dev/settings',
    'https://sudohire.dev/docs/sources/?q=1',
    'https://www.sudohire.dev/favicon.ico',
  ])('redirects %s to the home page for now', (url) => {
    const response = worker.fetch(new Request(url));

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe(`${new URL(url).origin}/`);
  });
});

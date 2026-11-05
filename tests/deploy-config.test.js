import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const root = new URL('../', import.meta.url);

// wrangler.jsonc, read as JSON once its comment lines are gone.
const config = JSON.parse(
  readFileSync(new URL('wrangler.jsonc', root), 'utf8')
    .split('\n')
    .filter((line) => !line.trimStart().startsWith('//'))
    .join('\n'),
);

const workflow = readFileSync(new URL('.github/workflows/deploy.yml', root), 'utf8');

describe('the deploy config', () => {
  it('deploys the built site', () => {
    expect(config.assets.directory).toBe('./dist');
  });

  it('answers a missing address with the 404 page', () => {
    expect(config.assets.not_found_handling).toBe('404-page');
  });

  it('serves static files only, with no worker script', () => {
    expect(config.main).toBeUndefined();
    expect(existsSync(new URL('src/worker.js', root))).toBe(false);
  });

  it('serves the site on sudohire.dev and www.sudohire.dev', () => {
    expect(config.routes).toEqual([
      { pattern: 'sudohire.dev', custom_domain: true },
      { pattern: 'www.sudohire.dev', custom_domain: true },
    ]);
  });

  it('no longer has the placeholder', () => {
    expect(existsSync(new URL('placeholder', root))).toBe(false);
  });
});

describe('the Deploy workflow', () => {
  // The step lines in the order the workflow runs them.
  const steps = workflow.split('\n').filter((line) => /^\s+(- name|run|command):/.test(line));
  const at = (pattern) => steps.findIndex((line) => pattern.test(line));

  it('runs only when the owner starts it by hand', () => {
    const on = workflow.match(/^on:\n((?:[ \t]+.*\n)+)/m)[1];

    expect(on.trim()).toBe('workflow_dispatch:');
  });

  it('runs every check before the deploy build', () => {
    expect(at(/run: npm run check$/)).toBeGreaterThan(-1);
    expect(at(/run: npm run check$/)).toBeLessThan(at(/name: Build the site with the measurement ID/));
  });

  it('builds with the measurement ID from the repository variable', () => {
    expect(workflow).toContain('PUBLIC_GA_MEASUREMENT_ID: ${{ vars.PUBLIC_GA_MEASUREMENT_ID }}');
    expect(workflow).not.toMatch(/G-[A-Z0-9]{6,}/);
  });

  it('deploys after the build, then checks the live site', () => {
    expect(at(/name: Build the site with the measurement ID/)).toBeLessThan(at(/command: deploy/));
    expect(at(/command: deploy/)).toBeLessThan(at(/run: node scripts\/check-live\.mjs$/));
  });
});

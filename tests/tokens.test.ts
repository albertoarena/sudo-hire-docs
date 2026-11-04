import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// The color tokens of sudo-hire docs/DESIGN.md, light in :root and dark in the
// prefers-color-scheme block. Text pairs need 4.5:1, UI pairs 3:1 (WCAG 2.2 AA).
const css = readFileSync('src/styles/tokens.css', 'utf8');

function tokens(block: string): Record<string, string> {
  return Object.fromEntries([...block.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)].map(([, name, value]) => [name, value]));
}

const light = tokens(css.split('@media')[0]);
const darkBlocks = css.slice(css.indexOf('prefers-color-scheme: dark')).split('[data-theme="dark"]');
const dark = tokens(darkBlocks[0]);

// The dark tokens are written twice: for a dark system, and for a reader who
// chooses dark. The two blocks must stay the same.
it('writes the same dark tokens for the system and for the choice', () => {
  expect(darkBlocks).toHaveLength(2);
  expect(tokens(darkBlocks[1])).toEqual(dark);
});

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const text: [string, string][] = [
  ['ink', 'page'], ['ink-2', 'page'], ['ink-3', 'page'],
  ['ink', 'panel'], ['ink-2', 'panel'], ['ink', 'sunk'], ['ink-2', 'sunk'], ['ink-3', 'sunk'],
  ['burgundy-ink', 'burgundy'], ['ok', 'page'], ['no', 'page'], ['unk', 'page'], ['ink', 'warn-bg'],
];
const ui: [string, string][] = [['focus', 'page'], ['focus', 'panel'], ['burgundy-ink', 'burgundy']];

describe.each([['light', light], ['dark', dark]] as const)('%s tokens', (_, set) => {
  it('defines every token of the app', () => {
    for (const name of ['burgundy', 'burgundy-ink', 'page', 'panel', 'sunk', 'ink', 'ink-2', 'ink-3', 'rule', 'ok', 'no', 'unk', 'warn-bg', 'focus']) {
      expect(set[name], name).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it.each(text)('%s on %s meets 4.5:1', (fg, bg) => {
    expect(contrast(set[fg], set[bg])).toBeGreaterThanOrEqual(4.5);
  });

  it.each(ui)('%s on %s meets 3:1', (fg, bg) => {
    expect(contrast(set[fg], set[bg])).toBeGreaterThanOrEqual(3);
  });
});

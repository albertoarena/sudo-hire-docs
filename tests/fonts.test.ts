import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { expect, it } from 'vitest';

// Fonts are the system font or self hosted (docs/SCOPE.md). No font loads
// from another site, and a font file ships with its license beside it.
const dist = 'dist';

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

const built = existsSync(dist) ? files(dist) : [];

it('loads no font or stylesheet from another site', () => {
  for (const file of built.filter((f) => /\.(css|html)$/.test(f))) {
    const text = readFileSync(file, 'utf8');
    expect(text, file).not.toMatch(/@import\s+url\(\s*["']?https?:/i);
    expect(text, file).not.toMatch(/@font-face[^}]*url\(\s*["']?(https?:)?\/\//i);
    expect(text, file).not.toMatch(/<link[^>]+href=["'](https?:)?\/\/[^"']*\.(css|woff2?)/i);
  }
});

it('ships every font file with its license', () => {
  for (const font of built.filter((f) => /\.(woff2?|ttf|otf)$/.test(f))) {
    expect(readdirSync(dirname(font)).some((name) => /licen[cs]e|OFL/i.test(name)), font).toBe(true);
  }
});

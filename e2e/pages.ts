import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// Every built page as a URL path, read from a build folder. So the tests
// cover a new page with no change. `npm run check` builds the site before
// Playwright collects the tests.
export function builtPages(root = 'dist'): string[] {
  const walk = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return walk(path);
      if (!entry.name.endsWith('.html')) return [];
      const url = '/' + relative(root, path).split(sep).join('/');
      return [url.replace(/(^|\/)index\.html$/, '$1')];
    });
  return walk(root);
}

import { readFile, writeFile } from 'node:fs/promises';
import type { AstroIntegration } from 'astro';
import { Window } from 'happy-dom';
import { pages } from '../data/nav';
import { llmsHead } from '../data/llms';

// llms-full.txt: the text of every page in one file, for AI tools.
// After the build, it reads the main of each built page, in the order of the
// navigation, and writes it as Markdown. The page h1 becomes an h2.

// Parts of the main that are not text: the contents list repeats the
// headings, the icons and the hidden text are for the screen, and the
// screenshot frame has no screenshot yet.
const DROP = 'nav, svg, figure, script, style, .visually-hidden';

type Block = string;

const fold = (text: string) => text.replace(/\s+/g, ' ');

function inline(node: Node, base: string): string {
  if (node.nodeType === 3) return fold(node.textContent ?? '');
  if (node.nodeType !== 1) return '';
  const el = node as Element;
  const label = el.getAttribute('aria-label');
  if (el.getAttribute('role') === 'img' && label) return `[${label}]`;
  const inner = () => [...el.childNodes].map((child) => inline(child, base)).join('');
  switch (el.tagName.toLowerCase()) {
    case 'b':
    case 'strong':
      return `**${inner().trim()}**`;
    case 'i':
    case 'em':
      return `*${inner().trim()}*`;
    case 'code':
      return `\`${el.textContent}\``;
    case 'br':
      return ' ';
    case 'a':
      return `[${inner().trim()}](${new URL(el.getAttribute('href') ?? '', base).href})`;
    default:
      return inner();
  }
}

const text = (node: Node, base: string) => fold(inline(node, base)).trim();

// A list item: the first block takes the marker, the next ones are indented
// under it. A heading in an item (a step title) is bold.
function item(li: Element, marker: string, base: string): string {
  const parts = blocks(li, base, 0).map((block) => block.replace(/^#+ (.*)$/, '**$1**'));
  const pad = ' '.repeat(marker.length + 1);
  return parts.map((part, i) => (i === 0 ? `${marker} ${part}` : pad + part.split('\n').join(`\n${pad}`))).join('\n');
}

function table(el: Element, base: string): Block {
  const rows = [...el.querySelectorAll('tr')].map(
    (tr) => `| ${[...tr.querySelectorAll('th, td')].map((cell) => text(cell, base).replace(/\|/g, '\\|')).join(' | ')} |`,
  );
  const columns = el.querySelector('tr')?.querySelectorAll('th, td').length ?? 0;
  rows.splice(1, 0, `| ${Array(columns).fill('---').join(' | ')} |`);
  return rows.join('\n');
}

function blocks(node: Node, base: string, shift: number): Block[] {
  const out: Block[] = [];
  let run = '';
  const flush = () => {
    if (run.trim()) out.push(fold(run).trim());
    run = '';
  };

  for (const child of node.childNodes) {
    if (child.nodeType !== 1) {
      run += inline(child, base);
      continue;
    }
    const el = child as Element;
    const tag = el.tagName.toLowerCase();
    const heading = tag.match(/^h([1-6])$/);
    if (heading) {
      flush();
      out.push(`${'#'.repeat(Math.min(6, Number(heading[1]) + shift))} ${text(el, base)}`);
    } else if (tag === 'p' || tag === 'dt') {
      flush();
      const line = text(el, base);
      if (line) out.push(tag === 'dt' ? `**${line}**` : line);
    } else if (tag === 'ul' || tag === 'ol') {
      flush();
      const items = [...el.children].filter((li) => li.tagName.toLowerCase() === 'li');
      out.push(items.map((li, i) => item(li, tag === 'ol' ? `${i + 1}.` : '-', base)).join('\n'));
    } else if (tag === 'table') {
      flush();
      out.push(table(el, base));
    } else if (tag === 'pre') {
      flush();
      out.push(`\`\`\`\n${(el.textContent ?? '').replace(/\n$/, '')}\n\`\`\``);
    } else if (['div', 'section', 'main', 'dl', 'dd', 'li', 'header', 'aside'].includes(tag)) {
      flush();
      out.push(...blocks(el, base, shift));
    } else {
      run += inline(el, base);
    }
  }
  flush();
  return out;
}

/** The main of a built page as Markdown, with its links made absolute on `url`. */
export function pageToMarkdown(html: string, url: string): string {
  const window = new Window({ url });
  const doc = window.document;
  doc.write(html);
  const main = doc.querySelector('main');
  if (!main) throw new Error(`${url} has no main.`);
  main.querySelectorAll(DROP).forEach((el) => el.remove());
  const markdown = blocks(main as unknown as Node, url, 1).join('\n\n');
  window.close();
  return markdown;
}

/** The whole file, from the built pages in `dir`. */
export async function llmsFull(dir: URL, site: URL): Promise<string> {
  const sections = await Promise.all(
    pages.map(async (page) => {
      const url = new URL(page.href, site).href;
      const html = await readFile(new URL(`.${page.href}index.html`, dir), 'utf8');
      const [title, ...rest] = pageToMarkdown(html, url).split('\n\n');
      return [title, `Page: ${url}`, ...rest].join('\n\n');
    }),
  );
  return [llmsHead(), ...sections].join('\n\n') + '\n';
}

/** Writes llms-full.txt into the build output, after the pages are built. */
export function llmsFullIntegration(): AstroIntegration {
  let site: URL;
  return {
    name: 'llms-full',
    hooks: {
      'astro:config:done': ({ config }) => {
        site = new URL(config.site!);
      },
      'astro:build:done': async ({ dir, logger }) => {
        await writeFile(new URL('llms-full.txt', dir), await llmsFull(dir, site));
        logger.info('llms-full.txt written');
      },
    },
  };
}

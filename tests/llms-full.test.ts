import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { pageToMarkdown } from '../src/lib/llms-full';
import { pages } from '../src/data/nav';

// llms-full.txt: the text of every page in one file, for AI tools.
// The first part tests the converter. The second part reads dist/, so
// `npm run check` builds it first.

const url = 'https://sudohire.dev/install/';
const page = (main: string) => `<html><body><header><p>Menu</p></header><main>${main}</main><footer><p>Made by</p></footer></body></html>`;

describe('the page converter', () => {
  it('keeps only the main of the page, with the headings one level down', () => {
    expect(pageToMarkdown(page('<h1>Install</h1><p>Text.</p><h2 id="a">Step</h2><h3>Sub</h3>'), url)).toBe(
      '## Install\n\nText.\n\n### Step\n\n#### Sub',
    );
  });

  it('drops the contents list, the icons, the hidden text and the screenshot frame', () => {
    const md = pageToMarkdown(
      page(
        '<h1>T</h1><nav class="contents"><ul><li><a href="#a">A</a></li></ul></nav>' +
          '<p><a href="https://github.com/albertoarena/sudo-hire" target="_blank">x<svg><path d="M0"/></svg><span class="visually-hidden"> (opens in a new tab)</span></a></p>' +
          '<figure class="shot"><div class="frame">Later.</div><figcaption>The list.</figcaption></figure>',
      ),
      url,
    );

    expect(md).toBe('## T\n\n[x](https://github.com/albertoarena/sudo-hire)');
  });

  it('makes every link absolute', () => {
    const md = pageToMarkdown(page('<p><a href="/help/">Help</a>, <a href="#log">the log</a> and <a href="../sources/">sources</a>.</p>'), url);

    expect(md).toBe(
      '[Help](https://sudohire.dev/help/), [the log](https://sudohire.dev/install/#log) and [sources](https://sudohire.dev/sources/).',
    );
  });

  it('keeps bold, code and the label of a stamp', () => {
    const md = pageToMarkdown(
      page('<p>$ sudo hire <b>--remote-from here</b>, <code>arm64</code>, <span class="stamp" role="img" aria-label="Stamp: IT, Admitted"><span>IT</span><span>Admitted</span></span> Green.</p>'),
      url,
    );

    expect(md).toBe('$ sudo hire **--remote-from here**, `arm64`, [Stamp: IT, Admitted] Green.');
  });

  it('writes lists, with a step heading and its text on one item', () => {
    const md = pageToMarkdown(
      page('<ul><li>One</li><li>Two</li></ul><ol class="steps"><li><div><h3>Welcome</h3><p>Choose Start.</p></div></li><li><div><p>Next.</p></div></li></ol>'),
      url,
    );

    expect(md).toBe('- One\n- Two\n\n1. **Welcome**\n   Choose Start.\n2. Next.');
  });

  it('writes each setting as its name, then its text', () => {
    const md = pageToMarkdown(
      page('<dl><div><dt>Country</dt><dd><p>Where you work.</p><p class="default">Default: none.</p></dd></div></dl>'),
      url,
    );

    expect(md).toBe('**Country**\n\nWhere you work.\n\nDefault: none.');
  });

  it('writes a table as a Markdown table', () => {
    const md = pageToMarkdown(
      page('<div class="table"><table><thead><tr><th>Error</th><th>What</th></tr></thead><tbody><tr><td>No answer</td><td>A | B</td></tr></tbody></table></div>'),
      url,
    );

    expect(md).toBe('| Error | What |\n| --- | --- |\n| No answer | A \\| B |');
  });

  it('keeps a code block as it is', () => {
    expect(pageToMarkdown(page('<pre><code>line 1\n  line 2</code></pre>'), url)).toBe('```\nline 1\n  line 2\n```');
  });

  it('decodes the entities and folds the white space', () => {
    expect(pageToMarkdown(page('<p>A &quot;quote&quot;\n   &amp; more</p>'), url)).toBe('A "quote" & more');
  });
});

describe('llms-full.txt', () => {
  const file = join('dist', 'llms-full.txt');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : '';

  it('starts with the name and the summary, as llms.txt does', () => {
    const llms = readFileSync(join('dist', 'llms.txt'), 'utf8');
    const head = llms.split('\n## ')[0];

    expect(text.startsWith(head)).toBe(true);
  });

  it('has every page once, in the order of the navigation, with its address', () => {
    const titles = [...text.matchAll(/^## (.+)\n\nPage: (\S+)$/gm)].map(([, , address]) => address);

    expect(titles).toEqual(pages.map((page) => `https://sudohire.dev${page.href}`));
  });

  it('has the key text of the pages', () => {
    expect(text).toContain('## How do I install Sudo Hire?');
    expect(text).toContain('**Country**');
    expect(text).toContain('| Error | What happened |');
  });

  it('has no HTML, no hidden text and no relative link', () => {
    expect(text).not.toMatch(/<[a-z][^>]*>/i);
    expect(text).not.toContain('opens in a new tab');
    expect(text).not.toMatch(/\]\((?!https:\/\/)/);
  });

  it('leaves out the 404 page', () => {
    expect(text).not.toContain('404');
  });

  it('has no em or en dash', () => {
    expect(text).not.toMatch(/[–—]/);
  });

  it('is named in llms.txt', () => {
    const llms = readFileSync(join('dist', 'llms.txt'), 'utf8');

    expect(llms).toMatch(/\n## Optional\n\n- \[Full text\]\(https:\/\/sudohire\.dev\/llms-full\.txt\): .+\n$/);
  });
});

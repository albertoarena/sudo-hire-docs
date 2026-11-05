import type { APIRoute } from 'astro';
import { llmsHead } from '../data/llms';
import { groups } from '../data/nav';

// A short map of the site for AI tools: what Sudo Hire is, then each page
// with its link and its description, in the groups of the navigation.
// The full text of the pages is in llms-full.txt (src/lib/llms-full.ts).
export const GET: APIRoute = ({ site }) => {
  const lines = [
    llmsHead(),
    ...groups.flatMap((group) => [
      '',
      `## ${group.label}`,
      '',
      ...group.pages.map((page) => `- [${page.label}](${new URL(page.href, site)}): ${page.description}`),
    ]),
    '',
    '## Optional',
    '',
    `- [Full text](${new URL('/llms-full.txt', site)}): the text of every page of this site, in one file.`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

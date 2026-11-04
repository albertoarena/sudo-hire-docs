import type { APIRoute } from 'astro';
import { groups, pages } from '../data/nav';

// A short map of the site for AI tools: what Sudo Hire is, then each page
// with its link and its description, in the groups of the navigation.
export const GET: APIRoute = ({ site }) => {
  const summary = pages.find((page) => page.href === '/')!.description;
  const lines = [
    '# Sudo Hire',
    '',
    `> ${summary}`,
    '',
    'Sudo Hire checks where you can work from, so a developer in Italy does not see a job that is "Remote, US only". It needs macOS 12 Monterey or later and a Mac with Apple silicon. This site documents the released app.',
    ...groups.flatMap((group) => [
      '',
      `## ${group.label}`,
      '',
      ...group.pages.map((page) => `- [${page.label}](${new URL(page.href, site)}): ${page.description}`),
    ]),
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};

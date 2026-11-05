import { pages } from './nav';

// The start of llms.txt and llms-full.txt: the name, the summary, and what the
// app needs.
export function llmsHead(): string {
  const summary = pages.find((page) => page.href === '/')!.description;
  return [
    '# Sudo Hire',
    '',
    `> ${summary}`,
    '',
    'Sudo Hire checks where you can work from, so a developer in Italy does not see a job that is "Remote, US only". It needs macOS 12 Monterey or later and a Mac with Apple silicon. This site documents the released app.',
  ].join('\n');
}

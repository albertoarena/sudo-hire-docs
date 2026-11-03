// The site navigation: four question groups, each with its pages (docs/SCOPE.md).
// A group link opens the first page of the group.
export type NavPage = { href: string; label: string };
export type NavGroup = { label: string; pages: NavPage[] };

export const groups: NavGroup[] = [
  {
    label: 'Get started',
    pages: [
      { href: '/', label: 'Home' },
      { href: '/install/', label: 'Install and first run' },
    ],
  },
  {
    label: 'Understand a screen',
    pages: [
      { href: '/how-it-works/', label: 'How it works' },
      { href: '/settings/', label: 'Settings' },
      { href: '/sources/', label: 'Sources' },
    ],
  },
  {
    label: 'Fix a problem',
    pages: [{ href: '/help/', label: 'Help' }],
  },
  {
    label: 'Your data',
    pages: [{ href: '/privacy/', label: 'Privacy' }],
  },
];

export function groupOf(path: string): NavGroup | undefined {
  return groups.find((group) => group.pages.some((page) => page.href === path));
}

// The site navigation: five question groups, each with its pages (docs/SCOPE.md).
// A group link opens the first page of the group. This is also the page list of
// the sitemap and llms.txt, and the source of each page description.
export type NavPage = { href: string; label: string; description: string };
export type NavGroup = { label: string; pages: NavPage[] };

export const groups: NavGroup[] = [
  {
    label: 'Get started',
    pages: [
      {
        href: '/',
        label: 'Home',
        description: 'Sudo Hire is a macOS menu bar app that finds PHP and Laravel jobs you can do from where you live.',
      },
      {
        href: '/install/',
        label: 'Install and first run',
        description: 'How to download and install Sudo Hire on a Mac, and what the first run asks.',
      },
    ],
  },
  {
    label: 'Understand a screen',
    pages: [
      {
        href: '/how-it-works/',
        label: 'How it works',
        description: 'How Sudo Hire scans the sources, filters the jobs, stamps each job and sends one summary notification.',
      },
      {
        href: '/settings/',
        label: 'Settings',
        description: 'Each pane of the Sudo Hire settings window: what each setting does and its default.',
      },
      {
        href: '/sources/',
        label: 'Sources',
        description: 'The job boards and career pages that Sudo Hire reads, how often it reads each one, and how a job names its source.',
      },
    ],
  },
  {
    label: 'Fix a problem',
    pages: [{
        href: '/help/',
        label: 'Help',
        description: 'Answers to common Sudo Hire problems, how to read the log, and how to report a problem.',
      }],
  },
  {
    label: 'Your data',
    pages: [{
        href: '/privacy/',
        label: 'Privacy',
        description: 'What this site collects, and a summary of what the Sudo Hire app sends and stores.',
      }],
  },
  {
    label: 'What’s next',
    pages: [{
        href: '/roadmap/',
        label: 'Roadmap',
        description: 'The changes planned for Sudo Hire after v1.0.0. Nothing here has a date.',
      }],
  },
];

export const pages: NavPage[] = groups.flatMap((group) => group.pages);

export function groupOf(path: string): NavGroup | undefined {
  return groups.find((group) => group.pages.some((page) => page.href === path));
}

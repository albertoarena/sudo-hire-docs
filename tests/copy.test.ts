import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The key copy of each page, in the words of the app (sudo-hire). The site
// must use the names, labels and defaults of the app, as they are in the app.
const dist = 'dist';

function textOf(path: string): string {
  const file = join(dist, path, 'index.html');
  if (!existsSync(file)) return '';
  return readFileSync(file, 'utf8')
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

function headingsOf(path: string, level: number): string[] {
  const file = join(dist, path, 'index.html');
  if (!existsSync(file)) return [];
  const html = readFileSync(file, 'utf8');
  return [...html.matchAll(new RegExp(`<h${level}\\b[^>]*>([\\s\\S]*?)</h${level}>`, 'g'))].map(([, inner]) =>
    inner.replace(/<[^>]+>/g, '').trim(),
  );
}

describe('/', () => {
  const text = textOf('/');

  it('says what the app does and offers the download', () => {
    expect(text).toContain('menu bar app');
    expect(text).toContain('Download for Mac');
  });
});

describe('/install/', () => {
  const text = textOf('install');

  it('names the two downloads and how to choose', () => {
    expect(text).toContain('arm64');
    expect(text).toContain('x64');
    expect(text).toContain('About This Mac');
  });

  it('follows the four steps of the first run', () => {
    for (const words of ['Jobs you can take, from where you live', 'Where do you work from?', 'What do you look for?', 'First scan']) {
      expect(text).toContain(words);
    }
    for (const button of ['Start', 'Next', 'Run first scan', 'Open the list']) {
      expect(text).toContain(`“${button}”`);
    }
  });
});

describe('/how-it-works/', () => {
  const text = textOf('how-it-works');

  it('gives the scan interval and the three tabs', () => {
    expect(text).toContain('every 5 minutes');
    for (const tab of ['New', 'Saved', 'Applied']) expect(text).toContain(`“${tab}”`);
  });

  it('names the three stamps in the words of the app', () => {
    expect(text).toMatch(/Admitted/);
    expect(text).toMatch(/Not stated/);
    expect(text).toMatch(/Not.{0,20}Admitted/);
  });

  it('gives the notification in the words of the app', () => {
    expect(text).toContain('6 new jobs: 4 Laravel, 2 PHP');
  });
});

describe('/settings/', () => {
  const panes = ['Where you work', 'Jobs', 'Pay', 'Notifications', 'Sources', 'Companies', 'Privacy', 'Troubleshooting'];

  it('has one section for each pane, in the order of the app', () => {
    expect(headingsOf('settings', 2)).toEqual(panes);
  });

  it('uses the labels of the app', () => {
    const text = textOf('settings');
    for (const label of ['Country', 'Timezone', 'Work mode', 'Location not stated', 'Time difference', 'Include', 'Exclude', 'Posted within', 'Hide companies', 'Show amounts in', 'Minimum per year', 'Payments per year', 'Minimum per day', 'Salary not stated', 'Notify at most every', 'Open log folder', 'Copy diagnostic report', 'Report a problem']) {
      expect(text).toContain(label);
    }
  });
});

describe('/sources/', () => {
  const text = textOf('sources');
  const boards = ['LaraJobs', 'Jobicy', 'Remotive', 'Himalayas', 'We Work Remotely'];

  it('names each job board with its attribution', () => {
    for (const board of boards) expect(text).toContain(`via ${board}`);
  });

  it('names each career page provider', () => {
    for (const provider of ['Greenhouse', 'Lever', 'Ashby', 'Personio']) expect(text).toContain(provider);
    expect(text).toContain('via Acme careers');
  });
});

describe('/privacy/', () => {
  const text = textOf('privacy');

  it('tells the site apart from the app', () => {
    expect(text).toContain('Google Analytics');
    expect(text).toContain('No account, no telemetry');
    expect(text).toContain('PRIVACY.md');
  });
});

describe('/help/', () => {
  const text = textOf('help');

  it('has the questions of the Troubleshooting pane', () => {
    for (const question of ['No new jobs for days', 'A source shows "Certificate error"', 'No notifications', '"Stopped in the background"']) {
      expect(text).toContain(question);
    }
  });

  it('says how to report a problem', () => {
    expect(text).toContain('Copy diagnostic report');
    expect(text).toContain('Report a problem');
  });
});

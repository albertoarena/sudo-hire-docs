import { describe, expect, it } from 'vitest';
import { checkSite } from '../scripts/check-live.mjs';

// The check that the Deploy workflow runs against the live site.
// Here it runs against a fake site, so it needs no network.

const origin = 'https://sudohire.dev';
const id = 'G-ABC123XYZ';
const page = `<html><head><script>/* theme */</script></head><body data-measurement-id="${id}"></body></html>`;

// A fake fetch that answers from a map of paths. Any other path is a 404.
function site(pages) {
  return async (url) => {
    const path = new URL(url).pathname;
    const body = pages[path];
    return body === undefined
      ? new Response('<h1>Not found</h1>', { status: 404 })
      : new Response(body, { status: 200 });
  };
}

const good = { '/': page, '/privacy/': page, '/help/': page };

describe('the live check', () => {
  it('passes a good site', async () => {
    expect(await checkSite(origin, { id, fetch: site(good) })).toEqual([]);
  });

  it('fails when Cloudflare adds its beacon', async () => {
    const beacon = page.replace('</body>', '<script defer src="https://static.cloudflareinsights.com/beacon.min.js"></script></body>');
    const problems = await checkSite(origin, { id, fetch: site({ ...good, '/': beacon }) });

    expect(problems.join('\n')).toMatch(/\/ loads a script file/);
  });

  it('fails when a page loads any script file', async () => {
    const file = page.replace('</head>', '<script src="/x.js"></script></head>');
    const problems = await checkSite(origin, { id, fetch: site({ ...good, '/help/': file }) });

    expect(problems.join('\n')).toMatch(/\/help\/ loads a script file/);
  });

  it('fails when a page the app opens does not answer', async () => {
    const { '/privacy/': _, ...rest } = good;
    const problems = await checkSite(origin, { id, fetch: site(rest) });

    expect(problems.join('\n')).toMatch(/\/privacy\/ answers 404/);
  });

  it('fails when a page redirects, for example to the home page', async () => {
    const fetch = async (url, init) => {
      expect(init.redirect).toBe('manual');
      return new URL(url).pathname === '/'
        ? new Response(page, { status: 200 })
        : new Response(null, { status: 302, headers: { location: '/' } });
    };
    const problems = await checkSite(origin, { id, fetch });

    expect(problems.join('\n')).toMatch(/\/help\/ answers 302/);
  });

  it('fails when an unknown page does not answer 404', async () => {
    const fetch = async () => new Response(page, { status: 200 });
    const problems = await checkSite(origin, { id, fetch });

    expect(problems.join('\n')).toMatch(/unknown page answers 200/);
  });

  it('fails when the home page has another measurement ID', async () => {
    const problems = await checkSite(origin, { id: 'G-OTHER0000', fetch: site(good) });

    expect(problems.join('\n')).toMatch(/does not carry the measurement ID G-OTHER0000/);
  });

  it('does not ask for an ID when none is set', async () => {
    const bare = { '/': '<html></html>', '/privacy/': '<html></html>', '/help/': '<html></html>' };

    expect(await checkSite(origin, { id: '', fetch: site(bare) })).toEqual([]);
  });
});

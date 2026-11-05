// Checks the live site after a deploy. The Deploy workflow runs it.
//
//   node scripts/check-live.mjs
//
// It checks sudohire.dev and www.sudohire.dev. With PUBLIC_GA_MEASUREMENT_ID set,
// it also checks that the home page carries that ID.
// It prints each problem and exits with 1 if there is one.

// The app opens these pages, so they must answer, with no redirect.
const PAGES = ['/', '/privacy/', '/help/'];

// The pages have inline scripts only. A script file means Cloudflare added one,
// for example the Web Analytics beacon, which must not load before consent.
const SCRIPT_FILE = /<script\b[^>]*\bsrc=|cloudflareinsights/i;

/**
 * Returns the problems of the site at `origin`. An empty list means it passes.
 * @param {string} origin
 * @param {{ id: string, fetch: typeof fetch }} options
 */
export async function checkSite(origin, { id, fetch }) {
  const problems = [];

  for (const path of PAGES) {
    const response = await fetch(new URL(path, origin), { redirect: 'manual' });
    if (response.status !== 200) {
      problems.push(`${origin}${path} answers ${response.status}.`);
      continue;
    }
    const html = await response.text();
    if (SCRIPT_FILE.test(html)) {
      problems.push(`${origin}${path} loads a script file. Check that Cloudflare Web Analytics is off.`);
    }
    if (path === '/' && id && !html.includes(`data-measurement-id="${id}"`)) {
      problems.push(`${origin}/ does not carry the measurement ID ${id}.`);
    }
  }

  const unknown = await fetch(new URL('/no-such-page/', origin), { redirect: 'manual' });
  if (unknown.status !== 404) {
    problems.push(`${origin}: an unknown page answers ${unknown.status}, not 404.`);
  }

  return problems;
}

// A new deploy can take a moment to reach every Cloudflare server, so each site gets a few tries.
async function main() {
  const id = (process.env.PUBLIC_GA_MEASUREMENT_ID ?? '').trim();
  let failed = false;

  for (const origin of ['https://sudohire.dev', 'https://www.sudohire.dev']) {
    let problems = [];
    for (let attempt = 1; attempt <= 6; attempt++) {
      problems = await checkSite(origin, { id, fetch }).catch((error) => [`${origin} did not answer: ${error.message}`]);
      if (problems.length === 0 || attempt === 6) break;
      await new Promise((resolve) => setTimeout(resolve, 20_000));
    }
    for (const problem of problems) console.log(`::error::${problem}`);
    failed ||= problems.length > 0;
    if (problems.length === 0) console.log(`${origin} passes.`);
  }

  process.exit(failed ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();

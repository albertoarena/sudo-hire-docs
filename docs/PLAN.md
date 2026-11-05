# Plan: the Sudo Hire docs site

Written 2026-11-03. `docs/SCOPE.md` says what the site is and why. This file says the order of the work.

Each phase is one branch and one pull request. The work stops after each pull request until the owner approves it.

Every phase is test first: the failing test is committed, then the code. One commit per green cycle.

## Phases

0. **Scope and plan.** `docs/SCOPE.md` and this file. No code.
   Branch: `docs/scope-and-plan`.

1. **Placeholder.** Done on 2026-11-02. One self contained `placeholder/index.html`, served from Cloudflare Workers on sudohire.dev and www.sudohire.dev. Phase 7 removes it from the repository. It stays live until the first deploy of the site.
   Tests (in place): the page loads nothing from another site, follows the device theme, carries the tagline and links out over https only. After each deploy, the live page has no script.

2. **Scaffold and smoke tests.** Plain Astro, a bare home page, the Vitest and Playwright setup, CI. No design and no copy.
   - `npm run build` builds `dist/`. `npm run build:consent` builds `dist-consent/` with a test measurement ID. `npm run check` runs both builds and every test.
   - CI runs `npm run check` on every pull request and every push to `main`. It installs Chromium for Playwright.
   - The placeholder, its tests and its Workers deploy keep working.
   Tests: the site builds; the home page has its heading; every page has a title; no page makes a request to another site before consent (Playwright); axe passes on every page, in light and dark.

3. **Design**, led by the owner with Impeccable. Tokens from `DESIGN.md` of sudo-hire, self hosted type if any, layout, light and dark, navigation, page shell.
   Tests: the shell is on every page (navigation, one `main`, one `h1`, footer); every navigation link resolves; axe passes in light and dark; no sideways scroll at 320px; every focus stop shows the focus ring; the text and UI color pairs meet WCAG contrast in both modes; every font file is self hosted with its license; no request to another site.

4. **Content:** the pages of `SCOPE.md`, in the words of the app.
   - Each page records the sudo-hire version it was checked against.
   - Each settings section uses the pane name and the labels of the app.
   Tests: each page has its title, its description and one canonical on `https://sudohire.dev`; each page has its key copy (for example each settings pane name, each source name with its "via" attribution); no placeholder text ("TODO", "lorem"); no em or en dash in a page or a tracked markdown file; every external link opens in a new tab and says so; `/privacy/` and `/help/` exist, because the app links to them.

5. **SEO basics:** `robots.txt`, the sitemap, `llms.txt`, the 404 page, Open Graph tags and the link preview image.
   - `llms.txt` gives AI tools a short map of the site: what Sudo Hire is, then each page with its link and its description. It is built from the same page list as the sitemap.
   - The preview image is the placeholder card (`art/og-card.html`), rendered to `public/og.png`.
   Tests: `robots.txt` blocks nothing and names the sitemap; the sitemap lists every page once, on `https://sudohire.dev`, and not the 404; `llms.txt` starts with the name and the summary, lists every page once with the description of the page, and not the 404; the 404 page is `noindex`, has no canonical and links home; each page has a unique description; the Open Graph and Twitter tags are set; the preview image is a PNG and its size matches its tags.

6. **GA4 and the consent gate.**
   - With no `PUBLIC_GA_MEASUREMENT_ID`, nothing changes: no banner, no button, no script.
   - The second build (`dist-consent/`) uses a test ID.
   Tests (Vitest): an invalid ID fails the build; the consent store reads, writes and clears the choice, and degrades when storage is missing; `dist/` ships no `.js` file, loads no script from another site and has no Google address; every `dist-consent/` page has the banner and no external script; `dist-consent/` ships no `.js` file.
   Tests (Playwright, on `dist-consent/`, with Google routed to an empty answer): the banner shows on every page with no request to another site; Accept loads `gtag.js` only, and is remembered on the next page; Decline loads nothing, now or on the next page; the footer button withdraws the choice and the banner shows again; Accept and Decline have the same size and style; the banner links to `/privacy/`; it covers nothing at the page end and fits 320px; it passes axe in light and dark.

7. **Deploy.** Cloudflare Workers serves `dist/`. Decided on 2026-11-05: the site stays on Workers.
   - `wrangler.jsonc` serves `./dist`, with the 404 page for a missing page. No worker script.
   - The Deploy workflow runs only when the owner starts it by hand. It runs every check, builds `dist/` with the measurement ID from the repository variable, deploys it, then checks the live site.
   - The placeholder, its tests and `src/worker.js` are removed.
   Tests: the config serves `./dist` with the 404 page and has no worker; the workflow has no trigger except the manual one, runs every check before the build with the ID, reads the ID from the repository variable and checks the live site after the deploy; the live check (on a fake site) fails on a script file or the Cloudflare beacon, on a page the app opens that does not answer or redirects, on an unknown page that is not a 404 and on a missing measurement ID.
   The site goes live at the release, when the owner runs the Deploy workflow.

## Before the release

- Check every page against the release build of sudo-hire, and record the release tag on each page.
- Check that `/privacy/` and `/help/` answer, because the app opens them.
- Check that the download button gets the DMG of the release.

## Open

See "Open" in `docs/SCOPE.md`.

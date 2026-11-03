# Plan: the Sudo Hire docs site

Written 2026-11-03. `docs/SCOPE.md` says what the site is and why. This file says the order of the work.

Each phase is one branch and one pull request. The work stops after each pull request until the owner approves it.

Every phase is test first: the failing test is committed, then the code. One commit per green cycle.

## Phases

0. **Scope and plan.** `docs/SCOPE.md` and this file. No code.
   Branch: `docs/scope-and-plan`.

1. **Placeholder.** Done on 2026-11-02. One self contained `placeholder/index.html`, served from Cloudflare Workers on sudohire.dev and www.sudohire.dev. It stays live until phase 7 retires it.
   Tests (in place): the page loads nothing from another site, follows the device theme, carries the tagline and links out over https only. After each deploy, the live page has no script.

2. **Scaffold and smoke tests.** Plain Astro, a bare home page, the Vitest and Playwright setup, CI. No design and no copy.
   - `npm run build` builds `dist/`. `npm run build:consent` builds `dist-consent/` with a test measurement ID. `npm run check` runs both builds and every test.
   - CI runs `npm run check` on every pull request and every push to `main`. It installs Chromium for Playwright.
   - The placeholder, its tests and its Workers deploy keep working.
   Tests: the site builds; the home page has its heading; every page has a title; no page makes a request to another origin before consent (Playwright); axe passes on every page, in light and dark.

3. **Design**, led by the owner with Impeccable. Tokens from `DESIGN.md` of sudo-hire, self hosted type if any, layout, light and dark, navigation, page shell.
   Tests: the shell is on every page (navigation, one `main`, one `h1`, footer); every navigation link resolves; axe passes in light and dark; no sideways scroll at 320px; every focus stop shows the focus ring; the text and UI color pairs meet WCAG contrast in both modes; every font file is self hosted with its license; no request to another origin.

4. **Content:** the pages of `SCOPE.md`, in the words of the app.
   - Each page records the sudo-hire version it was checked against.
   - Each settings section uses the pane name and the labels of the app.
   Tests: each page has its title, its description and one canonical on `https://sudohire.dev`; each page has its key copy (for example each settings pane name, each source name with its "via" attribution and its terms link); no placeholder text ("TODO", "lorem"); no em or en dash in a page or a tracked markdown file; every external link opens in a new tab and says so; `/privacy/` and `/help/` exist, because the app links to them.

5. **SEO basics:** `robots.txt`, the sitemap, the 404 page, Open Graph tags and the link preview image.
   Tests: `robots.txt` blocks nothing and names the sitemap; the sitemap lists every page once, on `https://sudohire.dev`, and not the 404; the 404 page is `noindex`, has no canonical and links home; each page has a unique description; the Open Graph and Twitter tags are set; the preview image is a PNG and its size matches its tags.

6. **GA4 and the consent gate.**
   - With no `PUBLIC_GA_MEASUREMENT_ID`, nothing changes: no banner, no button, no script.
   - The second build (`dist-consent/`) uses a test ID.
   Tests (Vitest): an invalid ID fails the build; the consent store reads, writes and clears the choice, and degrades when storage is missing; `dist/` has no script and no Google address; every `dist-consent/` page has the banner and no external script; `dist-consent/` ships no `.js` file.
   Tests (Playwright, on `dist-consent/`, with Google routed to an empty answer): the banner shows on every page with no request to another origin; Accept loads `gtag.js` only, and is remembered on the next page; Decline loads nothing, now or on the next page; the footer button withdraws the choice and the banner shows again; Accept and Decline have the same size and style; the banner links to `/privacy/`; it covers nothing at the page end and fits 320px; it passes axe in light and dark.

7. **Deploy.** The Publish workflow, the server script, the two `.htaccess` files, `docs/DEPLOYMENT.md` and a redirect check script.
   - On a green `main`, Publish builds with the measurement ID from the repository variable and force pushes `dist/` to the `deploy` branch.
   - The server script pulls `deploy` into a new release folder, switches `current` and keeps the newest 3 releases.
   - The Workers deploy, `wrangler.jsonc`, `src/worker.js` and the placeholder are retired. The Deploy section of `AGENTS.md` describes the host.
   Tests: Publish runs only after CI passes on a push to `main`, reads the ID from a repository variable and pushes to `deploy`; the server script deploys, reports "up to date" on a second run, keeps 3 releases and follows a force pushed branch (run for real against a local git origin); the release `.htaccess` folds `index.html`, adds the trailing slash, hides `current/` and `releases/` and serves the 404 page; the docroot `.htaccess` forbids `releases/`, redirects http and www before the rewrite, and rewrites to `current/` last.
   The redirect check runs against the live site after the host steps: no address shows `current/` or `releases/`, every redirect is one hop where it can be, an unknown page is a 404, and no page has the Cloudflare beacon.
   The site goes live at the release, after the owner makes the repository public and does the host steps.

## Before the release

- Check every page against the release build of sudo-hire, and record the release tag on each page.
- Check that `/privacy/` and `/help/` answer, because the app opens them.
- Check that the download button gets the DMG of the release.

## Open

See "Open" in `docs/SCOPE.md`.

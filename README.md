# sudo-hire-docs

The docs site for [Sudo Hire](https://github.com/albertoarena/sudo-hire). It will live at https://sudohire.dev.

Status: A placeholder page is live. The site is in progress: `docs/SCOPE.md` says what it is, and `docs/PLAN.md` says the order of the work.

## The site

Astro builds the site, on Node 22.

- `npm run dev` serves the site locally.
- `npm run build` checks the types and builds the site in `dist/`.
- `npm test` runs Vitest: the tests of the placeholder and of `dist/`. Build first.
- `npm run test:e2e` runs Playwright with axe on every built page. Run `npx playwright install chromium` once.
- `npm run check` runs both builds and every test. CI runs it on every pull request and every push to `main`.

## Placeholder

`placeholder/index.html` is one static page with inline CSS. It loads nothing from another site. Every other address redirects to it (`src/worker.js`).

- `npx wrangler dev` serves the page and the redirect locally.
- The Deploy workflow runs the tests and deploys the page to Cloudflare Workers. It runs only when started by hand. `wrangler.jsonc` holds the deploy config.

# sudo-hire-docs

The docs site for [Sudo Hire](https://github.com/albertoarena/sudo-hire). It will live at https://sudohire.dev.

Status: The site is built but not live yet. It goes live at the release of Sudo Hire. `docs/SCOPE.md` says what it is, and `docs/PLAN.md` says the order of the work.

## The site

Astro builds the site, on Node 22.

- `npm run dev` serves the site locally.
- `npm run build` checks the types and builds the site in `dist/`.
- `npm test` runs Vitest: the tests of the code, the deploy config and `dist/`. Build first.
- `npm run test:e2e` runs Playwright with axe on every built page. Run `npx playwright install chromium` once.
- `npm run check` runs both builds and every test. CI runs it on every pull request and every push to `main`.

## Deploy

Cloudflare Workers serves `dist/` on sudohire.dev and www.sudohire.dev. `wrangler.jsonc` holds the deploy config.

- `npm run build && npx wrangler dev` serves the built site locally, with the 404 page.
- The Deploy workflow runs every check, builds the site with the measurement ID and deploys it. It runs only when started by hand.
- After the deploy, `scripts/check-live.mjs` checks the live site.

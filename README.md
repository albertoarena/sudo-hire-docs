# sudo-hire-docs

The docs site for [Sudo Hire](https://github.com/albertoarena/sudo-hire). It will live at https://sudohire.dev.

Status: A placeholder page is live. The site is planned; the brief comes next.

## Placeholder

`placeholder/index.html` is one static page with inline CSS. It loads nothing from another site. Every other address redirects to it (`src/worker.js`).

- `npm test` runs the tests.
- `npx wrangler dev` serves the page and the redirect locally.
- Every push to `main` runs the tests and deploys the page to Cloudflare Workers. `wrangler.jsonc` holds the deploy config.

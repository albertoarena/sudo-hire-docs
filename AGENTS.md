# AGENTS.md

Rules for anyone who works on this repository, human or agent.

## What this site is

This is the docs site for Sudo Hire, a macOS menu bar app. The app lives in the sudo-hire repository. The site will deploy to https://sudohire.dev.

## Document only what is released

- The site documents what is released in sudo-hire. It does not document unreleased work.
- Every page must match the shipped app: the same screens, the same words, the same settings and the same defaults.
- When the app changes in a release, the site changes with it.
- Do not document a feature before it is released.
- One exception: the Roadmap page (`/roadmap/`) lists the planned changes of `docs/ROADMAP.md` in sudo-hire. It says that nothing there has a date. A change leaves the page when it is released.

## Sources of truth

These files in sudo-hire are the sources of truth:

- `docs/PRODUCT.md`: the product.
- `docs/DESIGN.md`: colors, type and the words in the UI.
- `docs/REQUIREMENTS.md`
- `docs/DECISIONS.md`
- `PRIVACY.md`
- `TRADEMARK.md`
- `docs/ROADMAP.md`: only for the Roadmap page.

When the site and these files disagree, stop and ask. Do not guess.

## Git conventions

### Commits

- Small conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`, `ci:`.
- One commit per green test cycle is fine. Do not squash everything at the end.
- Format: `type: short subject` (50 characters at most), then a body paragraph. The body says what changed and why, not how.
- Use a heredoc for a commit message with more than one line.
- Show the exact commit message and pull request text first. Wait for a yes.

### No tool attribution

- Never attribute a commit or a pull request to a tool. No "Generated with ..." line. No `Co-Authored-By` trailer for a tool.
- This covers the pull request description too, not only the commit message. Some tools add a footer with a session link when they open a pull request. Remove it from the description before asking for review.
- On a local machine, configuration stops it. Keep `"attribution": { "commit": "", "pr": "", "commitTrailers": false, "sessionUrl": false }` in `~/.claude/settings.json`.
- In a cloud session, configuration does not stop it. The footer is added on the way out, so no settings file in the container removes it. Check the description of a pull request opened from a cloud session. Then remove the footer from a machine outside that session: in the GitHub web interface, or with `gh api -X PATCH repos/<owner>/<repo>/pulls/<number>` and the corrected body.

### Author

- Commits are authored by the repository owner, not by a tool.
- A cloud container can ship a global git identity for the tool, and every commit then inherits it. Set `git config user.name` and `git config user.email` before the first commit. Check with `git log -1 --format='%an <%ae>'`.
- The author is separate from the message. A clean message says nothing about the author, so check both.

### Branches and pull requests

- Every commit goes through a pull request, never straight to `main`.
- The one exception: a commit that changes only markdown files can go straight to `main`.
- A push to `main` does not deploy. The owner starts each deploy by hand.
- Never push to `main` outside that exception, and never merge your own pull request. These rules hold even when GitHub would allow it.

## Deploy

- Cloudflare Workers serves the built site (`dist/`) on sudohire.dev and www.sudohire.dev. `wrangler.jsonc` holds the config. A missing page gets the 404 page.
- The Deploy workflow runs every check, builds the site with the measurement ID and deploys it. It runs only when the owner starts it by hand, from the Actions tab. A merge to `main` does not go live.
- It needs two repository secrets: `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The token needs Workers Scripts Write on the account and Workers Routes Write on the sudohire.dev zone. The build reads the repository variable `PUBLIC_GA_MEASUREMENT_ID`.
- Cloudflare Web Analytics stays off for sudohire.dev. Its beacon would load before consent. After each deploy, `scripts/check-live.mjs` fails if a live page loads a script file.

## Before every commit and pull request

Do two passes.

1. Clarity pass. Use short sentences. Use one word for one meaning.
2. Confidentiality pass:
   - Name no repository except sudo-hire, sudo-hire-docs and their dependencies.
   - Name no other site. The one exception is the footer, which links to the copyright holder's sites: albertoarena.it and sudoplay.dev.
   - Name no person except the copyright holder.
   - Do not name AI sessions or reviews.
   - Do not evaluate tools or companies.
   - No secrets, private notes or personal data.

These rules also apply to fixtures, comments and test names.

## Local files

- Private working notes go in `.docs/`. It is gitignored.
- `AGENTS.local.md` holds local rules. It is gitignored.

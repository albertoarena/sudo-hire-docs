# AGENTS.md

Rules for anyone who works on this repository, human or agent.

## What this site is

This is the docs site for Sudo Hire, a macOS menu bar app. The app lives in the sudo-hire repository. The site will deploy to https://sudohire.dev.

## Document only what is released

- The site documents what is released in sudo-hire. It does not document unreleased work.
- Every page must match the shipped app: the same screens, the same words, the same settings and the same defaults.
- When the app changes in a release, the site changes with it.
- Do not document a feature before it is released.

## Sources of truth

These files in sudo-hire are the sources of truth:

- `docs/PRODUCT.md`: the product.
- `docs/DESIGN.md`: colors, type and the words in the UI.
- `docs/REQUIREMENTS.md`
- `docs/DECISIONS.md`
- `PRIVACY.md`
- `TRADEMARK.md`

When the site and these files disagree, stop and ask. Do not guess.

## Commits and pull requests

- Show the exact commit message and pull request text first. Wait for a yes.
- No AI attribution anywhere. No `Co-Authored-By` trailers. No "Generated with Claude" lines.
- Commits use the owner's git identity.
- Never merge your own pull request.

## Before every commit and pull request

Do two passes.

1. Clarity pass. Use short sentences. Use one word for one meaning.
2. Confidentiality pass:
   - Name no repository except sudo-hire, sudo-hire-docs and their dependencies.
   - Name no person except the copyright holder.
   - Do not name AI sessions or reviews.
   - Do not evaluate tools or companies.
   - No secrets, private notes or personal data.

These rules also apply to fixtures, comments and test names.

## Local files

- Private working notes go in `.docs/`. It is gitignored.
- `AGENTS.local.md` holds local rules. It is gitignored.

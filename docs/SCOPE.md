# Scope: the Sudo Hire docs site

Written 2026-11-03, against sudo-hire `main` at commit 0deb03d (M8 done, M9 not started).

This file says what the site is, what is decided, what is left out and what is still open. `docs/PLAN.md` says the order of the work. `AGENTS.md` has the rules for every change.

## What this is

The docs site of Sudo Hire, a macOS menu bar app. It lives at https://sudohire.dev.

The site tells a user how to get the app, how to set it up and what each screen does. It is not a marketing page. Sudo Hire is not released without it: the app links to its Privacy and Help pages, and the release links to it for the download.

## Decided

- **Domain:** `https://sudohire.dev`, with no hyphen. `.dev` is HSTS preloaded, so every link, canonical and `og:url` uses https.
- **Stack:** Astro, Node 22. No Astro integration: the sitemap is a plain endpoint.
- **Tests:** Vitest checks the built site in `dist/`. Playwright runs every page with axe, in light and dark, and at 320px width.
- **Test first:** commit the failing test, then the code. One commit per green cycle.
- **Design comes from the app:** the colors and type of `docs/DESIGN.md` in sudo-hire. The site uses the tokens of the app, not its layout. The owner leads the design phase, with Impeccable. No styles, copy or layout before that phase.
- **Fonts are self hosted.** No font from another site.
- **No request to another site before consent:** no font service, no iframe, no embed, no search widget.
- **Analytics:** Google Analytics 4 (GA4), loaded only after an explicit accept. See "The analytics rule" below.
- **Cloudflare Web Analytics stays off** for the zone. Its beacon would load before consent.
- **Footer:** links to albertoarena.it and sudoplay.dev, with `utm_source=sudohire.dev`, as on the placeholder. This is the one exception to "name no other site" in `AGENTS.md`. Decided by the owner on 2026-11-03.
- **Licenses:** the code under MIT (`LICENSE`). The text of the pages under CC BY 4.0 (`LICENSE-CONTENT`). The Sudo Hire name, tagline and art are not covered: see `TRADEMARK.md` of sudo-hire. Decided by the owner on 2026-11-03.
- **Link, do not copy:** the site links to `PRIVACY.md`, `TRADEMARK.md`, `SECURITY.md` and `CONTRIBUTING.md` of sudo-hire. It does not copy them.
- **The words of the app:** every page uses the names, labels and defaults of the app, as they are in the app. A setting is called what the settings window calls it.

### Released features only

The site documents what the released app does. Nothing more.

- Until the first release, the pages are written against `main` of sudo-hire.
- Each page records the sudo-hire version it was checked against. Before the site goes live, every page is checked against the release build, and records the release tag.
- Work that is not merged into sudo-hire is not documented. M9 (signing and release) is not merged yet.

### Pages

| Page | Path | What it has |
|---|---|---|
| Home | `/` | What Sudo Hire does in two or three sentences. A screenshot of the menu bar list. A "Download for Mac" button to the DMG of the GitHub release. |
| How it works | `/how-it-works/` | The scan every 5 minutes, the filters, the entry stamp, the summary notification, and the New, Saved and Applied tabs. |
| Install and first run | `/install/` | System requirements, the DMG, the first run (country, keywords, work mode, the first scan), the menu bar icon and its badge. |
| Settings | `/settings/` | One section for each settings pane, in the order of the app: Where you work, Jobs, Pay, Notifications, Sources, Companies, Privacy, Troubleshooting. |
| Sources | `/sources/` | Each job board and each career page provider, with its attribution ("via <source>") and how often the app reads it. Names only: no link to the source or its terms. Decided by the owner on 2026-11-04. |
| Privacy | `/privacy/` | This site: the consent gate and GA4. A short summary of the app, with a link to `PRIVACY.md`. |
| Help | `/help/` | The questions of the Troubleshooting pane, how to read the log, and how to report a problem (a GitHub issue on sudo-hire). |
| Not found | `/404.html` | A short page with a link home. |

Also: `robots.txt`, `sitemap.xml`, `llms.txt`, Open Graph tags and a link preview image. `llms.txt` lets AI tools read a short map of the site. `llms-full.txt` gives them the text of every page in one file.

`/privacy/` and `/help/` are fixed. The app opens these two addresses ("Read the privacy policy" in the Privacy pane, and the help link in Troubleshooting). The other paths are this plan's proposal.

## The analytics rule

**Nothing from Google enters a page before an explicit accept.**

- The measurement ID comes from `PUBLIC_GA_MEASUREMENT_ID` at build time. In CI it is a repository variable. It is never in the code.
- With no ID, the build has no banner, no settings button and no script.
- With an ID, a banner asks first. Accept and Decline look the same and weigh the same.
- Only Accept loads `gtag.js`, straight from Google. No Google Tag Manager.
- Consent Mode signals are set after the accept: analytics granted, every ad signal denied.
- The choice is stored in the browser (`localStorage`), not in a cookie of this site.
- A footer button withdraws the choice. It clears it and reloads the page, and the banner shows again.

### The app's promise is not a promise about this site

The app has no telemetry. The site has GA4 behind consent. These are two different things, and the Privacy page says so in plain words. The site's Privacy page describes the site. It summarises the app in a few lines and links to `PRIVACY.md` for the rest.

## Deployment

- Cloudflare Workers serves the site on sudohire.dev and www.sudohire.dev (`wrangler.jsonc`). It serves the files of `dist/` and nothing else. A missing page gets the 404 page.
- The Deploy workflow runs every check, builds the site with the measurement ID from the repository variable, and deploys it. Then it checks the live site.
- It runs only when the owner starts it by hand. A merge to `main` does not go live.
- So the site goes live at the release, when the owner runs the Deploy workflow. Until then, the placeholder of 2026-11-02 stays live.

## Left out

- **Marketing:** no feature tour, no pricing, no testimonials, no claim that the app is the only one of its kind.
- **Unreleased work:** M9, the Premium source, keyboard movement in the list and anything else not in a release.
- **The terminal use of the app:** `hire:scan`, launchd and cron are in the sudo-hire README for developers. The site documents the app.
- **The JSON API:** an internal API of the app, not a user feature.
- **Logos of job boards and providers:** names are text only, as in the app.
- **Search, a changelog, a blog, a demo, translations.**
- **Comments, forms, a newsletter, any account.**

## Open

1. **The screenshot on Home.** No screenshot exists yet. It must show real jobs, not invented companies or salaries (`PRODUCT.md`), and it must come from the release build. Who takes it, and with which data?
2. **The download link.** Decided on 2026-11-04: the button links to the latest GitHub release, so it never names a version. Version 1 needs macOS 12 Monterey or later and ships for Apple silicon (arm64) only.
3. **`TRADEMARK.md` in sudo-hire.** It covers "the design, layout and written copy of the site" on sudohire.dev. The page text is CC BY 4.0, so sudo-hire drops "written copy" from that line. This is a change in sudo-hire, not here.
4. **The link preview image.** Decided on 2026-11-05: a card for the docs site (`art/og-card.html`, rendered to `public/og.png`). It shows the tagline, the description of the home page, sudohire.dev and a sample job with its stamp.
5. **The type.** `DESIGN.md` uses the system font. The site may keep it, so no font file is needed, or pick a self hosted face. Decided in the design phase.
6. **The GA4 property.** The owner creates it later. The ID goes in the repository variable `PUBLIC_GA_MEASUREMENT_ID`.
7. **The host.** Decided on 2026-11-05: the site stays on Cloudflare Workers. No other host, no cron job.

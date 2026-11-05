# Product

<!-- impeccable:product-schema 1 -->

The product record of the docs site at https://sudohire.dev. `docs/SCOPE.md` stays the authority for scope. The app has its own record in `PRODUCT.md` of sudo-hire.

## Platform

web

## Users

Two groups, served equally:

- **People with a question.** They have the app already. They arrive from the app (its Privacy and Help links), from the GitHub README of sudo-hire or from a search. They want to understand a setting, a stamp or a source, or to fix a problem. Often the app is open beside the page.
- **New visitors.** They heard of Sudo Hire and come to download it and set it up.

Most are PHP and Laravel developers in Europe who want a remote job, or a better one. Many are employed and check casually. They read on a laptop or a phone.

Home serves the download. Every other page serves a question.

## Product Purpose

The site documents Sudo Hire, a macOS menu bar app. The app reads company career pages and public job boards. It keeps only the jobs that the user can take from where they live, and it sends one summary notification every few hours.

Success: a visitor finds the answer on the page they land on. A new visitor installs the app and sets it up. Every visitor trusts what the app and the site do with their data.

## Positioning

The site documents the released app in the app's own words. Every page uses the same screen names, labels, settings and defaults as the app. When the site and the app disagree, the app is right, and the site changes.

It is not a marketing site. It does not persuade.

## Operating Context

- Two pages open from inside the app: `/privacy/` ("Read the privacy policy" in the Privacy pane) and `/help/` (the Troubleshooting pane). A visitor on these pages has a question now.
- Visits are short and targeted. A visitor reads one section, then goes back to the app.
- The site goes live with the first release of the app. Until then, the pages are written against `main` of sudo-hire and checked again against the release build.

## Capabilities and Constraints

- **Pages:** Home `/`, How it works `/how-it-works/`, Install and first run `/install/`, Settings `/settings/`, Sources `/sources/`, Privacy `/privacy/`, Help `/help/`, and a 404 page. `/privacy/` and `/help/` are fixed: the app opens them.
- **Home:** what Sudo Hire does in two or three sentences, a screenshot of the menu bar list and a "Download for Mac" button.
- **Settings:** eight sections in the order of the app: Where you work, Jobs, Pay, Notifications, Sources, Companies, Privacy, Troubleshooting.
- **No request to another site before consent:** no font service, no iframe, no embed, no search widget. Fonts are self hosted, or the system font.
- **Analytics:** GA4 loads only after an explicit Accept. The consent banner and the footer "Analytics settings" button are part of every page when a measurement ID is set. With no ID, they are absent.
- **Footer:** links to albertoarena.it and sudoplay.dev, with `utm_source=sudohire.dev`.
- **Licenses:** the code under MIT, the page text under CC BY 4.0. The name, the tagline and the art are covered by `TRADEMARK.md` of sudo-hire.
- **Stack:** Astro on Node 22, a static build. Vitest tests the build, and Playwright with axe tests every page.
- **Undecided:** the download link and the system requirements (they come with the release), and the link preview image.

## Brand Commitments

- **Name:** Sudo Hire. The domain is `sudohire.dev`, in lowercase.
- **Tagline:** `$ sudo hire --remote-from here`, in mono. Another place can replace "here" (`--remote-from italy`). Country names in the tagline are lowercase.
- **Voice:** plain English and short sentences, easy for non-native speakers. No em dashes. No claim that the app is the only one of its kind.
- **Sources:** names in text only, never logos. Attribution reads "via <source>".
- **The entry stamp:** the signature of the app. It says if a job admits the user: green admits, red refuses, grey does not know.
- **The colors and type** of `docs/DESIGN.md` of sudo-hire.

## Evidence on Hand

- `docs/DESIGN.md` and `docs/design/sudo-hire-ui.html` of sudo-hire: the tokens and the approved app prototype.
- `resources/icons/menu-bar-mark.svg` of sudo-hire: the menu bar mark. The app icon does not exist yet.
- **Screenshots:** none yet. The owner takes them from the release build, in light and dark. Until then, a page shows a marked empty frame.
- **Job data:** real only. Never invent companies, jobs or salaries.
- No testimonials, no user numbers and no press. Do not invent them.

## Product Principles

1. **Answer on the page.** A visitor finds the answer on the page they land on.
2. **The words of the app.** A label on the site is the label in the app.
3. **Quiet and local, like the app.** Nothing loads from another site, and nothing tracks before an Accept.
4. **Released only.** No page describes work that is not released.

## Accessibility & Inclusion

- WCAG 2.2 AA. axe passes on every page, in light and dark.
- Every page works at 320px width with no sideways scroll.
- Every focus stop shows a visible focus ring.
- The site follows `prefers-color-scheme` and `prefers-reduced-motion`.
- Plain English for readers whose first language is not English.

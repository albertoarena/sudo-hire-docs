---
name: Sudo Hire docs
description: The docs site of Sudo Hire at sudohire.dev, set in the colors and type of the app.
colors:
  burgundy: "#5E1B2B"
  burgundy-ink: "#F4E8EA"
  page: "#F7F5F2"
  panel: "#FFFFFF"
  sunk: "#EEEBE6"
  ink: "#1E2230"
  ink-2: "#4F5361"
  ink-3: "#62666F"
  rule: "#DCD7D0"
  ok: "#2B6648"
  no: "#A63F2A"
  unk: "#5F636C"
  warn-bg: "#FBEEE9"
  focus: "#8A2E44"
  burgundy-dark: "#6A2133"
  burgundy-ink-dark: "#F6E9EC"
  page-dark: "#1D1B1F"
  panel-dark: "#29262B"
  sunk-dark: "#242126"
  ink-dark: "#ECE8EA"
  ink-2-dark: "#B7B1B6"
  ink-3-dark: "#A49EA4"
  rule-dark: "#3A363C"
  ok-dark: "#7CC29E"
  no-dark: "#EE8B74"
  unk-dark: "#A9A4AA"
  warn-bg-dark: "#3A2522"
  focus-dark: "#E59AAE"
typography:
  h1:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "clamp(34px, 2rem + 1.4vw, 46px)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  h3:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 600
    lineHeight: 1.3
  answer:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"tnum\""
  name:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    letterSpacing: "0.01em"
  nav:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "15px"
    fontWeight: 400
  tagline:
    fontFamily: "ui-monospace, \"SF Mono\", Menlo, Consolas, monospace"
    fontSize: "15px"
    fontWeight: 400
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  small:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Helvetica Neue\", Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
rounded:
  xs: "4px"
  md: "6px"
  lg: "8px"
  frame: "10px"
  full: "9999px"
spacing:
  gutter: "40px"
  gutter-narrow: "16px"
  column-gap: "72px"
  paragraph: "16px"
  h3-top: "32px"
  h2-top: "48px"
  main-top: "56px"
  main-bottom: "88px"
components:
  strip:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.burgundy-ink}"
    typography: "{typography.nav}"
    height: "60px"
    padding: "0 40px"
  page-row:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-2}"
    typography: "{typography.nav}"
    height: "48px"
    padding: "0 40px"
  checked-note:
    textColor: "{colors.ink-3}"
    typography: "{typography.small}"
    padding: "8px 0"
  button-primary:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.burgundy-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.burgundy}"
    textColor: "{colors.burgundy-ink}"
    filter: "brightness(1.12)"
  shot-frame:
    backgroundColor: "{colors.sunk}"
    textColor: "{colors.ink-3}"
    typography: "{typography.caption}"
    rounded: "{rounded.frame}"
    padding: "24px"
    width: "300px"
  contents:
    textColor: "{colors.ink-2}"
    typography: "{typography.nav}"
    padding: "14px 0"
    width: "220px"
  skip-link:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  footer:
    textColor: "{colors.ink-2}"
    typography: "{typography.nav}"
    padding: "14px 40px 26px"
---

# Design System: Sudo Hire docs

This file records the site as built. The site inherits the design record of the app: `docs/DESIGN.md` in sudo-hire. The tokens, the Three Inks Rule, the Cover Rule, the Capitals Rule, the stamp and the system font come from there. When the two files disagree on a token, the app file is right. This file adds only what the site needs at page scale.

## Overview

**Creative North Star: "The Visa Page, indexed by question"**

The app is a visa page: a warm sheet, ink text, hairline rules and a burgundy cover strip. The site keeps that world and prints it at page scale. The cover strip holds four question groups. A reader picks the kind of question, opens a page and reads the answer first.

Every page has the same order. The title is the question. One answer paragraph follows, in a larger size, and ends on a hairline. Question headings then lead to the detail. The site does not use a left tree, a search box or a grey side column. It is not a product landing page.

The site is flat and quiet. Depth comes from tone (page, panel, sunk) and from 0.5px hairlines. There are no shadows, no cards and no logos.

**Key Characteristics:**
- The burgundy strip with its guilloche is the cover of every page.
- The title of a page is a question, and the answer comes first.
- One primary button per view, in burgundy.
- The system font of the Mac, as in the app. No web font.
- Light and dark follow the system, until the reader chooses one with the theme toggle. Every token has a dark value.

## Colors

The palette is the palette of the app, with the same names and the same values. `src/styles/tokens.css` defines each token on `:root`. It defines the same names again for dark mode, under `@media (prefers-color-scheme: dark)` for `:root:not([data-theme="light"])`, and once more for `:root[data-theme="dark"]`, the choice of the reader. The `-dark` keys in the frontmatter are those dark values. A unit test checks that every token exists in both modes and that the text pairs reach 4.5:1.

### Primary
- **Passport Burgundy** (`burgundy`): the strip and the one primary button. Text selection uses it at 30% over the page.
- **Cover Ink** (`burgundy-ink`): text, underlines and focus rings on the strip. Text on the primary button.
- **Focus Rose** (`focus`): the focus ring on the page.

### Stamp inks (semantic)
- **Admitted Green** (`ok`), **Refused Red** (`no`) and **Unknown Grey** (`unk`): the inks of the entry stamp, on How it works.

### Neutral
- **Visa Page** (`page`): the ground of every page.
- **Panel White** (`panel`): the page row under the strip, notes, and the skip link.
- **Sunk Paper** (`sunk`): the empty screenshot frame, and code.
- **Ink** (`ink`): headings, body text, links and the answer.
- **Ink 2** (`ink-2`): the links in the page row and in the contents, the bold part of the tagline, and the footer.
- **Ink 3** (`ink-3`): the checked-against note and its dot, the tagline, captions, the contents title, and link underlines at rest.
- **Rule** (`rule`): every hairline, and the scrollbar.
- **Warning Wash** (`warn-bg`): the ground of a warning.

**The Three Inks Rule.** Green, red and grey mean admitted, refused and unknown. Use them only for eligibility and source health. Never use them for decoration.

**The Cover Rule.** Burgundy fills surfaces: the strip and the primary button. It is never a text color. Links and headings are `ink`.

**The Hairline Rule.** Every rule on the site is a 0.5px hairline in `rule`. No rule has a color. The answer ends on this hairline. No block has a colored side stripe.

## Typography

**Font:** the macOS system font (`-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif`).
**Mono:** `ui-monospace, "SF Mono", Menlo, Consolas, monospace`, for the tagline.

**Character:** native and plain, like the app, at a reading size. Tabular figures are on for the whole page (`font-variant-numeric: tabular-nums`).

### Hierarchy
- **h1** (700, 34px to 46px with the width, line height 1.1, tracking -0.02em): the title of the page, written as a question. It stays under 22ch and balances its lines.
- **Answer** (400, 21px, line height 1.5, `ink`): the answer paragraph under the title. It drops to 19px under 700px.
- **h2** (650, 24px, line height 1.25, tracking -0.01em): a question heading. It has 48px above it and 12px below.
- **h3** (600, 19px, line height 1.3): a heading inside a question. It has 32px above it and 8px below.
- **Body** (400, 17px, line height 1.6): all running text. Paragraphs have 16px below them and use pretty wrapping.
- **Name** (600, 16px, tracking 0.01em): "Sudo Hire" on the strip.
- **Nav** (400, 15px): the question groups, the page row, the contents and the footer.
- **Tagline** (mono, 15px, `ink-3`): `$ sudo hire --remote-from here` under the title on Home. The flag part is 600 in `ink-2`.
- **Caption** (400, 14px, `ink-3`): the screenshot caption and the text of the empty frame.
- **Small** (400, 13px, `ink-3`): the checked-against note and the contents title. No text on the site is smaller.

The reading column is 68ch wide at most.

**The Capitals Rule.** Uppercase tracked type belongs to the stamp only. Headings, buttons, labels and navigation use sentence case.

**The No Kicker Rule.** A heading has no small label above it. The title is the question, and nothing introduces it.

**The Pinned Font Rule.** The font stack is the stack of the app, in the `--font` and `--mono` tokens. The site loads no web font and no font from another site. A build test checks this.

## Layout

The content sits in a wrap of at most 1200px, with a 40px gutter on each side. Under 700px the gutter is 16px.

The page is a grid. A normal page has one column of at most 68ch. A page with contents adds a 220px column on the right from 1100px, with a 72px gap. Home has two columns: the text, then a 300px screenshot column, with a 96px gap. Under 860px Home becomes one column.

The main area has 56px above and 88px below. Under 700px it has 36px above and 64px below.

The order of the shell from top to bottom:

1. **The strip** (burgundy, at least 60px tall): the mark and "Sudo Hire" on the left, the four question groups and the theme toggle on the right. Under 700px the name and the toggle share the first line, and the groups form a grid of two columns below.
2. **The page row** (panel white, at least 48px tall, a hairline below): the pages of the open group, then the checked-against note on the right. It wraps on narrow screens. The 404 page has no page row.
3. **Main**: the page.
4. **The footer**: a hairline above it, two links.

From 700px the strip and the page row stay at the top of the window while the page scrolls. Under 700px they scroll away, because they are too tall to keep.

The body is a flex column at least as tall as the window, so the footer stays at the bottom.

Every page works at 320px with no sideways scroll.

## Elevation & Depth

The site is flat. It has no shadows. Depth comes from three tones and from hairlines. The strip is the darkest surface. The page row sits on `panel`, one step lighter than the page. The empty screenshot frame sits on `sunk`, one step darker.

**The Paper Rule.** Surfaces are flat paper. To set something apart, change its tone or add a hairline. Do not add a shadow.

## Shapes

Small, soft corners, like the controls of the app. 4px for the focus ring. 6px for the skip link. 8px for the primary button, the theme toggle and the consent buttons. 10px for the screenshot frame. The dot of the checked-against note is a 7px circle.

Lines are 0.5px hairlines in `rule`. The one exception is the empty screenshot frame. It has a 1px dashed border in `ink-3`, because it marks a place to fill.

## Components

### The strip (the cover)

Burgundy, with the guilloche of the app as an inline SVG background. The guilloche is two sets of thin white sine waves (0.55px stroke at 10% and 7% opacity) on a 96 by 42px tile. The strip holds the name and the four question groups: Get started, Understand a screen, Fix a problem, Your data. A group link opens the first page of the group.

- **Group links:** 15px `burgundy-ink`, no underline at rest. The underline is 2px, 8px below the text.
- **Hover:** the underline shows at 50%.
- **Current group:** weight 600 and the full underline.
- **Focus:** the ring is `burgundy-ink`, not `focus`, so it shows on burgundy.
- **The mark:** the menu bar mark of the app, 20px, in `burgundy-ink`, 9px before the name.
- **The theme toggle:** a 32px button with a hairline border in `burgundy-ink` at 35%. A click moves to the next mode: light, dark, then system. The icon shows the current mode: a sun, a moon or a screen. Its name says the mode, for example "Theme: system". The browser stores light and dark. System removes the choice, and the page follows the system again. The button shows only when its script runs.

### The page row

Panel white, a hairline below. It lists the pages of the open group in 15px `ink-2`, with no underline. Hover turns a link `ink`. The current page is `ink` and weight 600.

The **checked-against note** sits at the right end of the row. It is 13px `ink-3`, after a 7px dot in `ink-3`. It tells the reader which version of the app the page was checked against. Every page with a page row shows it.

### The answer

The answer block follows the title, 20px below it. It holds one paragraph at the answer size. It ends with 24px of space and a 0.5px hairline in `rule`. On Home it also holds the Download button.

### Download button (primary)

The one primary action of a view. Burgundy fill, `burgundy-ink` text, 17px weight 600, padding 12px 20px, radius 8px. A 16px download icon sits before the label, with a 10px gap. Hover lightens the button with `brightness(1.12)`, as in the app. The label is "Download for Mac".

### Screenshot frame

A figure for a screenshot of the app, with a caption below in 14px `ink-3`. Home shows a screenshot of the menu bar list in v1.0.0, with real jobs. It has one screenshot for each theme, and the site shows the one of the theme in use. Each is the popover alone, with no window shadow, 300px wide at most, with a 0.5px `rule` border and radius 10px. A figure with no screenshot yet shows an empty frame. The frame is on `sunk`, 300px wide at most, in the 400 by 640 ratio of the popover. It has a 1px dashed `ink-3` border, radius 10px, and centered 14px `ink-3` text that says where the screenshot will come from.

### On this page

The list of the sections of a page. Under 1100px it sits above the text, between two hairlines, in two columns. From 1100px it moves to the right column. There it has one column, a hairline above only, and sticks 24px from the top. The title "On this page" is 13px `ink-3`. The links are 15px `ink-2`, with no underline at rest, and each one has the exact text of its heading. Hover turns a link `ink` and underlines it. The section in view is `ink` and weight 600, with `aria-current="location"`. It is the last heading above the top of the reading area, or the last one at the end of the page.

### Links

Links in text are `ink` with a 1px underline in `ink-3`, 0.22em below the text. Hover makes the underline 2px and `ink`.

### External link icon

The external link icon of the app: 16 by 16 view box, stroke 1.4, round caps and joins, no fill, `currentColor`. It shows at 12px after the label, with a 6px gap. A link with the icon opens a new tab and tells screen readers so in hidden text.

### Favicon

The app icon of sudo-hire (`resources/icons/app-icon.svg`), in two versions:

- `favicon.svg` is redrawn to read at 16px. It crops to the rounded square, drops the guilloche waves, and makes the stamp and the check larger and heavier.
- `apple-touch-icon.png` is a 180px PNG from `art/apple-touch-icon.svg`. It fills the whole square with no transparent pixel, because iOS rounds the corners and fills transparency with black.

The icon is the project's art under `TRADEMARK.md` of sudo-hire, not under the MIT license of the code.

### Footer

A hairline above, 15px `ink-2`. "Made by Alberto Arena" links to albertoarena.it. A second link goes to sudoplay.dev. Both carry the external link icon.

### Skip link

"Skip to the content" is the first focus stop. It stays out of view until it has the focus. Then it shows at the top left, on `panel`, in `ink`, with padding 8px 14px and radius 6px. It moves the focus to main.

### Focus and selection

- **Focus:** every focus stop shows `outline: 2px solid var(--focus)`, with a 2px offset and 4px radius, on `:focus-visible` only. On the strip the ring is `burgundy-ink`. Main takes the focus from the skip link but shows no ring.
- **Selection:** burgundy at 30% (`color-mix(in srgb, var(--burgundy) 30%, transparent)`).

### Motion

The site has no animation.

### Scripts

The site ships no `.js` file and loads no script from another site. Two short inline scripts do the work: one in the head sets the chosen theme before the first paint, and one at the end of the body runs the theme toggle and marks the section in view. Without them, the site follows the system theme, and the contents are plain links.

A build with a measurement ID adds a third inline script: the consent banner. It loads Google Analytics only after Accept. Without it, the banner never shows and nothing loads. With `prefers-reduced-motion: reduce`, all transitions and animations are off.

### Settings list

Each pane of the app is an h2 with the pane name, then the pane intro of the app as a paragraph. A definition list follows. Each row has the label of the app on the left, in weight 600, in a 12rem column. On the right: what it does, then the default in 15px `ink-2`. Rows sit between 0.5px hairlines. Under 700px the label sits above the text.

### Steps

A numbered list with the numbers in a 2.4rem margin column, weight 650 in `ink-3`. Each step sits between hairlines. A step can have an h3 at body size, for the heading of a screen of the app.

### Tables

The sources and the source errors. 15px text, a header row in `ink-2` weight 600, and a hairline under each row. The table sits in a box that scrolls sideways, so the page never does.

### Notes and warnings

A note sets text apart by tone: `panel`, a hairline border and radius 8px. A warning uses `warn-bg`. Neither has a colored stripe. A note also holds the text of a notification of the app.

### Code

Inline code is mono at 0.88em, on `sunk`, with radius 4px. A code block is mono 14px on `sunk`, radius 8px, and scrolls sideways. A code block that scrolls takes the focus, so a keyboard can scroll it.

### The stamp

The entry stamp of the app, drawn in HTML: two lines in tracked capitals, the place (15px, 700) above the verdict (13px, 600). A 1.5px border in the ink, radius 4px, turned -1.5 degrees. Green (`ok`) admits, red (`no`) refuses, grey (`unk`) with a dashed border does not know. The sizes are larger than in the app, because no text on the site is under 13px. It has `role="img"` and a label, for example "Stamp: IT, Admitted". Only How it works uses it, to explain eligibility.

### External links in text

A link to another site opens a new tab. It carries the external link icon after the label and the hidden text "(opens in a new tab)". The Download button carries the icon too.

### The consent banner

It shows only in a build with a GA4 measurement ID, and only until the reader chooses. It is fixed to the bottom of the window, on `panel`, with a 0.5px hairline in `rule` above it and no shadow. The text column is as wide as the page text.

- **Title:** "Can this site count your visit?" in 17px weight 600. The banner is a region with this name.
- **Text:** 15px `ink-2`. It says that nothing loads from Google before a choice, what Accept does, and that there is no advertising. It links to the privacy page.
- **Buttons:** "Decline", then "Accept". They have the same size and the same look: no fill, a 1px border in `ink-2`, `ink` text at 15px weight 600, radius 8px, at least 44px high, in two equal columns. Neither one is the primary button. Hover underlines the label.
- **Space:** while the banner shows, the footer grows by the height of the banner, so the banner covers nothing at the end of a page.

### Analytics settings

In a build with a measurement ID, the footer has an "Analytics settings" button. It looks like the footer links. It clears the choice and reloads the page, so the banner asks again and nothing from Google stays on the page.

## Do's and Don'ts

### Do:
- **Do** use the tokens of the app with the same names, and give every token a dark value.
- **Do** write the title of a page as a question, and put the answer paragraph first.
- **Do** end the answer on a 0.5px hairline in `rule`.
- **Do** show the checked-against note on every page with a page row.
- **Do** mark the current group and the current page in every view.
- **Do** keep text at 13px or larger.

### Don't:
- **Don't** use the stamp for anything but eligibility. It does not decorate a page.
- **Don't** use a colored rule or a colored side stripe. Every rule is a hairline in `rule`.
- **Don't** put a small label or kicker above a heading.
- **Don't** show logos. A source is named in text only.
- **Don't** load a web font or a font from another site. The font is the system font of the app.
- **Don't** use more than one primary button in a view.
- **Don't** use uppercase tracked type outside the stamp.
- **Don't** add shadows or cards.

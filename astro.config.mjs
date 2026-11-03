// @ts-check
import { defineConfig } from 'astro/config';

// .dev is HSTS preloaded, so the site is https only.
export default defineConfig({
  site: 'https://sudohire.dev',
  // `npm run build:consent` sets this to dist-consent/: a second build with a
  // test measurement ID, for the consent tests. Astro's preview has no flag for it.
  outDir: process.env.SITE_OUT_DIR || './dist',
});

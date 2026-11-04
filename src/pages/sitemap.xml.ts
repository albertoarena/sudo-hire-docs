import type { APIRoute } from 'astro';
import { pages } from '../data/nav';

// Every page of the navigation. The 404 page is not in it.
export const GET: APIRoute = ({ site }) => {
  const urls = pages.map((page) => `  <url><loc>${new URL(page.href, site)}</loc></url>`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

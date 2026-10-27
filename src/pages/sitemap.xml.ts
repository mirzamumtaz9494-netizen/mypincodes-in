import type { APIRoute } from 'astro';
import { getAllStates, getAllDistricts } from '../utils/postalData';

export const prerender = true;

export const GET: APIRoute = async () => {
  const baseUrl = 'https://mypincodes.in';
  const states = getAllStates();
  const districts = getAllDistricts();

  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/speed-post-calculator', priority: '0.9', changefreq: 'monthly' },
    { url: '/speed-post-rates-chart', priority: '0.9', changefreq: 'monthly' },
    { url: '/address-formatter', priority: '0.9', changefreq: 'monthly' },
    { url: '/distance-calculator', priority: '0.9', changefreq: 'monthly' },
    { url: '/states', priority: '0.8', changefreq: 'monthly' },
    { url: '/about', priority: '0.4', changefreq: 'yearly' },
    { url: '/contact', priority: '0.4', changefreq: 'yearly' },
    { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
    { url: '/terms', priority: '0.3', changefreq: 'yearly' },
    { url: '/disclaimer', priority: '0.3', changefreq: 'yearly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Pages
  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // State Pages (36)
  for (const st of states) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/state/${st.slug}</loc>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  // District Pages (737)
  for (const d of districts) {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/district/${d.stateSlug}/${d.slug}</loc>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  });
};

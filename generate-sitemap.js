const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const BASE_URL = 'https://planodeaulapronto.github.io';
const today = new Date().toISOString().split('T')[0];

// Discipline pages
const disciplineDir = path.join(__dirname, 'discipline-pages');
const disciplinePages = fs.existsSync(disciplineDir)
  ? fs.readdirSync(disciplineDir).filter(f => f.endsWith('.html'))
  : [];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

// Discipline pages (priority 0.9)
disciplinePages.forEach(file => {
  xml += `
  <url>
    <loc>${BASE_URL}/discipline-pages/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
});

// Individual product pages (priority 0.8)
products.forEach(p => {
  xml += `
  <url>
    <loc>${BASE_URL}/produtos/${p.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Articles (priority 0.7)
const artigosDir = path.join(__dirname, 'artigos');
const artigosPages = fs.existsSync(artigosDir)
  ? fs.readdirSync(artigosDir).filter(f => f.endsWith('.html'))
  : [];

artigosPages.forEach(file => {
  xml += `
  <url>
    <loc>${BASE_URL}/artigos/${file}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

xml += `\n</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), xml);
console.log(`sitemap.xml created: 1 home + ${disciplinePages.length} discipline + ${products.length} products + ${artigosPages.length} articles = ${1 + disciplinePages.length + products.length + artigosPages.length} URLs`);

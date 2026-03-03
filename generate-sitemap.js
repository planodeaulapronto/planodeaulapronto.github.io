const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const BASE_URL = 'https://planodeaulapronto.github.io';
const today = new Date().toISOString().split('T')[0];

// ── Helper ───────────────────────────────────────────────────────────────────
// Força LF (\n) em vez de CRLF (\r\n) para compatibilidade com crawlers
function urlBlock(loc, freq, priority) {
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    `    <lastmod>${today}</lastmod>`,
    `    <changefreq>${freq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    '  </url>'
  ].join('\n');
}

function wrapUrlset(blocks) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    blocks.join('\n'),
    '</urlset>'
  ].join('\n');
}

function writeUtf8(filePath, content) {
  // Remove qualquer \r para garantir LF puro
  const clean = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  fs.writeFileSync(filePath, clean, { encoding: 'utf8' });
}

// ── 1. sitemap-produtos.xml  (home + discipline-pages + products) ─────────────
const disciplineDir = path.join(__dirname, 'discipline-pages');
const disciplinePages = fs.existsSync(disciplineDir)
  ? fs.readdirSync(disciplineDir).filter(f => f.endsWith('.html'))
  : [];

const prodBlocks = [
  urlBlock(`${BASE_URL}/`, 'weekly', '1.0'),
  ...disciplinePages.map(f => urlBlock(`${BASE_URL}/discipline-pages/${f}`, 'weekly', '0.9')),
  ...products.map(p => urlBlock(`${BASE_URL}/produto/${p.slug}.html`, 'weekly', '0.8')),
];
writeUtf8(path.join(__dirname, 'sitemap-produtos.xml'), wrapUrlset(prodBlocks));
console.log(`sitemap-produtos.xml: ${prodBlocks.length} URLs`);

// ── 2. sitemap-artigos.xml  (articles) ───────────────────────────────────────
const artigosDir = path.join(__dirname, 'artigos');
const artigosPages = fs.existsSync(artigosDir)
  ? fs.readdirSync(artigosDir).filter(f => f.endsWith('.html') && f !== 'index.html')
  : [];

const artBlocks = [
  urlBlock(`${BASE_URL}/artigos/index.html`, 'weekly', '0.8'),
  ...artigosPages.map(f => urlBlock(`${BASE_URL}/artigos/${f}`, 'monthly', '0.7')),
];
writeUtf8(path.join(__dirname, 'sitemap-artigos.xml'), wrapUrlset(artBlocks));
console.log(`sitemap-artigos.xml: ${artBlocks.length} URLs`);

// ── 3. sitemap.xml  (sitemap index — links para os outros dois) ───────────────
const sitemapIndex = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  '  <sitemap>',
  `    <loc>${BASE_URL}/sitemap-produtos.xml</loc>`,
  `    <lastmod>${today}</lastmod>`,
  '  </sitemap>',
  '  <sitemap>',
  `    <loc>${BASE_URL}/sitemap-artigos.xml</loc>`,
  `    <lastmod>${today}</lastmod>`,
  '  </sitemap>',
  '</sitemapindex>'
].join('\n');

writeUtf8(path.join(__dirname, 'sitemap.xml'), sitemapIndex);
console.log(`sitemap.xml (index): referencia 2 sitemaps`);
console.log(`Total geral: ${prodBlocks.length + artBlocks.length} URLs`);

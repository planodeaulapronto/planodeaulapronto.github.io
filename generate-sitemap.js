const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const BASE_URL = 'https://planodeaulapronto.github.io';
const today = new Date().toISOString().split('T')[0];

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
    '</urlset>',
    ''
  ].join('\n');
}

function wrapSitemapIndex(entries) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map(e => [
      '  <sitemap>',
      `    <loc>${e.loc}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      '  </sitemap>'
    ].join('\n')),
    '</sitemapindex>',
    ''
  ].join('\n');
}

function writeUtf8(filePath, content) {
  const clean = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  fs.writeFileSync(filePath, clean, { encoding: 'utf8' });
}

// Gather pages
const disciplineDir = path.join(__dirname, 'discipline-pages');
const disciplinePages = fs.existsSync(disciplineDir)
  ? fs.readdirSync(disciplineDir).filter(f => f.endsWith('.html'))
  : [];

const artigosDir = path.join(__dirname, 'artigos');
const artigosPages = fs.existsSync(artigosDir)
  ? fs.readdirSync(artigosDir).filter(f => f.endsWith('.html') && f !== 'index.html')
  : [];

// 1) sitemap-pages.xml  (homepage + discipline pages)
const pagesBlocks = [
  urlBlock(`${BASE_URL}/`, 'weekly', '1.0'),
  ...disciplinePages.map(f => urlBlock(`${BASE_URL}/discipline-pages/${f}`, 'weekly', '0.9')),
];

// 2) sitemap-produtos.xml  (product pages)
const produtosBlocks = [
  ...products.map(p => urlBlock(`${BASE_URL}/produto/${p.slug}.html`, 'weekly', '0.8')),
];

// 3) sitemap-artigos.xml  (articles)
const artigosBlocks = [
  urlBlock(`${BASE_URL}/artigos/index.html`, 'weekly', '0.8'),
  ...artigosPages.map(f => urlBlock(`${BASE_URL}/artigos/${f}`, 'monthly', '0.7')),
];

// Write sub-sitemaps
writeUtf8(path.join(__dirname, 'sitemap-pages.xml'), wrapUrlset(pagesBlocks));
writeUtf8(path.join(__dirname, 'sitemap-produtos.xml'), wrapUrlset(produtosBlocks));
writeUtf8(path.join(__dirname, 'sitemap-artigos.xml'), wrapUrlset(artigosBlocks));

// Write sitemap index
writeUtf8(path.join(__dirname, 'sitemap.xml'), wrapSitemapIndex([
  { loc: `${BASE_URL}/sitemap-pages.xml` },
  { loc: `${BASE_URL}/sitemap-produtos.xml` },
  { loc: `${BASE_URL}/sitemap-artigos.xml` },
]));

const total = pagesBlocks.length + produtosBlocks.length + artigosBlocks.length;
console.log(`Sitemap index generated with 3 sub-sitemaps (${total} URLs total):`);
console.log(`  sitemap-pages.xml:    ${pagesBlocks.length} URLs`);
console.log(`  sitemap-produtos.xml: ${produtosBlocks.length} URLs`);
console.log(`  sitemap-artigos.xml:  ${artigosBlocks.length} URLs`);

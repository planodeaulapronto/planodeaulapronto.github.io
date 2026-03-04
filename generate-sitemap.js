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

// Gather ALL blocks for a single flat sitemap
const allBlocks = [
  urlBlock(`${BASE_URL}/`, 'weekly', '1.0'),
  ...disciplinePages.map(f => urlBlock(`${BASE_URL}/discipline-pages/${f}`, 'weekly', '0.9')),
  ...products.map(p => urlBlock(`${BASE_URL}/produto/${p.slug}.html`, 'weekly', '0.8')),
  urlBlock(`${BASE_URL}/artigos/index.html`, 'weekly', '0.8'),
  ...artigosPages.map(f => urlBlock(`${BASE_URL}/artigos/${f}`, 'monthly', '0.7')),
];

// Write ONLY the single flat sitemap.xml
writeUtf8(path.join(__dirname, 'sitemap.xml'), wrapUrlset(allBlocks));

// Also write robots.txt to point to this single sitemap
const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  `Sitemap: ${BASE_URL}/sitemap.xml`,
  '',
  '# Materiais Pedagogicos BNCC 2026',
  '# Plano de Aula, Atividades, Avaliacoes e Slides'
].join('\n');
writeUtf8(path.join(__dirname, 'robots.txt'), robots);

console.log(`Successfully generated a single flat sitemap.xml with ${allBlocks.length} URLs.`);
console.log('Updated robots.txt to point only to sitemap.xml.');

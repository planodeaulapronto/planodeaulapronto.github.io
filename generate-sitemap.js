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
    '</urlset>'
  ].join('\n');
}

function writeUtf8(filePath, content) {
  const clean = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  fs.writeFileSync(filePath, clean, { encoding: 'utf8' });
}

// Gather all pages for a single flat sitemap
const disciplineDir = path.join(__dirname, 'discipline-pages');
const disciplinePages = fs.existsSync(disciplineDir)
  ? fs.readdirSync(disciplineDir).filter(f => f.endsWith('.html'))
  : [];

const artigosDir = path.join(__dirname, 'artigos');
const artigosPages = fs.existsSync(artigosDir)
  ? fs.readdirSync(artigosDir).filter(f => f.endsWith('.html') && f !== 'index.html')
  : [];

const allBlocks = [
  urlBlock(`${BASE_URL}/`, 'weekly', '1.0'),
  ...disciplinePages.map(f => urlBlock(`${BASE_URL}/discipline-pages/${f}`, 'weekly', '0.9')),
  ...products.map(p => urlBlock(`${BASE_URL}/produto/${p.slug}.html`, 'weekly', '0.8')),
  urlBlock(`${BASE_URL}/artigos/index.html`, 'weekly', '0.8'),
  ...artigosPages.map(f => urlBlock(`${BASE_URL}/artigos/${f}`, 'monthly', '0.7')),
];

// Write the single flat sitemap.xml
writeUtf8(path.join(__dirname, 'sitemap.xml'), wrapUrlset(allBlocks));

// Also keep the individual ones just in case, but sitemap.xml is now the primary flat one
writeUtf8(path.join(__dirname, 'sitemap-produtos.xml'), wrapUrlset(allBlocks.filter(b => b.includes('/produto/') || b.includes('/discipline-pages/') || b.includes('io/ <'))));
writeUtf8(path.join(__dirname, 'sitemap-artigos.xml'), wrapUrlset(allBlocks.filter(b => b.includes('/artigos/'))));

console.log(`Updated sitemap.xml with ${allBlocks.length} URLs (consolidated).`);

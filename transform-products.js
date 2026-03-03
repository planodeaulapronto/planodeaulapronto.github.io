const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

function cleanText(text) {
    if (!text) return '';
    // If the text contains literal HTML tags being shown as text, we might want to keep them for the generator to render, 
    // BUT the user said "limpeza de tags html neles" (cleaning html tags in them).
    // Usually this means removing them from titles.
    return text.replace(/<[^>]*>?/gm, '').trim();
}

function rewriteSlug(oldSlug) {
    let slug = oldSlug.toLowerCase();

    // Remove year and bncc
    slug = slug.replace(/-bncc-\d{4}/g, '');
    slug = slug.replace(/-bncc/g, '');
    slug = slug.replace(/-\d{4}/g, '');

    // Replace "planejamentos" and "atividades" with "plano-de-aula"
    slug = slug.replace(/planejamentos?-e-atividades-/g, 'plano-de-aula-');
    slug = slug.replace(/planejamentos?-atividades-/g, 'plano-de-aula-');
    slug = slug.replace(/planos?-diarios?-/g, 'plano-de-aula-');
    slug = slug.replace(/planos?-de-aula-diarios?-/g, 'plano-de-aula-');
    slug = slug.replace(/planejamentos?-/g, 'plano-de-aula-');
    slug = slug.replace(/atividades-/g, 'plano-de-aula-');

    // Fix specific levels
    slug = slug.replace(/6o?-ao-9o?-ano-ensino-fundamental-2/g, 'fundamental-2');
    slug = slug.replace(/6o?-ao-9o?-ano-ensino-fundamental/g, 'fundamental-2');
    slug = slug.replace(/6o?-ao-9o?-ano/g, 'fundamental-2');
    slug = slug.replace(/6-ao-9-ano-ensino-fundamental-2/g, 'fundamental-2');
    slug = slug.replace(/6-ao-9-ano-ensino-fundamental/g, 'fundamental-2');
    slug = slug.replace(/6-ao-9-ano/g, 'fundamental-2');

    slug = slug.replace(/1o?-ao-5o?-ano-ensino-fundamental-1/g, 'fundamental-1');
    slug = slug.replace(/1o?-ao-5o?-ano-ensino-fundamental/g, 'fundamental-1');
    slug = slug.replace(/1o?-ao-5o?-ano/g, 'fundamental-1');
    slug = slug.replace(/1-ao-5-ano-ensino-fundamental/g, 'fundamental-1');
    slug = slug.replace(/1-ao-5-ano/g, 'fundamental-1');

    // General cleanup
    slug = slug.replace(/ensino-fundamental-2/g, 'fundamental-2');
    slug = slug.replace(/ensino-fundamental-1/g, 'fundamental-1');
    slug = slug.replace(/ensino-fundamental/g, 'fundamental');

    if (slug.includes('combo-') && !slug.includes('plano-de-aula')) {
        slug = slug.replace(/combo-/, 'combo-plano-de-aula-');
    }

    // Clean multiple dashes
    slug = slug.replace(/-+/g, '-').replace(/-$/, '').replace(/^-/, '');

    return slug;
}

const updatedProducts = products.map(p => {
    return {
        ...p,
        title: cleanText(p.title),
        slug: rewriteSlug(p.slug)
    };
});

fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2), 'utf8');
console.log(`Updated ${updatedProducts.length} products in products.json`);

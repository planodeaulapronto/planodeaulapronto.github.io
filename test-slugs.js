const fs = require('fs');

const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));

function rewriteSlug(oldSlug) {
    let slug = oldSlug.toLowerCase();

    // Remove year and bncc
    slug = slug.replace(/-bncc-\d{4}/g, '');
    slug = slug.replace(/-bncc/g, '');
    slug = slug.replace(/-\d{4}/g, ''); // like -2026, -2025

    // Replace "planejamentos" and "atividades" with "plano-de-aula"
    // "planejamentos-atividades-geografia-6-ao-9-ano-ensino-fundamental-2" -> "plano-de-aula-geografia-fundamental-2"
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

    slug = slug.replace(/ensino-medio/g, 'ensino-medio');
    slug = slug.replace(/novo-ensino-medio/g, 'ensino-medio');

    // Some general cleanup
    slug = slug.replace(/ensino-fundamental-2/g, 'fundamental-2');
    slug = slug.replace(/ensino-fundamental-1/g, 'fundamental-1');
    slug = slug.replace(/ensino-fundamental/g, 'fundamental');

    // If it doesn't start with plano-de-aula but the user wants it... wait, what about "apostila-..." or "combo-..."
    if (slug.includes('combo-') && !slug.includes('plano-de-aula')) {
        slug = slug.replace(/combo-/, 'combo-plano-de-aula-');
    }

    // Clean multiple dashes
    slug = slug.replace(/-+/g, '-').replace(/-$/, '').replace(/^-/, '');

    return slug;
}

const table = products.map(p => {
    return {
        old: p.slug,
        new: rewriteSlug(p.slug)
    };
});

console.table(table.slice(0, 30));
fs.writeFileSync('slug-test-results.json', JSON.stringify(table, null, 2));

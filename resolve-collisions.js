const fs = require('fs');
const path = require('path');

const filePath = 'products.json';
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const usedSlugs = new Set();
let changes = 0;

products.forEach((p, index) => {
    let originalSlug = p.slug;
    let currentSlug = originalSlug;
    let counter = 2;

    while (usedSlugs.has(currentSlug)) {
        currentSlug = `${originalSlug}-${counter}`;
        counter++;
        changes++;
    }

    p.slug = currentSlug;
    usedSlugs.add(currentSlug);
});

if (changes > 0) {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    console.log(`Sucesso: ${changes} colisões resolvidas em products.json`);
} else {
    console.log('Nenhuma colisão encontrada.');
}

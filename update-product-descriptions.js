const fs = require('fs');
const path = require('path');

const resultsFile = path.join(__dirname, 'batch_results_products.jsonl');
const productsFile = path.join(__dirname, 'products.json');

if (!fs.existsSync(resultsFile)) {
    console.error('Error: batch_results_products.jsonl not found.');
    process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
const lines = fs.readFileSync(resultsFile, 'utf8').split('\n').filter(l => l.trim().length > 0);

const resultsMap = {};
lines.forEach(line => {
    try {
        const data = JSON.parse(line);
        if (!data.response || !data.response.body) return;
        const content = data.response.body.choices[0].message.content;
        const slug = data.custom_id.replace('product-', '');
        resultsMap[slug] = content;
    } catch (e) {
        console.error(`Error parsing line: ${e.message}`);
    }
});

let updatedCount = 0;
const updatedProducts = products.map(p => {
    if (resultsMap[p.slug]) {
        updatedCount++;
        return { ...p, description: resultsMap[p.slug] };
    }
    return p;
});

fs.writeFileSync(productsFile, JSON.stringify(updatedProducts, null, 2));
console.log(`Updated ${updatedCount} product descriptions in products.json`);

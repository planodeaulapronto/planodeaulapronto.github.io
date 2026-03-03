const fs = require('fs');
const path = require('path');

const artigosDir = path.join(__dirname, 'artigos');
if (!fs.existsSync(artigosDir)) {
    console.log('Pasta de artigos não encontrada');
    process.exit();
}

const files = fs.readdirSync(artigosDir).filter(f => f.endsWith('.html') && f !== 'index.html');
const index = [];

for (const file of files) {
    const content = fs.readFileSync(path.join(artigosDir, file), 'utf8');

    // Extract Title
    const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
    const title = titleMatch ? titleMatch[1] : '';

    // Extract Category from metadata if exists
    let category = 'Artigo Escolar';
    const catMatch = content.match(/\*\*Tema\*\*:\s*([^<]+)/);
    if (catMatch) category = catMatch[1].trim();

    index.push({
        title,
        slug: file.replace('.html', ''),
        type: 'article',
        category,
        price: '',
        url: `artigos/${file}`
    });
}

fs.writeFileSync(path.join(__dirname, 'search-index-articles.json'), JSON.stringify(index));
console.log(`Gerado search-index-articles.json com ${index.length} artigos.`);

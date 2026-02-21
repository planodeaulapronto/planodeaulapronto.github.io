const fs = require('fs');
const path = require('path');

const resultsFile = path.join(__dirname, 'batch_results.jsonl');
const productsFile = path.join(__dirname, 'products.json');
const outputDir = path.join(__dirname, 'artigos');
const BASE_URL = 'https://planodeaulapronto.github.io/planodeaulapronto';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

if (!fs.existsSync(resultsFile)) {
  console.error('Error: batch_results.jsonl not found.');
  process.exit(1);
}

const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));

// Categorization helper for articles
function categorize(title) {
  const t = title.toLowerCase();
  if (t.includes('infantil') || t.includes('bercario') || t.includes('maternal')) return 'Educação Infantil';
  if (t.includes('1 ano') || t.includes('fundamental 1') || t.includes('alfabetiza')) return 'Ensino Fundamental I';
  if (t.includes('ensino medio') || t.includes('projeto de vida')) return 'Ensino Médio';
  if (t.includes('matematica')) return 'Matemática';
  if (t.includes('portugues') || t.includes('leitura')) return 'Português';
  return 'Geral';
}

const lines = fs.readFileSync(resultsFile, 'utf8').split('\n').filter(l => l.trim().length > 0);
const articles = [];

lines.forEach(line => {
  try {
    const data = JSON.parse(line);
    if (!data.response || !data.response.body) return;
    const content = data.response.body.choices[0].message.content;
    const customId = data.custom_id;

    let title = 'Artigo Pedagógico';
    const titleMatch = content.match(/^#+\s*(.*)/);
    if (titleMatch) title = titleMatch[1].replace(/\*\*/g, '').trim();

    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    articles.push({
      title,
      slug,
      content,
      category: categorize(title),
      customId
    });
  } catch (e) {
    console.error(`Error parsing line: ${e.message}`);
  }
});

function generateArticleHtml(article) {
  let htmlBody = article.content
    .replace(/^# (.*)/gm, '<h1>$1</h1>')
    .replace(/^## (.*)/gm, '<h2>$1</h2>')
    .replace(/^### (.*)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  if (!htmlBody.startsWith('<h')) htmlBody = '<p>' + htmlBody;

  // Pick 3 random related products
  const related = products.sort(() => 0.5 - Math.random()).slice(0, 3);
  const relatedHtml = related.map(p => `
    <div class="product-mini-card">
        <img src="../images/${(p.localImage || 'images/' + p.slug + '.webp').replace('images/', '')}" alt="${p.title}">
        <div>
            <h4>${p.title}</h4>
            <a href="../produtos/${p.slug}.html" class="view-btn">Ver Material</a>
        </div>
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} | Blog Pedagógico</title>
  <style>
    :root { --primary: #4F46E5; --dark: #1a1a2e; --text: #2d3748; --radius: 16px; }
    body { font-family: sans-serif; color: var(--text); background: #f8fafc; margin: 0; }
    .nav-bar { background: white; padding: 15px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
    .logo { font-weight: 800; color: var(--primary); text-decoration: none; font-size: 1.2rem; }
    .container { max-width: 1100px; margin: 0 auto; padding: 40px 20px; display: grid; grid-template-columns: 1fr 320px; gap: 40px; }
    .content-area { background: white; padding: 40px; border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    h1 { font-size: 2.2rem; color: var(--dark); margin-top: 0; }
    .product-mini-card { display: flex; gap: 12px; margin-bottom: 15px; background: #f8fafc; padding: 10px; border-radius: 10px; }
    .product-mini-card img { width: 60px; height: 60px; border-radius: 6px; object-fit: cover; }
    .view-btn { font-size: 0.75rem; color: var(--primary); font-weight: 700; text-decoration: none; }
  </style>
</head>
<body>
  <nav class="nav-bar">
    <a href="../index.html" class="logo">📚 Materiais BNCC</a>
    <a href="index.html" style="font-weight: 600; color: var(--text); text-decoration: none;">📰 Artigos</a>
  </nav>
  <div class="container">
    <main class="content-area">${htmlBody}</main>
    <aside>
      <div style="background: #EEF2FF; padding: 20px; border-radius: 16px;">
        <h4>🌟 Recomendados</h4>
        ${relatedHtml}
      </div>
    </aside>
  </div>
</body>
</html>`;
}

articles.forEach(article => {
  const html = generateArticleHtml(article);
  fs.writeFileSync(path.join(outputDir, article.slug + '.html'), html);
});

const articleIndex = articles.map(a => ({
  title: a.title, slug: a.slug, type: 'article', category: a.category, url: 'artigos/' + a.slug + '.html'
}));
fs.writeFileSync(path.join(__dirname, 'search-index-articles.json'), JSON.stringify(articleIndex));

const categories = [...new Set(articles.map(a => a.category))];
const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Pedagógico</title>
  <style>
    body { font-family: sans-serif; background: #f8fafc; margin: 0; }
    header { background: #1a1a2e; color: white; padding: 60px 20px; text-align: center; }
    .search-box { max-width: 600px; margin: 20px auto; }
    .search-box input { width: 100%; padding: 15px; border-radius: 30px; border: none; }
    .grid { max-width: 1200px; margin: 40px auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 0 20px; }
    .card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
  </style>
</head>
<body>
  <header>
    <h1>Blog Pedagógico 📰</h1>
    <div class="search-box">
      <input type="text" id="blogSearch" placeholder="Buscar artigos e produtos...">
    </div>
  </header>
  <div class="grid" id="blogGrid">
    ${articles.map(a => `
      <div class="card">
        <small>${a.category}</small>
        <h3>${a.title}</h3>
        <a href="${a.slug}.html">Ler mais</a>
      </div>
    `).join('')}
  </div>
  <script>
    const searchInput = document.getElementById('blogSearch');
    const blogGrid = document.getElementById('blogGrid');
    let searchIndex = [];
    async function load() {
      const artData = ${JSON.stringify(articleIndex)};
      const prodRes = await fetch('../search-index-products.json');
      const prodData = await prodRes.json();
      searchIndex = [...artData, ...prodData.map(p => ({ ...p, url: '../' + p.url }))];
    }
    load();
    const resultsOverlay = document.createElement('div');
    resultsOverlay.style.cssText = 'display:none; position:absolute; background:white; width:100%; box-shadow:0 10px 20px rgba(0,0,0,0.1); z-index:100;';
    searchInput.parentElement.appendChild(resultsOverlay);
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      if (!q) { resultsOverlay.style.display='none'; return; }
      const matches = searchIndex.filter(i => i.title.toLowerCase().includes(q)).slice(0, 10);
      resultsOverlay.style.display = 'block';
      resultsOverlay.innerHTML = matches.map(i => '<a href="'+i.url+'" style="display:block;padding:10px;text-decoration:none;color:black;">'+i.title+'</a>').join('');
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
console.log('Done: ' + articles.length + ' articles.');

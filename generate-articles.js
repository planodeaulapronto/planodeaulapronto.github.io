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
    .replace(/(<\/p>|<br>)\s*\n/g, '$1')
    .replace(/\n/g, '<br>');

  if (!htmlBody.startsWith('<h')) htmlBody = '<p>' + htmlBody;
  if (!htmlBody.endsWith('>')) htmlBody += '</p>';

  const backlinkUrl = 'https://diariodaeducacao.com.br/';
  const keyword = /plano de aula pronto/gi;

  if (!htmlBody.includes(backlinkUrl)) {
    let replaced = false;
    htmlBody = htmlBody.replace(keyword, (match) => {
      if (!replaced) {
        replaced = true;
        return `<a href="${backlinkUrl}" rel="dofollow">${match}</a>`;
      }
      return match;
    });
  }

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
    <div style="display:flex; gap:15px;">
        <a href="../index.html" style="font-weight: 600; color: var(--text); text-decoration: none;">Início</a>
        <a href="index.html" style="font-weight: 600; color: var(--text); text-decoration: none;">📰 Artigos</a>
    </div>
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
    .nav-top { background: #fff; padding: 10px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; }
    .search-box { max-width: 600px; margin: 20px auto; }
    .search-box input { width: 100%; padding: 15px; border-radius: 30px; border: none; }
    .grid { max-width: 1200px; margin: 40px auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; padding: 0 20px; }
    .card { background: white; padding: 25px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    .pagination { text-align: center; padding: 40px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .page-btn { padding: 8px 15px; background: white; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; text-decoration: none; color: #333; }
    .page-btn.active { background: #4F46E5; color: white; border-color: #4F46E5; }
  </style>
</head>
<body>
  <nav class="nav-top">
    <a href="../index.html" style="font-weight: 800; color: #4F46E5; text-decoration: none;">📚 Voltar ao Início</a>
    <span>📰 Artigos e Dicas</span>
  </nav>
  <header>
    <h1>Blog Pedagógico 📰</h1>
    <div class="search-box">
      <input type="text" id="blogSearch" placeholder="Buscar artigos e produtos...">
    </div>
  </header>
  <div class="grid" id="blogGrid"></div>
  <div class="pagination" id="pagination"></div>

  <script>
    const articles = ${JSON.stringify(articles.map(a => ({ title: a.title, category: a.category, slug: a.slug })))};
    const itemsPerPage = 20;
    let currentPage = 1;
    let filteredArticles = articles;

    const blogGrid = document.getElementById('blogGrid');
    const pagination = document.getElementById('pagination');
    const searchInput = document.getElementById('blogSearch');

    function render() {
      blogGrid.innerHTML = '';
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageItems = filteredArticles.slice(start, end);

      blogGrid.innerHTML = pageItems.map(a => \`
        <div class="card">
          <small>\${a.category}</small>
          <h3>\${a.title}h3>
          <a href="\${a.slug}.html">Ler mais</a>
        </div>
      \`).join('');

      renderPagination();
    }

    function renderPagination() {
      const pageCount = Math.ceil(filteredArticles.length / itemsPerPage);
      pagination.innerHTML = '';
      if (pageCount <= 1) return;

      for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.addEventListener('click', () => {
          currentPage = i;
          render();
          window.scrollTo(0, 0);
        });
        pagination.appendChild(btn);
      }
    }

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      filteredArticles = articles.filter(a => a.title.toLowerCase().includes(q));
      currentPage = 1;
      render();
    });

    render();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
console.log('Done: ' + articles.length + ' articles.');

const fs = require('fs');
const path = require('path');

const resultsFile = path.join(__dirname, 'batch_results.jsonl');
const productsFile = path.join(__dirname, 'products.json');
const outputDir = path.join(__dirname, 'artigos');
const BASE_URL = 'https://planodeaulapronto.github.io';

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
    .replace(/https:\/\/diariodaeducacao\.com\.br\//g, 'https://planodeaulapronto.github.io/')
    .replace(/rel="dofollow"/g, 'rel="nofollow"');

  // Format Metadata Block (Theme, Audience, BNCC)
  const metadataRegex = /-\s*\*\*(Tema|Público-alvo|Códigos BNCC)\*\*:(.*)/gi;
  if (htmlBody.match(metadataRegex)) {
    htmlBody = htmlBody.replace(/(?:-\s*\*\*.*?\*\*.*?\n?){1,5}/i, (match) => {
      const items = match.split('\n').filter(l => l.trim()).map(l => {
        return l.replace(/-\s*\*\*(.*?)\*\*:(.*)/i, '<div><strong>$1:</strong>$2</div>');
      }).join('');
      return `<div class="metadata-box"><h4>📋 Ficha do Plano de Aula</h4>${items}</div>`;
    });
  }

  htmlBody = htmlBody
    .replace(/^## (.*)/gm, '<h2>$1</h2>')
    .replace(/^### (.*)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/(<\/p>|<br>)\s*\n/g, '$1')
    .replace(/\n/g, '<br>');

  const ctaBox = `
    <div class="cta-highlight">
        <div style="font-size: 1.5rem; margin-bottom: 15px;">🚀 <strong>PACOTE COMPLETO ALINHADO À BNCC 2026</strong></div>
        <p style="font-size: 1.2rem; line-height: 1.5; margin-bottom: 25px;">
            Para pacotes e kits completos de <strong>planos de aula e atividades</strong> (PDF e DOCX), visite nossa 
            <span style="color: #FFD700; font-size: 1.3rem;">★</span> <strong>Página de Materiais Completos</strong>.
        </p>
        <div style="font-size: 1rem; margin-bottom: 20px; opacity: 0.9;">
            Inclui: Planos de Aula, Atividades, Avaliações, Slides e Gabaritos Editáveis.
        </div>
        <a href="https://planodeaulapronto.github.io/" rel="nofollow" class="cta-button">ACESSAR TODOS OS MATERIAIS AGORA →</a>
    </div>
  `;

  htmlBody = ctaBox + htmlBody + ctaBox;

  if (!htmlBody.startsWith('<h')) htmlBody = '<p>' + htmlBody;
  if (!htmlBody.endsWith('>')) htmlBody += '</p>';

  const backlinkUrl = 'https://planodeaulapronto.github.io/';
  const keywords = [
    /plano de aula pronto/gi,
    /planos de aula prontos/gi,
    /planejamento de aula pronto/gi
  ];

  keywords.forEach(kw => {
    htmlBody = htmlBody.replace(kw, (match) => {
      // Avoid nesting links if the AI already put one
      if (htmlBody.includes(`>${match}</a>`) || htmlBody.includes(`href="${backlinkUrl}"`)) {
        return match;
      }
      return `<a href="${backlinkUrl}" rel="nofollow">${match}</a>`;
    });
  });

  // Pick 15 random related products
  const related = products.sort(() => 0.5 - Math.random()).slice(0, 15);
  const relatedHtml = related.map(p => {
    const buyLinkRaw = p.hotmartLink || p.link || '';
    const hLink = buyLinkRaw.includes('?') ? `${buyLinkRaw.split('?')[0]}?src=github` : `${buyLinkRaw}?src=github`;
    return `
    <div class="product-mini-card">
        <a href="../produtos/${p.slug}.html" rel="dofollow">
          <img src="../images/${(p.localImage || 'images/' + p.slug + '.webp').replace('images/', '')}" alt="${p.title.replace(/"/g, '&quot;')}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2260%22 height=%2260%22><rect fill=%22%23eee%22 width=%2260%22 height=%2260%22/></svg>'">
        </a>
        <div>
            <a href="../produtos/${p.slug}.html" rel="dofollow" style="text-decoration: none; color: inherit;">
              <h4>${p.title}</h4>
            </a>
            <a href="${hLink}" target="_blank" rel="nofollow" class="view-btn">Acessar Produto →</a>
        </div>
    </div>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${article.title} | Blog Pedagógico</title>
  <style>
    :root { --primary: #4F46E5; --dark: #1a1a2e; --text: #2d3748; --radius: 16px; }
    body { font-family: sans-serif; color: var(--text); background: #f8fafc; margin: 0; line-height: 1.6; }
    .nav-bar { background: white; padding: 15px 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
    .logo { font-weight: 800; color: var(--primary); text-decoration: none; font-size: 1.2rem; display: flex; align-items: center; gap: 8px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 40px 20px; display: grid; grid-template-columns: 1fr 350px; gap: 40px; }
    .content-area { background: white; padding: 40px; border-radius: var(--radius); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .metadata-box div { margin-bottom: 8px; font-size: 0.95rem; }
    .cta-highlight { background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 100%); color: white; padding: 45px 30px; border-radius: 24px; margin: 50px 0; text-align: center; box-shadow: 0 20px 40px rgba(79,70,229,0.3); border: 2px solid #6366f1; }
    .cta-highlight p { opacity: 1; margin-bottom: 25px; }
    .cta-button { display: inline-block; background: #FFD700; color: #1e1b4b; padding: 18px 45px; border-radius: 50px; text-decoration: none; font-weight: 900; font-size: 1.1rem; transition: all 0.3s; box-shadow: 0 5px 15px rgba(255,215,0,0.4); animation: pulse 2s infinite; }
    .cta-button:hover { transform: scale(1.05); background: #fff; color: #4f46e5; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
    h1 { font-size: 2.2rem; color: var(--dark); margin-top: 0; line-height: 1.2; }
    .product-mini-card { display: flex; gap: 12px; margin-bottom: 20px; background: #fff; padding: 12px; border-radius: 12px; border: 1px solid #eee; transition: transform 0.2s; }
    .product-mini-card:hover { transform: translateX(5px); border-color: var(--primary); }
    .product-mini-card img { width: 70px; height: 70px; border-radius: 8px; object-fit: cover; }
    .product-mini-card h4 { font-size: 0.85rem; margin: 0 0 5px 0; color: var(--dark); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .view-btn { font-size: 0.75rem; color: var(--primary); font-weight: 700; text-decoration: none; }
    aside h4 { margin-top: 0; font-size: 1.2rem; color: var(--primary); border-bottom: 2px solid #eef2ff; padding-bottom: 10px; margin-bottom: 20px; }
    @media (max-width: 900px) { .container { grid-template-columns: 1fr; } .content-area { padding: 25px; } }
  </style>

  <!-- Advanced Structured Data (JSON-LD) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "${article.title.replace(/"/g, '\\"')}",
    "description": "${article.title.replace(/"/g, '\\"')} - Guia completo e plano de aula pronto alinhado à BNCC 2026.",
    "author": {
      "@type": "Organization",
      "name": "Diário da Educação"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Diário da Educação",
      "logo": {
        "@type": "ImageObject",
        "url": "https://planodeaulapronto.github.io/images/logo.png"
      }
    },
    "datePublished": "2026-02-23",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "${BASE_URL}/artigos/${article.slug}.html"
    }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "${BASE_URL}/index.html" },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": "${BASE_URL}/artigos/index.html" },
      { "@type": "ListItem", "position": 3, "name": "${article.title.replace(/"/g, '\\"')}" }
    ]
  }
  </script>
</head>
<body>
  <nav class="nav-bar">
    <a href="../index.html" rel="dofollow" class="logo">📚 Materiais BNCC</a>
    <div style="display:flex; gap:20px; align-items:center;">
        <a href="../index.html" rel="dofollow" style="font-weight: 700; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 5px;">
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
           Voltar ao Início
        </a>
        <a href="index.html" rel="dofollow" style="font-weight: 600; color: var(--text); text-decoration: none;">📰 Blog</a>
    </div>
  </nav>
  <div class="container">
    <main class="content-area">${htmlBody}</main>
    <aside>
      <div style="background: #f8fafc; padding: 25px; border-radius: 20px; border: 1px solid #eef2ff; position: sticky; top: 80px; max-height: calc(100vh - 120px); overflow-y: auto;">
        <h4>🔥 Materiais Recomendados</h4>
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

const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Pedagógico | Artigos e Dicas para Professores</title>
  <style>
    :root { --primary: #4F46E5; --dark: #1a1a2e; }
    body { font-family: sans-serif; background: #f8fafc; margin: 0; }
    .nav-top { background: #fff; padding: 15px 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
    header { background: linear-gradient(135deg, var(--dark) 0%, #252545 100%); color: white; padding: 60px 20px; text-align: center; }
    .search-box { max-width: 600px; margin: 30px auto 0; position: relative; }
    .search-box input { width: 100%; padding: 18px 25px; border-radius: 50px; border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.1); font-size: 1rem; outline: none; }
    .grid { max-width: 1200px; margin: 40px auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; padding: 0 20px; }
    .card { background: white; padding: 30px; border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); transition: all 0.3s ease; border: 1px solid transparent; display: flex; flex-direction: column; }
    .card:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 12px 30px rgba(79,70,229,0.1); }
    .card small { color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; }
    .card h3 { margin: 15px 0; color: var(--dark); line-height: 1.3; font-size: 1.25rem; flex: 1; }
    .card a { color: var(--primary); text-decoration: none; font-weight: 700; font-size: 0.9rem; display: flex; align-items: center; gap: 5px; }
    .pagination { text-align: center; padding: 40px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .page-btn { padding: 10px 20px; background: white; border: 1px solid #eef2ff; border-radius: 12px; cursor: pointer; text-decoration: none; color: #444; font-weight: 600; transition: all 0.3s; }
    .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
    .page-btn:hover:not(.active) { background: #f0f4ff; }
  </style>
</head>
<body>
  <nav class="nav-top">
    <a href="../index.html" rel="dofollow" style="font-weight: 800; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 8px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      Voltar ao Início do Site
    </a>
    <span style="font-weight: 600; color: #666;">📰 Artigos e Dicas</span>
  </nav>
  <header>
    <h1 style="font-size: 2.5rem; margin-bottom: 10px;">Blog Pedagógico 📰</h1>
    <p style="font-size: 1.1rem; opacity: 0.8;">As melhores dicas, notícias e materiais para educadores</p>
    <div class="search-box">
      <input type="text" id="blogSearch" placeholder="O que você está procurando?">
    </div>
  </header>
  <div class="grid" id="blogGrid"></div>
  <div class="pagination" id="pagination"></div>

  <script>
    const allArticles = ${JSON.stringify(articles.map(a => ({ title: a.title, category: a.category, slug: a.slug })))};
    const itemsPerPage = 20;
    let currentPage = 1;
    let filteredArticles = allArticles;

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
          <h3>\${a.title}</h3>
          <a href="\${a.slug}.html" rel="dofollow">
            Ler Artigo Completo
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      \`).join('');

      renderPagination();
    }

    function renderPagination() {
      const pageCount = Math.ceil(filteredArticles.length / itemsPerPage);
      pagination.innerHTML = '';
      if (pageCount <= 1) return;

      const maxButtons = 5;
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(pageCount, startPage + maxButtons - 1);
      
      if (endPage - startPage < maxButtons - 1) {
          startPage = Math.max(1, endPage - maxButtons + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = 'page-btn' + (i === currentPage ? ' active' : '');
        btn.onclick = () => { currentPage = i; render(); window.scrollTo(0, 0); };
        pagination.appendChild(btn);
      }
    }

    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      filteredArticles = allArticles.filter(a => a.title.toLowerCase().includes(q));
      currentPage = 1;
      render();
    });

    render();
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);
console.log('Done: ' + articles.length + ' articles generated with backlinks and 15 related products.');

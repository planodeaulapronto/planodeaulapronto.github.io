const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
console.log(`Loaded ${products.length} products`);

const BASE_URL = 'https://planodeaulapronto.github.io';
const buildTime = new Date().toLocaleString('pt-BR');

// Categorize products
function categorize(slug) {
  const s = slug.toLowerCase();
  if (s.includes('bercario') || s.includes('maternal') || s.includes('pre-escola') || s.includes('educacao-infantil') || s.includes('cartas-de-intencao') || s.includes('planner-educacao-especial') || s.includes('50-projetos-para-pre') || s.includes('ebooks-educacao-infantil') || s.includes('planejamentos-educacao-infantil')) return 'Educação Infantil';
  if (s.includes('1o-ao-5o') || s.includes('1-ao-5') || s.includes('anos-iniciais') || s.includes('1o-ano') || s.includes('2o-ano') || s.includes('3o-ano') || s.includes('4o-ano') || s.includes('5o-ano') || s.includes('1-ano') || s.includes('2-ano') || s.includes('3-ano') || s.includes('4-ano') || s.includes('5-ano')) return 'Ensino Fundamental I';
  if (s.includes('6o-ao-9o') || s.includes('6-ao-9') || s.includes('fundamental-2')) return 'Ensino Fundamental II';
  if (s.includes('ensino-medio') || s.includes('novo-ensino-medio')) return 'Ensino Médio';
  if (s.includes('eja') || s.includes('educacao-jovens-adultos')) return 'EJA';
  if (s.includes('educacao-especial') || s.includes('tdah') || s.includes('autismo') || s.includes('dislexia') || s.includes('libras') || s.includes('estimulacao-cognitiva') || s.includes('aee') || s.includes('sindrome-down')) return 'Educação Especial';
  if (s.includes('alfabetizacao') || s.includes('consciencia-fonologica') || s.includes('alfabetinho')) return 'Alfabetização';
  if (s.includes('jogos-pedagogicos') || s.includes('datas-comemorativas') || s.includes('biblicas') || s.includes('producao-interpretacao') || s.includes('ingles-espanhol') || s.includes('kit-matematica')) return 'Materiais Complementares';
  return 'Materiais Pedagógicos';
}

const categories = {};
const catOrder = [
  'Educação Infantil',
  'Ensino Fundamental I',
  'Ensino Fundamental II',
  'Ensino Médio',
  'Alfabetização',
  'EJA',
  'Educação Especial',
  'Materiais Complementares',
  'Materiais Pedagógicos'
];

const catColors = {
  'Educação Infantil': { bg: '#FF6B9D', dark: '#E91E63', light: '#FCE4EC', gradient: 'linear-gradient(135deg, #FF6B9D, #E91E63)' },
  'Ensino Fundamental I': { bg: '#4FC3F7', dark: '#0288D1', light: '#E1F5FE', gradient: 'linear-gradient(135deg, #4FC3F7, #0288D1)' },
  'Ensino Fundamental II': { bg: '#66BB6A', dark: '#2E7D32', light: '#E8F5E9', gradient: 'linear-gradient(135deg, #66BB6A, #2E7D32)' },
  'Ensino Médio': { bg: '#AB47BC', dark: '#7B1FA2', light: '#F3E5F5', gradient: 'linear-gradient(135deg, #AB47BC, #7B1FA2)' },
  'Alfabetização': { bg: '#FF7043', dark: '#D84315', light: '#FBE9E7', gradient: 'linear-gradient(135deg, #FF7043, #D84315)' },
  'EJA': { bg: '#26A69A', dark: '#00695C', light: '#E0F2F1', gradient: 'linear-gradient(135deg, #26A69A, #00695C)' },
  'Educação Especial': { bg: '#5C6BC0', dark: '#283593', light: '#E8EAF6', gradient: 'linear-gradient(135deg, #5C6BC0, #283593)' },
  'Materiais Complementares': { bg: '#FFA726', dark: '#E65100', light: '#FFF3E0', gradient: 'linear-gradient(135deg, #FFA726, #E65100)' },
  'Materiais Pedagógicos': { bg: '#78909C', dark: '#37474F', light: '#ECEFF1', gradient: 'linear-gradient(135deg, #78909C, #37474F)' }
};

const catIcons = {
  'Educação Infantil': '🧒',
  'Ensino Fundamental I': '📚',
  'Ensino Fundamental II': '📖',
  'Ensino Médio': '🎓',
  'Alfabetização': '🔤',
  'EJA': '👨‍🎓',
  'Educação Especial': '💙',
  'Materiais Complementares': '🎯',
  'Materiais Pedagógicos': '📋'
};

products.forEach(p => {
  const cat = categorize(p.slug);
  if (!categories[cat]) categories[cat] = [];
  categories[cat].push(p);
});

// Generate category nav buttons
function generateCatNav() {
  const categoriesHtml = catOrder.filter(c => categories[c] && categories[c].length > 0).map(cat => {
    const colors = catColors[cat];
    const icon = catIcons[cat];
    const id = cat.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase();
    return `<a href="#${id}" rel="dofollow" class="cat-btn" style="background: ${colors.gradient}">
              <span class="cat-icon">${icon}</span>
              <span class="cat-name">${cat}</span>
              <span class="cat-count">${categories[cat].length}</span>
            </a>`;
  }).join('\n            ');

  return categoriesHtml + `
            <a href="artigos/index.html" rel="dofollow" class="cat-btn" style="background: linear-gradient(135deg, #4F46E5, #3730A3)">
              <span class="cat-icon">📰</span>
              <span class="cat-name">Artigos e Dicas</span>
            </a>`;
}

// Helper to strip HTML for Node.js
const stripHtml = (html) => (html || '')
  .replace(/<[^>]*>?/gm, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Generate product cards for a category
function generateCards(prods) {
  return prods.map(p => {
    const title = stripHtml(p.title).replace(/"/g, '&quot;');
    const desc = stripHtml(p.description).substring(0, 160).replace(/"/g, '&quot;');
    const imgSrc = p.localImage || `images/${p.slug}.webp`;

    let buyLink = p.hotmartLink || p.link || '';
    if (buyLink.includes('go.hotmart.com')) {
      const urlBase = buyLink.split('?')[0];
      buyLink = `${urlBase}?src=github`;
    } else {
      buyLink = buyLink.includes('?') ? `${buyLink}&src=github` : `${buyLink}?src=github`;
    }
    const price = p.price ? `R$ ${p.price}` : '';
    const discount = p.discount ? `-${p.discount}%` : '';

    const imgFallback = `this.onerror=null; if(this.src.includes('produtos-alfabetinho')){ this.src=this.src.replace('produtos-alfabetinho','produtos-bncc').replace('-1024x1024',''); } else { this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><rect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/><text x=%22150%22 y=%22150%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2216%22>Sem Imagem</text></svg>'; }`;

    return `
              <div class="product-card">
                <div class="card-image">
                  <img src="${imgSrc}" alt="${title}" loading="lazy" onerror="${imgFallback}">
                  ${discount ? `<span class="discount-badge">${discount}</span>` : ''}
                </div>
                <div class="card-body">
                  <a href="produto/${p.slug}.html" rel="dofollow" style="text-decoration: none; color: inherit;">
                    <h3 class="card-title">${title}</h3>
                  </a>
                  <p class="card-desc">${desc}${desc.length >= 160 ? '...' : ''}</p>
                  <div class="card-footer">
                    ${price ? `<span class="card-price">${price}</span>` : ''}
                    <a href="${buyLink}" target="_blank" rel="nofollow" class="buy-btn">Acessar Produto →</a>
                  </div>
                </div>
              </div>`;
  }).join('');
}

// Generate category sections
function generateSections() {
  return catOrder.filter(c => categories[c] && categories[c].length > 0).map(cat => {
    const colors = catColors[cat];
    const icon = catIcons[cat];
    const id = cat.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase();
    return `
        <section class="category-section" id="${id}">
          <div class="category-header" style="background: ${colors.gradient}">
            <h2>${icon} ${cat}</h2>
            <span class="section-count">${categories[cat].length} produtos</span>
          </div>
          <div class="products-grid">
            ${generateCards(categories[cat])}
          </div>
        </section>`;
  }).join('\n');
}

// Construct the HTML using string concatenation to avoid syntax errors with nested backticks
let html = '<!DOCTYPE html>\n<html lang="pt-BR">\n<head>\n' +
  '  <meta charset="UTF-8">\n' +
  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
  '  <title>Plano de Aula Pronto BNCC 2026 - Baixar em Word e PDF Editável</title>\n' +
  '  <meta name="description" content="Plano de Aula Pronto BNCC 2026. Baixe plano de aula diário, semanal, bimestral e anual, editável em Word e PDF para imprimir. Materiais completos de acordo com a BNCC para todos os anos.">\n' +
  '  <meta name="robots" content="index, follow">\n' +
  '  <link rel="canonical" href="https://planodeaulapronto.github.io/">\n' +
  '  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@700;800&display=swap" rel="stylesheet">\n' +
  '  <style>\n' +
  '    :root {\n' +
  '      --primary: #6C63FF; --primary-dark: #5A52E0; --secondary: #FF6B9D; --accent: #00D4AA;\n' +
  '      --dark: #1a1a2e; --darker: #0f0f23; --card-bg: #ffffff; --text: #2d3748; --text-light: #718096;\n' +
  '      --radius: 16px; --shadow: 0 4px 20px rgba(0,0,0,0.08); --shadow-hover: 0 12px 40px rgba(0,0,0,0.15);\n' +
  '    }\n' +
  '    * { margin: 0; padding: 0; box-sizing: border-box; }\n' +
  '    body { font-family: \'Inter\', sans-serif; color: var(--text); background: #f8fafc; line-height: 1.6; overflow-x: hidden; }\n' +
  '    .hero { background: linear-gradient(135deg, var(--darker) 0%, #16213e 50%, #1a1a2e 100%); padding: 80px 20px 60px; text-align: center; position: relative; }\n' +
  '    .hero h1 { font-family: \'Outfit\', sans-serif; font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; color: white; margin-bottom: 20px; }\n' +
  '    .hero h1 span { background: linear-gradient(135deg, #6C63FF, #FF6B9D, #00D4AA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }\n' +
  '    .hero p { color: rgba(255,255,255,0.7); font-size: 1.15rem; max-width: 650px; margin: 0 auto 32px; }\n' +
  '    .hero-stats { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }\n' +
  '    .stat-number { font-family: \'Outfit\', sans-serif; font-size: 2.5rem; font-weight: 800; color: var(--accent); }\n' +
  '    .stat-label { color: rgba(255,255,255,0.6); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }\n' +
  '    .cat-nav { background: white; padding: 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 20px rgba(0,0,0,0.06); border-bottom: 1px solid #edf2f7; }\n' +
  '    .cat-nav-inner { max-width: 1400px; margin: 0 auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }\n' +
  '    .cat-btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 50px; color: white; text-decoration: none; font-size: 0.95rem; font-weight: 700; transition: all 0.3s; }\n' +
  '    .cat-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }\n' +
  '    .category-section { max-width: 1400px; margin: 40px auto; padding: 0 20px; }\n' +
  '    .category-header { padding: 24px 32px; border-radius: var(--radius) var(--radius) 0 0; display: flex; align-items: center; justify-content: space-between; }\n' +
  '    .category-header h2 { font-family: \'Outfit\', sans-serif; font-size: 1.6rem; color: white; }\n' +
  '    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; padding: 20px; background: #f1f5f9; border-radius: 0 0 var(--radius) var(--radius); }\n' +
  '    @media (min-width: 1200px) { .products-grid { grid-template-columns: repeat(6, 1fr); } }\n' +
  '    .product-card { background: white; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: all 0.3s; display: flex; flex-direction: column; }\n' +
  '    .card-image { position: relative; width: 100%; aspect-ratio: 4/3; }\n' +
  '    .card-image img { width: 100%; height: 100%; object-fit: cover; }\n' +
  '    .card-body { padding: 15px; flex: 1; display: flex; flex-direction: column; }\n' +
  '    .card-title { font-family: \'Outfit\', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--dark); }\n' +
  '    .card-price { font-weight: 800; color: #16a34a; font-size: 1.1rem; }\n' +
  '    .buy-btn { background: var(--primary); color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-size: 0.8rem; font-weight: 700; }\n' +
  '    .search-container { max-width: 600px; margin: 30px auto 0; position: relative; z-index: 1001; }\n' +
  '    .search-box { position: relative; }\n' +
  '    .search-box input { width: 100%; padding: 16px 20px 16px 50px; border-radius: 50px; border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; font-size: 1rem; outline: none; transition: all 0.3s; }\n' +
  '    .search-box input:focus { background: white; color: var(--dark); border-color: var(--primary); }\n' +
  '    #searchOverlay { position: absolute; top: calc(100% + 10px); left: 0; right: 0; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); z-index: 2000; max-height: 500px; overflow-y: auto; display: none; padding: 10px; border: 1px solid #eee; }\n' +
  '    .search-backdrop { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 1000; display: none; }\n' +
  '    .footer { background: var(--darker); color: white; padding: 40px 20px; text-align: center; margin-top: 60px; }\n' +
  '  </style>\n</head>\n<body>\n' +
  '  <div class="search-backdrop" id="searchBackdrop"></div>\n' +
  '  <header class="hero">\n    <div class="hero-content">\n' +
  '      <h1>Plano de Aula Pronto <span>BNCC 2026</span></h1>\n' +
  '      <p>Baixe plano de aula diário, semanal, bimestral e anual, editável em Word e PDF. Materiais 100% de acordo com a BNCC.</p>\n' +
  '      <div class="hero-stats">\n' +
  '        <div class="stat"><div class="stat-number">' + products.length + '</div><div class="stat-label">Materiais</div></div>\n' +
  '        <div class="stat"><div class="stat-number">EDITÁVEL</div><div class="stat-label">Word/PDF</div></div>\n' +
  '        <div class="stat"><div class="stat-number">BNCC</div><div class="stat-label">Alinhados</div></div>\n' +
  '      </div>\n' +
  '      <div class="search-container">\n' +
  '        <div class="search-box">\n' +
  '          <input type="text" id="searchInput" placeholder="O que você está procurando? (ex: berçário, 1º ano...)" autocomplete="off">\n' +
  '          <div id="searchOverlay"></div>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n  </header>\n' +
  '  <nav class="cat-nav">\n    <div class="cat-nav-inner">' + generateCatNav() + '</div>\n  </nav>\n' +
  '  <main id="productsMain">' + generateSections() + '</main>\n' +
  '  <footer class="footer"><p>© 2026 — Materiais Pedagógicos BNCC - Atualizado: ' + buildTime + '</p></footer>\n' +
  '  <script>\n' +
  '    let searchIndex = [];\n' +
  '    async function loadAJAXIndex() {\n' +
  '      const t = new Date().getTime();\n' +
  '      console.log("Loading search index v" + t);\n' +
  '      try {\n' +
  '        const [p, a] = await Promise.all([\n' +
  '          fetch(\'search-index-products.json?v=\' + t).then(r => r.json()),\n' +
  '          fetch(\'search-index-articles.json?v=\' + t).then(r => r.ok ? r.json() : [])\n' +
  '        ]);\n' +
  '        searchIndex = [...p, ...a];\n' +
  '        console.log("Search index loaded: " + searchIndex.length + " items");\n' +
  '      } catch(e) { console.error(\'AJAX failed\', e); }\n' +
  '    }\n' +
  '    loadAJAXIndex();\n' +
  '\n' +
  '    function stripHtmlClient(h) {\n' +
  '      if(!h) return ""; \n' +
  '      const d = new DOMParser().parseFromString(h, "text/html");\n' +
  '      return d.body.textContent || "";\n' +
  '    }\n' +
  '\n' +
  '    const sInput = document.getElementById("searchInput");\n' +
  '    const sOverlay = document.getElementById("searchOverlay");\n' +
  '    const sBackdrop = document.getElementById("searchBackdrop");\n' +
  '\n' +
  '    sInput.addEventListener("input", (e) => {\n' +
  '      const q = e.target.value.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").trim();\n' +
  '      if(q.length < 1) {\n' +
  '        sOverlay.style.display = "none";\n' +
  '        sBackdrop.style.display = "none";\n' +
  '        return;\n' +
  '      }\n' +
  '      if(q.length < 2) return;\n' +
  '\n' +
  '      const matches = searchIndex.filter(item => {\n' +
  '        const cleanTitle = stripHtmlClient(item.title).toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");\n' +
  '        return cleanTitle.includes(q);\n' +
  '      }).slice(0, 15);\n' +
  '\n' +
  '      sOverlay.style.display = "block";\n' +
  '      sBackdrop.style.display = "block";\n' +
  '\n' +
  '      if(matches.length > 0) {\n' +
  '        sOverlay.innerHTML = matches.map(item => {\n' +
  '          const icon = item.type === "article" ? "📰" : "📦";\n' +
  '          const price = item.price ? `<span style="color: #16a34a; font-weight: 800">R$ ${item.price}</span>` : "";\n' +
  '          const titleClean = stripHtmlClient(item.title);\n' +
  '          return `<a href="${item.url}" style="display: flex; align-items: center; gap: 10px; padding: 12px; text-decoration: none; border-bottom: 1px solid #f1f5f9; border-radius: 8px;">\n' +
  '            <span style="font-size: 1.2rem">${icon}</span>\n' +
  '            <div style="flex: 1">\n' +
  '              <div style="font-weight: 700; color: #1a1a2e; font-size: 0.9rem">${titleClean}</div>\n' +
  '              <div style="font-size: 0.75rem; color: #64748b">${item.category || item.type}</div>\n' +
  '            </div>\n' +
  '            ${price}\n' +
  '          </a>`;\n' +
  '        }).join("") + `<div style="text-align: center; padding: 8px; font-size: 0.75rem; color: #94a3b8">Resultados: ${matches.length}</div>`;\n' +
  '      } else {\n' +
  '        sOverlay.innerHTML = \'<div style="padding: 20px; text-align: center; color: #64748b">Nenhum resultado encontrado</div>\';\n' +
  '      }\n' +
  '    });\n' +
  '\n' +
  '    document.addEventListener("click", (e) => {\n' +
  '      if(!sInput.contains(e.target) && !sOverlay.contains(e.target)) {\n' +
  '        sOverlay.style.display = "none";\n' +
  '        sBackdrop.style.display = "none";\n' +
  '      }\n' +
  '    });\n' +
  '  </script>\n</body>\n</html>';

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('Landing page generated: index.html');

// Export search index for products
const searchIndexProducts = products.map(p => ({
  title: stripHtml(p.title),
  slug: p.slug,
  type: 'product',
  category: categorize(p.slug),
  price: p.price,
  url: `produto/${p.slug}.html`
}));
fs.writeFileSync(path.join(__dirname, 'search-index-products.json'), JSON.stringify(searchIndexProducts));

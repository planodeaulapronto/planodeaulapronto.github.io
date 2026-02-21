const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
console.log(`Loaded ${products.length} products`);

// Categorize products
function categorize(slug) {
  const s = slug.toLowerCase();
  if (s.includes('bercario') || s.includes('maternal') || s.includes('pre-escola') || s.includes('educacao-infantil') || s.includes('cartas-de-intencao') || s.includes('planner-educacao-especial') || s.includes('50-projetos-para-pre') || s.includes('ebooks-educacao-infantil') || s.includes('planejamentos-educacao-infantil')) return 'Educação Infantil';
  if (s.includes('1o-ao-5o') || s.includes('1-ao-5') || s.includes('anos-iniciais') || s.includes('1o-ano') || s.includes('2o-ano') || s.includes('3o-ano') || s.includes('4o-ano') || s.includes('5o-ano') || s.includes('1-ano') || s.includes('2-ano') || s.includes('3-ano') || s.includes('4-ano') || s.includes('5-ano')) return 'Ensino Fundamental I';
  if (s.includes('6o-ao-9o') || s.includes('6-ao-9') || s.includes('fundamental-2')) return 'Ensino Fundamental II';
  if (s.includes('ensino-medio') || s.includes('novo-ensino-medio') || s.includes('ensino-medio')) return 'Ensino Médio';
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

// Print category counts
catOrder.forEach(cat => {
  if (categories[cat]) console.log(`${cat}: ${categories[cat].length} produtos`);
});

// Generate category nav buttons
function generateCatNav() {
  return catOrder.filter(c => categories[c] && categories[c].length > 0).map(cat => {
    const colors = catColors[cat];
    const icon = catIcons[cat];
    const id = cat.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase();
    return `<a href="#${id}" class="cat-btn" style="background: ${colors.gradient}">${icon} ${cat} <span class="cat-count">${categories[cat].length}</span></a>`;
  }).join('\n            ');
}

// Generate product cards for a category
function generateCards(prods) {
  return prods.map(p => {
    const title = p.title.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const desc = (p.description || '').substring(0, 120).replace(/"/g, '&quot;').replace(/</g, '&lt;');
    // Use local images (all 219 products have matching local files in images/)
    const imgSrc = p.localImage || `images/${p.slug}.webp`;

    // Force exactly ?src=github for all Hotmart links
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
                  <h3 class="card-title">${title}</h3>
                  <p class="card-desc">${desc}${desc.length >= 120 ? '...' : ''}</p>
                  <div class="card-footer">
                    ${price ? `<span class="card-price">${price}</span>` : ''}
                    <a href="products/${p.slug}.html" class="buy-btn">Ver Produto →</a>
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

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Materiais Pedagógicos BNCC 2026 | Planos de Aula, Atividades e Avaliações Prontos</title>
  <meta name="description" content="✅ ${products.length} materiais pedagógicos alinhados à BNCC 2026. Planos de aula prontos, atividades, avaliações e slides da Educação Infantil ao Ensino Médio. Material editável e completo para professores.">
  <meta name="keywords" content="planos de aula BNCC 2026, atividades BNCC, materiais pedagógicos, planejamento escolar, avaliações ensino fundamental, slides de aula, educação infantil BNCC, ensino médio BNCC, planos de aula prontos, atividades para professores, planejamento educação infantil, atividades ensino fundamental, material pedagógico editável">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <meta name="author" content="Materiais Pedagógicos BNCC">
  <link rel="canonical" href="https://planodeaulapronto.github.io/planodeaulapronto/">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://planodeaulapronto.github.io/planodeaulapronto/">
  <meta property="og:title" content="Materiais Pedagógicos BNCC 2026 | ${products.length} Produtos Prontos">
  <meta property="og:description" content="Planos de aula prontos, atividades, avaliações e slides alinhados à BNCC 2026. Da Educação Infantil ao Ensino Médio. Material editável para professores.">
  <meta property="og:image" content="${products[0] ? `https://planodeaulapronto.github.io/planodeaulapronto/${products[0].localImage || 'images/' + products[0].slug + '.webp'}` : ''}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Materiais Pedagógicos BNCC 2026">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Materiais Pedagógicos BNCC 2026 | ${products.length} Produtos Prontos">
  <meta name="twitter:description" content="Planos de aula prontos, atividades, avaliações e slides alinhados à BNCC 2026 para todos os níveis de ensino.">
  <meta name="twitter:image" content="${products[0] ? `https://planodeaulapronto.github.io/planodeaulapronto/${products[0].localImage || 'images/' + products[0].slug + '.webp'}` : ''}">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Materiais Pedagógicos BNCC 2026",
    "description": "${products.length} materiais pedagógicos alinhados à BNCC 2026. Planos de aula, atividades, avaliações e slides para professores.",
    "url": "https://planodeaulapronto.github.io/planodeaulapronto/",
    "numberOfItems": ${products.length},
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": ${products.length},
      "itemListElement": [
        ${products.slice(0, 30).map((p, i) => {
  const productUrl = `https://planodeaulapronto.github.io/planodeaulapronto/products/${p.slug}.html`;
  const productImg = `https://planodeaulapronto.github.io/planodeaulapronto/${p.localImage || 'images/' + p.slug + '.webp'}`;
  return `{
          "@type": "ListItem",
          "position": ${i + 1},
          "item": {
            "@type": "Product",
            "name": "${p.title.replace(/"/g, '\\"')}",
            "description": "${(p.description || '').replace(/"/g, '\\"').substring(0, 200)}",
            "url": "${productUrl}",
            "image": "${productImg}"${p.price ? `,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "BRL",
              "price": "${p.price.replace(',', '.')}",
              "availability": "https://schema.org/InStock"
            }` : ''}
          }
        }`;
}).join(',\n        ')}
      ]
    }
  }
  </script>

  <!-- FAQ Schema for SEO -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que são materiais pedagógicos BNCC 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "São planos de aula, atividades, avaliações e slides totalmente alinhados à Base Nacional Comum Curricular (BNCC) atualizada para 2026. Incluem materiais editáveis para Educação Infantil, Ensino Fundamental e Ensino Médio."
        }
      },
      {
        "@type": "Question",
        "name": "Os materiais são editáveis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Todos os ${products.length} materiais são editáveis em Word ou PowerPoint, permitindo que o professor personalize de acordo com a realidade da sua turma."
        }
      },
      {
        "@type": "Question",
        "name": "Para quais séries e disciplinas os materiais estão disponíveis?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Os materiais cobrem desde o Berçário até o Ensino Médio, incluindo todas as disciplinas: Português, Matemática, Ciências, História, Geografia, Arte, Educação Física, Inglês, Ensino Religioso, Filosofia, Sociologia, Física, Química e Biologia."
        }
      }
    ]
  }
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #6C63FF;
      --primary-dark: #5A52E0;
      --secondary: #FF6B9D;
      --accent: #00D4AA;
      --dark: #1a1a2e;
      --darker: #0f0f23;
      --card-bg: #ffffff;
      --text: #2d3748;
      --text-light: #718096;
      --radius: 16px;
      --shadow: 0 4px 20px rgba(0,0,0,0.08);
      --shadow-hover: 0 12px 40px rgba(0,0,0,0.15);
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: var(--text);
      background: #f8fafc;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* ===== HERO SECTION ===== */
    .hero {
      background: linear-gradient(135deg, var(--darker) 0%, #16213e 50%, #1a1a2e 100%);
      padding: 80px 20px 60px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(ellipse at center, rgba(108,99,255,0.15) 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 30%, rgba(255,107,157,0.1) 0%, transparent 50%),
                  radial-gradient(ellipse at 20% 70%, rgba(0,212,170,0.1) 0%, transparent 50%);
      animation: heroGlow 8s ease-in-out infinite alternate;
    }
    @keyframes heroGlow {
      0% { transform: scale(1) rotate(0deg); }
      100% { transform: scale(1.1) rotate(3deg); }
    }
    .hero-content { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; }
    .hero-badge {
      display: inline-block;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      padding: 8px 24px;
      border-radius: 30px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 24px;
      animation: fadeInUp 0.6s ease-out;
    }
    .hero h1 {
      font-family: 'Outfit', sans-serif;
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 800;
      color: white;
      line-height: 1.15;
      margin-bottom: 20px;
      animation: fadeInUp 0.6s ease-out 0.1s both;
    }
    .hero h1 span { background: linear-gradient(135deg, #6C63FF, #FF6B9D, #00D4AA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p {
      color: rgba(255,255,255,0.7);
      font-size: 1.15rem;
      max-width: 650px;
      margin: 0 auto 32px;
      animation: fadeInUp 0.6s ease-out 0.2s both;
    }
    .hero-stats {
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
      animation: fadeInUp 0.6s ease-out 0.3s both;
    }
    .stat { text-align: center; }
    .stat-number { font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 800; color: var(--accent); }
    .stat-label { color: rgba(255,255,255,0.6); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ===== NAVIGATION ===== */
    .cat-nav {
      background: white;
      padding: 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 20px rgba(0,0,0,0.06);
      border-bottom: 1px solid #edf2f7;
    }
    .cat-nav-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 4px;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e0 transparent;
    }
    .cat-nav-inner::-webkit-scrollbar { height: 4px; }
    .cat-nav-inner::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 4px; }
    .cat-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 18px;
      border-radius: 30px;
      color: white;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .cat-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.25); }
    .cat-count {
      background: rgba(255,255,255,0.3);
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.75rem;
    }

    /* ===== CATEGORY SECTIONS ===== */
    .category-section {
      max-width: 1400px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .category-header {
      padding: 24px 32px;
      border-radius: var(--radius) var(--radius) 0 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .category-header h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: white;
    }
    .section-count {
      background: rgba(255,255,255,0.25);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    /* ===== PRODUCT GRID ===== */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
      padding: 24px;
      background: #f1f5f9;
      border-radius: 0 0 var(--radius) var(--radius);
    }

    /* ===== PRODUCT CARD ===== */
    .product-card {
      background: var(--card-bg);
      border-radius: var(--radius);
      overflow: hidden;
      box-shadow: var(--shadow);
      transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex;
      flex-direction: column;
    }
    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-hover);
    }
    .card-image {
      position: relative;
      width: 100%;
      aspect-ratio: 4/3;
      overflow: hidden;
      background: #f7fafc;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .product-card:hover .card-image img { transform: scale(1.05); }
    .discount-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      box-shadow: 0 2px 8px rgba(239,68,68,0.4);
    }
    .card-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--dark);
      line-height: 1.3;
      margin-bottom: 8px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-desc {
      font-size: 0.85rem;
      color: var(--text-light);
      line-height: 1.5;
      margin-bottom: 16px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
    .card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #edf2f7;
    }
    .card-price {
      font-family: 'Outfit', sans-serif;
      font-size: 1.2rem;
      font-weight: 700;
      color: #16a34a;
    }
    .buy-btn {
      display: inline-flex;
      align-items: center;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white;
      padding: 10px 20px;
      border-radius: 30px;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.3s ease;
      white-space: nowrap;
    }
    .buy-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(108,99,255,0.4);
    }

    /* ===== SEARCH ===== */
    .search-container {
      max-width: 600px;
      margin: 0 auto 0;
      padding: 0 20px;
      animation: fadeInUp 0.6s ease-out 0.4s both;
    }
    .search-box {
      position: relative;
    }
    .search-box input {
      width: 100%;
      padding: 16px 24px 16px 50px;
      border: 2px solid rgba(255,255,255,0.15);
      border-radius: 50px;
      font-size: 1rem;
      background: rgba(255,255,255,0.1);
      color: white;
      backdrop-filter: blur(10px);
      outline: none;
      transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
    }
    .search-box input::placeholder { color: rgba(255,255,255,0.5); }
    .search-box input:focus { border-color: var(--primary); background: rgba(255,255,255,0.15); }
    .search-icon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      opacity: 0.5;
    }

    /* ===== BACK TO TOP ===== */
    .back-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(108,99,255,0.4);
      transition: all 0.3s ease;
      opacity: 0;
      visibility: hidden;
      z-index: 200;
    }
    .back-to-top.visible { opacity: 1; visibility: visible; }
    .back-to-top:hover { transform: translateY(-3px); box-shadow: 0 8px 30px rgba(108,99,255,0.5); }

    /* ===== FOOTER ===== */
    .footer {
      background: var(--darker);
      color: rgba(255,255,255,0.5);
      text-align: center;
      padding: 40px 20px;
      margin-top: 60px;
    }
    .footer p { font-size: 0.9rem; }
    .footer a { color: var(--accent); text-decoration: none; }

    /* ===== RESPONSIVE ===== */
    @media (max-width: 768px) {
      .hero { padding: 60px 16px 40px; }
      .hero-stats { gap: 24px; }
      .stat-number { font-size: 2rem; }
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; padding: 16px; }
      .category-header { padding: 18px 20px; }
      .category-header h2 { font-size: 1.2rem; }
      .card-footer { flex-direction: column; align-items: stretch; }
      .buy-btn { justify-content: center; }
    }
    @media (max-width: 480px) {
      .products-grid { grid-template-columns: 1fr; }
    }

    /* ===== NO RESULTS ===== */
    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: var(--text-light);
      display: none;
    }
    .no-results.show { display: block; }
    .no-results h3 { font-size: 1.3rem; margin-bottom: 8px; color: var(--text); }
  </style>
</head>
<body>

  <!-- HERO -->
  <header class="hero">
    <div class="hero-content">
      <div class="hero-badge">✨ Material Pedagógico Completo BNCC 2026</div>
      <h1>Tudo o que Você Precisa para <span>Transformar suas Aulas</span></h1>
      <p>Planos de aula, atividades, avaliações e slides prontos e alinhados à BNCC 2026. Da Educação Infantil ao Ensino Médio.</p>
      <div class="hero-stats">
        <div class="stat">
          <div class="stat-number">${products.length}</div>
          <div class="stat-label">Produtos</div>
        </div>
        <div class="stat">
          <div class="stat-number">${catOrder.filter(c => categories[c] && categories[c].length > 0).length}</div>
          <div class="stat-label">Categorias</div>
        </div>
        <div class="stat">
          <div class="stat-number">BNCC</div>
          <div class="stat-label">Alinhados</div>
        </div>
      </div>
      <br>
      <div class="search-container">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="searchInput" placeholder="Buscar produtos..." autocomplete="off">
        </div>
      </div>
    </div>
  </header>

  <!-- CATEGORY NAV -->
  <nav class="cat-nav">
    <div class="cat-nav-inner">
      ${generateCatNav()}
    </div>
  </nav>

  <!-- PRODUCT SECTIONS -->
  <main id="productsMain">
    ${generateSections()}
  </main>

  <!-- NO RESULTS -->
  <div class="no-results" id="noResults">
    <h3>😕 Nenhum produto encontrado</h3>
    <p>Tente buscar por outro termo</p>
  </div>

  <!-- BACK TO TOP -->
  <button class="back-to-top" id="backToTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">↑</button>

  <!-- FOOTER -->
  <footer class="footer">
    <p>© 2026 — Materiais Pedagógicos BNCC — Todos os direitos reservados</p>
  </footer>

  <script>
    // Back to top button
    window.addEventListener('scroll', () => {
      document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const sections = document.querySelectorAll('.category-section');
    const noResults = document.getElementById('noResults');
    
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
      let totalVisible = 0;
      
      sections.forEach(section => {
        const cards = section.querySelectorAll('.product-card');
        let sectionVisible = 0;
        
        cards.forEach(card => {
          const title = card.querySelector('.card-title').textContent.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
          const desc = card.querySelector('.card-desc').textContent.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');
          const match = !query || title.includes(query) || desc.includes(query);
          card.style.display = match ? '' : 'none';
          if (match) sectionVisible++;
        });
        
        section.style.display = sectionVisible > 0 ? '' : 'none';
        totalVisible += sectionVisible;
      });
      
      noResults.classList.toggle('show', totalVisible === 0 && query.length > 0);
    });

    // Smooth scroll for nav buttons
    document.querySelectorAll('.cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(btn.getAttribute('href'));
        if (target) {
          const navHeight = document.querySelector('.cat-nav').offsetHeight;
          window.scrollTo({ top: target.offsetTop - navHeight - 10, behavior: 'smooth' });
        }
      });
    });
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('\\nLanding page generated: index.html');
console.log(`Total size: ${(Buffer.byteLength(html) / 1024).toFixed(0)} KB`);

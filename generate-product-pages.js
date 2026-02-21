const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const USERNAME = 'planodeaulapronto';
const REPO = 'planodeaulapronto';
const BASE_URL = `https://${USERNAME}.github.io/${REPO}`;

console.log(`Loaded ${products.length} products`);

// Categorize products (same logic as generate-landing.js)
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

// Group products by category for related products
const categorized = {};
products.forEach(p => {
  const cat = categorize(p.slug);
  if (!categorized[cat]) categorized[cat] = [];
  categorized[cat].push(p);
});

const cssStyles = `
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
    body { font-family: 'Inter', -apple-system, sans-serif; color: var(--text); background: #f8fafc; line-height: 1.6; }
    .hero { background: linear-gradient(135deg, var(--darker) 0%, #16213e 50%, #1a1a2e 100%); padding: 40px 20px 30px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(ellipse at center, rgba(108,99,255,0.15) 0%, transparent 60%); }
    .hero-content { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; }
    .hero-badge { display: inline-block; color: white; padding: 8px 24px; border-radius: 30px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
    .hero h1 { font-family: 'Outfit', sans-serif; font-size: clamp(1.4rem, 3vw, 2rem); font-weight: 800; color: white; line-height: 1.2; margin-bottom: 8px; }
    .hero h1 span { background: linear-gradient(135deg, #6C63FF, #FF6B9D, #00D4AA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .breadcrumb { max-width: 1000px; margin: 20px auto 0; padding: 0 20px; font-size: 0.85rem; color: var(--text-light); }
    .breadcrumb a { color: var(--primary); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .product-detail { max-width: 1000px; margin: 30px auto; padding: 0 20px; }
    .product-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; background: white; border-radius: var(--radius); padding: 32px; box-shadow: var(--shadow); }
    .product-image-container { position: relative; }
    .product-image-container img { width: 100%; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .product-info { display: flex; flex-direction: column; }
    .product-info h2 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 700; color: var(--dark); margin-bottom: 16px; line-height: 1.3; }
    .product-description { color: var(--text-light); line-height: 1.8; margin-bottom: 24px; font-size: 0.95rem; flex: 1; }
    .product-features { list-style: none; margin: 0 0 24px 0; padding: 0; }
    .product-features li { padding: 10px 0; border-bottom: 1px solid #edf2f7; font-size: 0.9rem; color: var(--text); }
    .product-price { font-family: 'Outfit', sans-serif; font-size: 2rem; color: #16a34a; font-weight: 700; margin-bottom: 20px; }
    .buy-btn-large { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 16px 32px; font-size: 1.1rem; font-weight: 700; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; border-radius: 30px; text-decoration: none; transition: all 0.3s ease; }
    .buy-btn-large:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(108,99,255,0.4); }
    .related-section { max-width: 1000px; margin: 50px auto; padding: 0 20px; }
    .related-section h2 { font-family: 'Outfit', sans-serif; font-size: 1.4rem; margin-bottom: 20px; color: var(--dark); }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
    .product-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: all 0.35s ease; display: flex; flex-direction: column; }
    .product-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
    .card-image { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #f7fafc; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .product-card:hover .card-image img { transform: scale(1.05); }
    .card-body { padding: 16px; display: flex; flex-direction: column; flex: 1; }
    .card-title { font-family: 'Outfit', sans-serif; font-size: 0.9rem; font-weight: 700; color: var(--dark); line-height: 1.3; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 12px; border-top: 1px solid #edf2f7; margin-top: auto; }
    .card-price { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; color: #16a34a; }
    .buy-btn { display: inline-flex; align-items: center; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 8px 16px; border-radius: 30px; text-decoration: none; font-size: 0.8rem; font-weight: 600; transition: all 0.3s ease; white-space: nowrap; }
    .buy-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(108,99,255,0.4); }
    .footer { background: var(--darker); color: rgba(255,255,255,0.5); text-align: center; padding: 40px 20px; margin-top: 60px; }
    .footer a { color: var(--accent); text-decoration: none; }
    @media (max-width: 768px) {
      .product-layout { grid-template-columns: 1fr; gap: 24px; padding: 20px; }
      .related-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); }
    }
    @media (max-width: 480px) {
      .related-grid { grid-template-columns: 1fr; }
      .card-footer { flex-direction: column; align-items: stretch; }
      .buy-btn { justify-content: center; }
    }
`;

function generateProductPage(product, relatedProducts) {
  const category = categorize(product.slug);
  const colors = catColors[category];
  const icon = catIcons[category];
  const categoryId = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase();
  const url = `${BASE_URL}/products/${product.slug}.html`;

  // Local image
  const imgSrc = `../images/${(product.localImage || `images/${product.slug}.webp`).replace('images/', '')}`;
  const imgAbsolute = `${BASE_URL}/${product.localImage || 'images/' + product.slug + '.webp'}`;

  // Hotmart link - force ?src=github
  let buyLink = product.hotmartLink || product.link || '';
  if (buyLink.includes('go.hotmart.com')) {
    buyLink = buyLink.split('?')[0] + '?src=github';
  }

  const price = product.price ? `R$ ${product.price}` : '';
  const title = product.title.replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const titleJson = product.title.replace(/"/g, '\\"');
  const descRaw = product.description || '';
  const descClean = descRaw.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').trim();
  const metaDesc = descClean.substring(0, 160) || `${product.title} - Material pedagógico alinhado à BNCC 2026. Editável e pronto para uso em sala de aula.`;

  const imgFallback = `this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><rect fill=%22%23f0f0f0%22 width=%22400%22 height=%22400%22/><text x=%22200%22 y=%22200%22 text-anchor=%22middle%22 fill=%22%23999%22 font-size=%2216%22>Sem Imagem</text></svg>';`;

  // Related product cards (max 4, same category)
  const relatedCards = relatedProducts.slice(0, 4).map(p => {
    const rTitle = p.title.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const rImg = `../images/${(p.localImage || `images/${p.slug}.webp`).replace('images/', '')}`;
    const rPrice = p.price ? `R$ ${p.price}` : '';
    return `
          <div class="product-card">
            <div class="card-image">
              <img src="${rImg}" alt="${rTitle}" loading="lazy" onerror="${imgFallback}">
            </div>
            <div class="card-body">
              <h3 class="card-title">${rTitle}</h3>
              <div class="card-footer">
                ${rPrice ? `<span class="card-price">${rPrice}</span>` : ''}
                <a href="${p.slug}.html" class="buy-btn">Ver Detalhes</a>
              </div>
            </div>
          </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Material BNCC 2026</title>
  <meta name="description" content="${metaDesc.replace(/"/g, '&quot;')}">
  <meta name="keywords" content="${product.title.toLowerCase().replace(/[|]/g, ',').replace(/\s+/g, ' ')}, BNCC 2026, material pedagógico, plano de aula">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${url}">

  <meta property="og:type" content="product">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${metaDesc.replace(/"/g, '&quot;')}">
  <meta property="og:image" content="${imgAbsolute}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Materiais Pedagógicos BNCC 2026">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${metaDesc.replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="${imgAbsolute}">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "${titleJson}",
    "description": "${descClean.substring(0, 300).replace(/"/g, '\\"')}",
    "url": "${url}",
    "image": "${imgAbsolute}",
    "brand": {
      "@type": "Brand",
      "name": "Materiais Pedagógicos BNCC"
    },
    "category": "${category}"${product.price ? `,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BRL",
      "price": "${product.price.replace(',', '.')}",
      "availability": "https://schema.org/InStock",
      "url": "${buyLink}",
      "seller": {
        "@type": "Organization",
        "name": "Diário da Educação"
      }
    }` : ''}
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Materiais Pedagógicos BNCC 2026", "item": "${BASE_URL}/" },
      { "@type": "ListItem", "position": 2, "name": "${category}", "item": "${BASE_URL}/#${categoryId}" },
      { "@type": "ListItem", "position": 3, "name": "${titleJson.substring(0, 60)}" }
    ]
  }
  </script>

  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${cssStyles}</style>
</head>
<body>
  <header class="hero">
    <div class="hero-content">
      <div class="hero-badge" style="background: ${colors.gradient}">${icon} ${category}</div>
      <h1>${title}</h1>
    </div>
  </header>

  <div class="breadcrumb">
    <a href="../index.html">Todos os Materiais (${products.length})</a> &rsaquo;
    <a href="../index.html#${categoryId}">${category}</a> &rsaquo;
    ${product.title.substring(0, 50)}${product.title.length > 50 ? '...' : ''}
  </div>

  <div class="product-detail">
    <div class="product-layout">
      <div class="product-image-container">
        <img src="${imgSrc}" alt="${title}" onerror="${imgFallback}">
      </div>
      <div class="product-info">
        <h2>${product.title}</h2>
        <p class="product-description">${descClean}</p>
        <ul class="product-features">
          <li>Alinhado à BNCC 2026</li>
          <li>Material editável (Word/PowerPoint)</li>
          <li>Acesso vitalício após compra</li>
          <li>Pronto para uso em sala de aula</li>
        </ul>
        ${price ? `<div class="product-price">${price}</div>` : ''}
        <a href="${buyLink}" target="_blank" rel="noopener" class="buy-btn-large">
          Comprar Agora &rarr;
        </a>
      </div>
    </div>
  </div>

  ${relatedCards.length > 0 ? `
  <section class="related-section">
    <h2>Produtos Relacionados</h2>
    <div class="related-grid">${relatedCards}
    </div>
  </section>` : ''}

  <footer class="footer">
    <p>&copy; 2026 Materiais Pedagógicos BNCC 2026 &mdash; <a href="../index.html">Ver todos os ${products.length} produtos</a></p>
  </footer>
</body>
</html>`;
}

// Create output directory
const outputDir = path.join(__dirname, 'products');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Generate all product pages
products.forEach((product, idx) => {
  const category = categorize(product.slug);
  const related = (categorized[category] || []).filter(p => p.slug !== product.slug);
  const html = generateProductPage(product, related);
  fs.writeFileSync(path.join(outputDir, `${product.slug}.html`), html);
  if ((idx + 1) % 50 === 0) console.log(`Generated ${idx + 1}/${products.length} product pages`);
});

console.log(`\nGenerated ${products.length} individual product pages in products/`);

const fs = require('fs');
const path = require('path');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const USERNAME = 'planodeaulapronto';
const REPO = 'planodeaulapronto';
const BASE_URL = `https://${USERNAME}.github.io/${REPO}`;

// Define discipline/keyword pages
const pages = [
  {
    slug: 'plano-de-aula-portugues',
    title: 'Plano de Aula Português BNCC 2026 | Atividades e Planejamentos Prontos',
    h1: 'Plano de Aula <span>Português BNCC 2026</span>',
    description: 'Planos de aula prontos de Português/Língua Portuguesa alinhados à BNCC 2026. Planejamentos, atividades e avaliações do 1º ao 9º ano e Ensino Médio. Material editável!',
    keywords: 'plano de aula português, atividades português BNCC, planejamento português ensino fundamental, plano de aula língua portuguesa, atividades de português prontas',
    badge: '📝 Planos de Português BNCC 2026',
    filter: s => s.includes('portugues') || s.includes('lingua-portuguesa') || s.includes('producao-interpretacao-texto')
  },
  {
    slug: 'plano-de-aula-matematica',
    title: 'Plano de Aula Matemática BNCC 2026 | Atividades e Planejamentos Prontos',
    h1: 'Plano de Aula <span>Matemática BNCC 2026</span>',
    description: 'Planos de aula prontos de Matemática alinhados à BNCC 2026. Planejamentos, atividades e avaliações do 1º ao 9º ano e Ensino Médio. Material editável para professores!',
    keywords: 'plano de aula matemática, atividades matemática BNCC, planejamento matemática ensino fundamental, atividades de matemática prontas, exercícios matemática',
    badge: '🔢 Planos de Matemática BNCC 2026',
    filter: s => s.includes('matematica') && !s.includes('kit-matematica')
  },
  {
    slug: 'plano-de-aula-ciencias',
    title: 'Plano de Aula Ciências BNCC 2026 | Atividades e Planejamentos Prontos',
    h1: 'Plano de Aula <span>Ciências BNCC 2026</span>',
    description: 'Planos de aula prontos de Ciências alinhados à BNCC 2026. Planejamentos, atividades e avaliações do 1º ao 9º ano. Material editável para professores!',
    keywords: 'plano de aula ciências, atividades ciências BNCC, planejamento ciências ensino fundamental, atividades de ciências prontas',
    badge: '🔬 Planos de Ciências BNCC 2026',
    filter: s => s.includes('ciencias')
  },
  {
    slug: 'plano-de-aula-historia',
    title: 'Plano de Aula História BNCC 2026 | Atividades e Planejamentos Prontos',
    h1: 'Plano de Aula <span>História BNCC 2026</span>',
    description: 'Planos de aula prontos de História alinhados à BNCC 2026. Planejamentos, atividades e avaliações do 1º ao 9º ano e Ensino Médio. Material editável!',
    keywords: 'plano de aula história, atividades história BNCC, planejamento história ensino fundamental, atividades de história prontas',
    badge: '📜 Planos de História BNCC 2026',
    filter: s => s.includes('historia')
  },
  {
    slug: 'plano-de-aula-geografia',
    title: 'Plano de Aula Geografia BNCC 2026 | Atividades e Planejamentos Prontos',
    h1: 'Plano de Aula <span>Geografia BNCC 2026</span>',
    description: 'Planos de aula prontos de Geografia alinhados à BNCC 2026. Planejamentos, atividades e avaliações do 1º ao 9º ano e Ensino Médio. Material editável!',
    keywords: 'plano de aula geografia, atividades geografia BNCC, planejamento geografia ensino fundamental, atividades de geografia prontas',
    badge: '🌍 Planos de Geografia BNCC 2026',
    filter: s => s.includes('geografia')
  },
  {
    slug: 'plano-de-aula-ingles',
    title: 'Plano de Aula Inglês BNCC 2026 | Atividades e Planejamentos Prontos',
    h1: 'Plano de Aula <span>Inglês BNCC 2026</span>',
    description: 'Planos de aula prontos de Inglês alinhados à BNCC 2026. Planejamentos, atividades e avaliações para Ensino Fundamental e Médio. Material editável!',
    keywords: 'plano de aula inglês, atividades inglês BNCC, planejamento inglês ensino fundamental, atividades de inglês prontas, plano de aula inglês ensino médio',
    badge: '🇬🇧 Planos de Inglês BNCC 2026',
    filter: s => s.includes('ingles') && !s.includes('espanhol')
  },
  {
    slug: 'plano-de-aula-arte',
    title: 'Plano de Aula Arte BNCC 2026 | Atividades e Planejamentos Prontos',
    h1: 'Plano de Aula <span>Arte BNCC 2026</span>',
    description: 'Planos de aula prontos de Arte alinhados à BNCC 2026. Planejamentos, atividades e avaliações para Ensino Fundamental e Médio. Material editável!',
    keywords: 'plano de aula arte, atividades arte BNCC, planejamento arte ensino fundamental, atividades de arte prontas',
    badge: '🎨 Planos de Arte BNCC 2026',
    filter: s => s.includes('-arte-') || s.includes('artes')
  },
  {
    slug: 'plano-de-aula-educacao-fisica',
    title: 'Plano de Aula Educação Física BNCC 2026 | Planejamentos Prontos',
    h1: 'Plano de Aula <span>Educação Física BNCC 2026</span>',
    description: 'Planos de aula prontos de Educação Física alinhados à BNCC 2026. Planejamentos e atividades para Ensino Fundamental e Médio. Material editável!',
    keywords: 'plano de aula educação física, atividades educação física BNCC, planejamento educação física, atividades de educação física prontas',
    badge: '⚽ Planos de Educação Física BNCC 2026',
    filter: s => s.includes('educacao-fisica')
  },
  {
    slug: 'plano-de-aula-ensino-religioso',
    title: 'Plano de Aula Ensino Religioso BNCC 2026 | Planejamentos Prontos',
    h1: 'Plano de Aula <span>Ensino Religioso BNCC 2026</span>',
    description: 'Planos de aula prontos de Ensino Religioso alinhados à BNCC 2026. Planejamentos e atividades para Ensino Fundamental. Material editável!',
    keywords: 'plano de aula ensino religioso, atividades ensino religioso BNCC, planejamento ensino religioso',
    badge: '🙏 Planos de Ensino Religioso BNCC 2026',
    filter: s => s.includes('ensino-religioso') || s.includes('biblicas')
  },
  {
    slug: 'plano-de-aula-ensino-medio',
    title: 'Plano de Aula Ensino Médio BNCC 2026 | Todas as Disciplinas Prontos',
    h1: 'Planos de Aula <span>Ensino Médio BNCC 2026</span>',
    description: 'Planos de aula prontos para Ensino Médio alinhados à BNCC 2026. Todas as disciplinas: Português, Matemática, Física, Química, Biologia, História, Geografia, Filosofia, Sociologia. Editáveis!',
    keywords: 'plano de aula ensino médio, atividades ensino médio BNCC 2026, planejamento ensino médio, novo ensino médio BNCC, plano de aula ensino médio todas disciplinas',
    badge: '🎓 Planos Ensino Médio BNCC 2026',
    filter: s => s.includes('ensino-medio') || s.includes('novo-ensino-medio')
  },
  {
    slug: 'plano-de-aula-educacao-infantil',
    title: 'Plano de Aula Educação Infantil 2026 | Berçário, Maternal e Pré-escola',
    h1: 'Planos de Aula <span>Educação Infantil 2026</span>',
    description: 'Planos de aula prontos para Educação Infantil alinhados à BNCC 2026. Planejamento diário para Berçário, Maternal I e II, Pré-escola. Cartas de intenção e projetos.',
    keywords: 'plano de aula educação infantil, planejamento educação infantil 2026, plano de aula berçário, plano de aula maternal, plano de aula pré-escola, atividades educação infantil BNCC',
    badge: '🧒 Planos Educação Infantil 2026',
    filter: s => s.includes('bercario') || s.includes('maternal') || s.includes('pre-escola') || s.includes('educacao-infantil') || s.includes('cartas-de-intencao')
  },
  {
    slug: 'plano-de-aula-1-ao-5-ano',
    title: 'Plano de Aula 1º ao 5º Ano BNCC 2026 | Ensino Fundamental I Pronto',
    h1: 'Planos de Aula <span>1º ao 5º Ano BNCC 2026</span>',
    description: 'Planos de aula prontos do 1º ao 5º ano do Ensino Fundamental alinhados à BNCC 2026. Todas as disciplinas com atividades, avaliações e slides. Material editável!',
    keywords: 'plano de aula 1 ao 5 ano, atividades ensino fundamental 1, planejamento 1 ano, plano de aula 2 ano, plano de aula 3 ano, plano de aula 4 ano, plano de aula 5 ano, atividades BNCC anos iniciais',
    badge: '📚 Planos 1º ao 5º Ano BNCC 2026',
    filter: s => s.includes('1o-ao-5o') || s.includes('1-ao-5') || s.includes('anos-iniciais') || s.match(/[1-5]o?-ano/) && !s.includes('ensino-medio')
  },
  {
    slug: 'plano-de-aula-6-ao-9-ano',
    title: 'Plano de Aula 6º ao 9º Ano BNCC 2026 | Ensino Fundamental II Pronto',
    h1: 'Planos de Aula <span>6º ao 9º Ano BNCC 2026</span>',
    description: 'Planos de aula prontos do 6º ao 9º ano do Ensino Fundamental II alinhados à BNCC 2026. Todas as disciplinas com atividades, avaliações e slides. Material editável!',
    keywords: 'plano de aula 6 ao 9 ano, atividades ensino fundamental 2, planejamento 6 ano, plano de aula 7 ano, plano de aula 8 ano, plano de aula 9 ano, atividades BNCC anos finais',
    badge: '📖 Planos 6º ao 9º Ano BNCC 2026',
    filter: s => s.includes('6o-ao-9o') || s.includes('6-ao-9') || s.includes('fundamental-2')
  },
  {
    slug: 'atividades-educacao-especial',
    title: 'Atividades Educação Especial 2026 | TDAH, Autismo, Dislexia, Libras',
    h1: 'Atividades <span>Educação Especial 2026</span>',
    description: 'Atividades prontas para Educação Especial e Inclusiva. Material para TDAH, Autismo, Dislexia, Síndrome de Down, Libras e AEE. Editável e pronto para uso!',
    keywords: 'atividades educação especial, atividades TDAH, atividades autismo, atividades dislexia, material educação inclusiva, AEE atividades, libras atividades, síndrome de down atividades',
    badge: '💙 Atividades Educação Especial',
    filter: s => s.includes('educacao-especial') || s.includes('tdah') || s.includes('autismo') || s.includes('dislexia') || s.includes('libras') || s.includes('sindrome-down') || s.includes('aee') || s.includes('estimulacao-cognitiva')
  },
  {
    slug: 'slides-de-aula-prontos',
    title: 'Slides de Aula Prontos BNCC 2026 | Apresentações para Professores',
    h1: 'Slides de Aula <span>Prontos BNCC 2026</span>',
    description: 'Slides de aula prontos e animados alinhados à BNCC 2026. Apresentações editáveis para todas as disciplinas do Ensino Fundamental e Médio. Use nas suas aulas!',
    keywords: 'slides de aula prontos, apresentações para professores, slides BNCC 2026, slides animados aula, slides educação, powerpoint aula, slides para professores',
    badge: '📊 Slides de Aula Prontos BNCC 2026',
    filter: s => s.includes('slides') || s.includes('slide')
  },
  {
    slug: 'plano-de-aula-biologia',
    title: 'Plano de Aula Biologia Ensino Médio BNCC 2026 | Planejamentos Prontos',
    h1: 'Plano de Aula <span>Biologia BNCC 2026</span>',
    description: 'Planos de aula prontos de Biologia para Ensino Médio alinhados à BNCC 2026. Planejamentos, atividades e avaliações. Material editável e completo!',
    keywords: 'plano de aula biologia, atividades biologia ensino médio, planejamento biologia BNCC, biologia ensino médio 2026',
    badge: '🧬 Planos de Biologia BNCC 2026',
    filter: s => s.includes('biologia')
  },
  {
    slug: 'plano-de-aula-fisica-quimica',
    title: 'Plano de Aula Física e Química Ensino Médio BNCC 2026 | Prontos',
    h1: 'Planos de Aula <span>Física e Química BNCC 2026</span>',
    description: 'Planos de aula prontos de Física e Química para Ensino Médio alinhados à BNCC 2026. Planejamentos, atividades e avaliações editáveis!',
    keywords: 'plano de aula física, plano de aula química, atividades física ensino médio, atividades química ensino médio, planejamento física BNCC, planejamento química BNCC',
    badge: '⚛️ Planos de Física e Química BNCC 2026',
    filter: s => s.includes('fisica') || s.includes('quimica')
  },
  {
    slug: 'plano-de-aula-filosofia-sociologia',
    title: 'Plano de Aula Filosofia e Sociologia Ensino Médio BNCC 2026',
    h1: 'Planos de Aula <span>Filosofia e Sociologia BNCC 2026</span>',
    description: 'Planos de aula prontos de Filosofia e Sociologia para Ensino Médio alinhados à BNCC 2026. Planejamentos, atividades e avaliações editáveis!',
    keywords: 'plano de aula filosofia, plano de aula sociologia, atividades filosofia ensino médio, atividades sociologia ensino médio, planejamento filosofia BNCC',
    badge: '💡 Planos de Filosofia e Sociologia BNCC 2026',
    filter: s => s.includes('filosofia') || s.includes('sociologia')
  }
];

// CSS and base HTML template
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
    .hero { background: linear-gradient(135deg, var(--darker) 0%, #16213e 50%, #1a1a2e 100%); padding: 60px 20px 50px; text-align: center; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: radial-gradient(ellipse at center, rgba(108,99,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(255,107,157,0.1) 0%, transparent 50%); animation: heroGlow 8s ease-in-out infinite alternate; }
    @keyframes heroGlow { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }
    .hero-content { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; }
    .hero-badge { display: inline-block; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 8px 24px; border-radius: 30px; font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; }
    .hero h1 { font-family: 'Outfit', sans-serif; font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 800; color: white; line-height: 1.15; margin-bottom: 16px; }
    .hero h1 span { background: linear-gradient(135deg, #6C63FF, #FF6B9D, #00D4AA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .hero p { color: rgba(255,255,255,0.7); font-size: 1.1rem; max-width: 650px; margin: 0 auto 24px; }
    .hero-stats { display: flex; justify-content: center; gap: 40px; flex-wrap: wrap; }
    .stat { text-align: center; }
    .stat-number { font-family: 'Outfit', sans-serif; font-size: 2.2rem; font-weight: 800; color: var(--accent); }
    .stat-label { color: rgba(255,255,255,0.6); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px; }
    .breadcrumb { max-width: 1200px; margin: 20px auto 0; padding: 0 20px; font-size: 0.85rem; color: var(--text-light); }
    .breadcrumb a { color: var(--primary); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .products-grid { max-width: 1200px; margin: 30px auto; padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .product-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); display: flex; flex-direction: column; }
    .product-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); }
    .card-image { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #f7fafc; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .product-card:hover .card-image img { transform: scale(1.05); }
    .discount-badge { position: absolute; top: 12px; right: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; }
    .card-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
    .card-title { font-family: 'Outfit', sans-serif; font-size: 1rem; font-weight: 700; color: var(--dark); line-height: 1.3; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-desc { font-size: 0.85rem; color: var(--text-light); line-height: 1.5; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding-top: 16px; border-top: 1px solid #edf2f7; }
    .card-price { font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 700; color: #16a34a; }
    .buy-btn { display: inline-flex; align-items: center; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 0.85rem; font-weight: 600; transition: all 0.3s ease; white-space: nowrap; }
    .buy-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 15px rgba(108,99,255,0.4); }
    .back-link { display: inline-flex; align-items: center; gap: 8px; color: var(--primary); text-decoration: none; font-weight: 600; padding: 20px; max-width: 1200px; margin: 0 auto; }
    .back-link:hover { text-decoration: underline; }
    .other-pages { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
    .other-pages h2 { font-family: 'Outfit', sans-serif; font-size: 1.4rem; margin-bottom: 16px; color: var(--dark); }
    .pages-grid { display: flex; flex-wrap: wrap; gap: 10px; }
    .page-link { display: inline-block; padding: 8px 18px; background: white; border-radius: 30px; text-decoration: none; color: var(--primary); font-size: 0.85rem; font-weight: 500; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.3s ease; }
    .page-link:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.12); background: var(--primary); color: white; }
    .footer { background: var(--darker); color: rgba(255,255,255,0.5); text-align: center; padding: 40px 20px; margin-top: 60px; }
    .footer a { color: var(--accent); text-decoration: none; }
    @media (max-width: 768px) {
      .hero { padding: 40px 16px 30px; }
      .products-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
      .card-footer { flex-direction: column; align-items: stretch; }
      .buy-btn { justify-content: center; }
    }
    @media (max-width: 480px) { .products-grid { grid-template-columns: 1fr; } }
`;

function generatePage(page, matchedProducts, allPages) {
  const url = `${BASE_URL}/${page.slug}.html`;

  const productCards = matchedProducts.map(p => {
    const title = p.title.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const desc = (p.description || '').substring(0, 120).replace(/"/g, '&quot;').replace(/</g, '&lt;');
    // Use local images (relative path from discipline-pages/ to images/)
    const imgSrc = `../images/${(p.localImage || 'images/' + p.slug + '.webp').replace('images/', '')}`;

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
              <a href="../products/${p.slug}.html" class="buy-btn">Ver Produto →</a>
            </div>
          </div>
        </div>`;
  }).join('');

  const otherPages = allPages.filter(p => p.slug !== page.slug && p.count > 0).map(p =>
    `<a href="${p.slug}.html" class="page-link">${p.title.split('|')[0].trim()} (${p.count})</a>`
  ).join('\n            ');

  // Schema.org for this specific page
  const schemaProducts = matchedProducts.slice(0, 10).map((p, i) => `{
          "@type": "ListItem",
          "position": ${i + 1},
          "item": {
            "@type": "Product",
            "name": "${p.title.replace(/"/g, '\\"')}",
            "description": "${(p.description || '').replace(/"/g, '\\"').substring(0, 200)}",
            "url": "${BASE_URL}/products/${p.slug}.html",
            "image": "${BASE_URL}/${p.localImage || 'images/' + p.slug + '.webp'}"${p.price ? `,
            "offers": {
              "@type": "Offer",
              "priceCurrency": "BRL",
              "price": "${p.price.replace(',', '.')}",
              "availability": "https://schema.org/InStock"
            }` : ''}
          }
        }`).join(',\n        ');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="keywords" content="${page.keywords}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:image" content="${matchedProducts[0] ? `${BASE_URL}/${matchedProducts[0].localImage || 'images/' + matchedProducts[0].slug + '.webp'}` : ''}">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.title}">
  <meta name="twitter:description" content="${page.description}">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "${page.title.split('|')[0].trim()}",
    "description": "${page.description}",
    "url": "${url}",
    "numberOfItems": ${matchedProducts.length},
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": ${matchedProducts.length},
      "itemListElement": [
        ${schemaProducts}
      ]
    }
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Materiais Pedagógicos BNCC 2026", "item": "${BASE_URL}/" },
      { "@type": "ListItem", "position": 2, "name": "${page.title.split('|')[0].trim()}" }
    ]
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que inclui o material de ${page.title.split('|')[0].trim()}?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Inclui planos de aula, atividades e avaliações totalmente alinhados à BNCC 2026. Todos os materiais são 100% editáveis em Word ou PowerPoint."
        }
      },
      {
        "@type": "Question",
        "name": "O material é atualizado para a BNCC 2026?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Todo o conteúdo foi desenvolvido e atualizado de acordo com a Base Nacional Comum Curricular (BNCC) 2026, com códigos e habilidades corretos."
        }
      }
    ]
  }
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>${cssStyles}</style>
</head>
<body>
  <header class="hero">
    <div class="hero-content">
      <div class="hero-badge">${page.badge}</div>
      <h1>${page.h1}</h1>
      <p>${page.description}</p>
      <div class="hero-stats">
        <div class="stat">
          <div class="stat-number">${matchedProducts.length}</div>
          <div class="stat-label">Produtos</div>
        </div>
        <div class="stat">
          <div class="stat-number">BNCC</div>
          <div class="stat-label">Alinhados</div>
        </div>
        <div class="stat">
          <div class="stat-number">✏️</div>
          <div class="stat-label">Editáveis</div>
        </div>
      </div>
    </div>
  </header>

  <nav class="breadcrumb">
    <a href="index.html">← Todos os Materiais (${products.length})</a> / ${page.title.split('|')[0].trim()}
  </nav>

  <div class="products-grid">
    ${productCards}
  </div>

  <section class="other-pages">
    <h2>📚 Veja também outros materiais:</h2>
    <div class="pages-grid">
      <a href="index.html" class="page-link">📋 Todos os Materiais (${products.length})</a>
      ${otherPages}
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 — Plano de Aula Pronto BNCC 2026 — Materiais Pedagógicos</p>
  </footer>
</body>
</html>`;
}

// Process each page
const outputDir = path.join(__dirname, 'discipline-pages');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const pageResults = pages.map(page => {
  const matched = products.filter(p => page.filter(p.slug));
  return { ...page, count: matched.length, products: matched };
});

// Also generate a main index that links to all discipline pages
let mainNavLinks = '';

pageResults.forEach(page => {
  if (page.count === 0) {
    console.log(`⚠️  ${page.slug}: 0 products, skipping`);
    return;
  }

  const html = generatePage(page, page.products, pageResults);
  fs.writeFileSync(path.join(outputDir, `${page.slug}.html`), html);
  console.log(`✅ ${page.slug}.html: ${page.count} products`);
  mainNavLinks += `  <li><a href="${page.slug}.html">${page.title.split('|')[0].trim()} (${page.count} produtos)</a></li>\n`;
});

// Generate sitemap with all pages
const today = new Date().toISOString().split('T')[0];
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

pageResults.filter(p => p.count > 0).forEach(page => {
  sitemapXml += `
  <url>
    <loc>${BASE_URL}/${page.slug}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
});

sitemapXml += `\n</urlset>`;
fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), sitemapXml);
console.log(`\n✅ sitemap.xml with ${pageResults.filter(p => p.count > 0).length + 1} URLs`);

// Generate robots.txt
fs.writeFileSync(path.join(outputDir, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`);
console.log(`✅ robots.txt`);

console.log(`\n🎉 Generated ${pageResults.filter(p => p.count > 0).length} discipline pages in discipline-pages/`);
console.log(`Total products covered: ${new Set(pageResults.flatMap(p => p.products.map(x => x.slug))).size} unique products`);

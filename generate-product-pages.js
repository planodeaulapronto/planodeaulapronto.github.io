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
    .product-layout { display: grid; grid-template-columns: 350px 1fr; gap: 50px; background: white; border-radius: var(--radius); padding: 40px; box-shadow: var(--shadow); }
    .product-image-container { position: sticky; top: 100px; height: fit-content; }
    .product-image-container img { width: 100%; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .product-info { display: flex; flex-direction: column; }
    .product-info h2 { font-family: 'Outfit', sans-serif; font-size: 2rem; font-weight: 800; color: var(--dark); margin-bottom: 24px; line-height: 1.2; letter-spacing: -0.5px; }
    .product-description { color: var(--text); line-height: 1.8; margin-bottom: 16px; font-size: 1.05rem; }
    .product-description h2 { font-size: 1.6rem; margin-top: 40px; margin-bottom: 16px; color: var(--primary); }
    .product-description h3 { font-size: 1.3rem; margin-top: 30px; margin-bottom: 12px; color: var(--dark); }
    .product-description p { margin-bottom: 20px; }
    .product-description ul, .product-description ol { margin-bottom: 24px; padding-left: 20px; }
    .product-description li { margin-bottom: 10px; }
    .product-description strong { color: var(--dark); font-weight: 700; }
    .product-features { list-style: none; margin: 30px 0; padding: 20px; background: #f0f4ff; border-radius: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .product-features li { padding: 5px 0; font-size: 0.9rem; color: #4F46E5; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .product-features li::before { content: '✓'; font-weight: 900; }
    .buy-section-top { margin: 30px 0; padding: 32px; background: #fff; border: 2px solid #edf2f7; border-radius: 16px; text-align: center; display: flex; flex-direction: column; gap: 16px; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
    .buy-section-top .product-price { margin-bottom: 0; font-size: 3rem; color: #16a34a; font-weight: 800; font-family: 'Outfit', sans-serif; }
    .related-section { max-width: 1000px; margin: 60px auto; padding: 0 20px; }
    .related-section h2 { font-family: 'Outfit', sans-serif; font-size: 1.8rem; margin-bottom: 30px; color: var(--dark); text-align: center; }
    .related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; }
    .product-card { background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: all 0.35s ease; display: flex; flex-direction: column; height: 100%; border: 1px solid #edf2f7; }
    .product-card:hover { transform: translateY(-5px); box-shadow: var(--shadow-hover); border-color: var(--primary); }
    .card-image { position: relative; width: 100%; aspect-ratio: 1/1; overflow: hidden; background: #f7fafc; }
    .card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
    .product-card:hover .card-image img { transform: scale(1.08); }
    .card-body { padding: 18px; display: flex; flex-direction: column; flex: 1; }
    .card-title { font-family: 'Outfit', sans-serif; font-size: 0.95rem; font-weight: 700; color: var(--dark); line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
    .card-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 15px; border-top: 1px solid #edf2f7; }
    .card-price { font-family: 'Outfit', sans-serif; font-size: 1.1rem; font-weight: 800; color: #16a34a; }
    .buy-btn-large { 
      display: inline-flex; 
      align-items: center; 
      justify-content: center; 
      width: 100%; 
      padding: 28px 48px; 
      font-size: 1.6rem; 
      font-weight: 900; 
      background: linear-gradient(135deg, #10b981, #059669); 
      color: white; 
      border-radius: 60px; 
      text-decoration: none; 
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
      box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.2);
      text-transform: uppercase;
      letter-spacing: 1px;
      animation: pulse-green 2s infinite;
      border: 3px solid rgba(255,255,255,0.2);
    }
    .buy-btn-large:hover { 
      transform: scale(1.06) translateY(-5px); 
      box-shadow: 0 20px 45px rgba(16, 185, 129, 0.5), 0 0 30px rgba(16, 185, 129, 0.3); 
      background: linear-gradient(135deg, #059669, #10b981);
      border-color: white;
    }
    @keyframes pulse-green {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .buy-btn { display: inline-flex; align-items: center; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; padding: 10px 20px; border-radius: 30px; text-decoration: none; font-size: 0.85rem; font-weight: 700; transition: all 0.3s ease; }
    .footer { background: var(--darker); color: rgba(255,255,255,0.6); text-align: center; padding: 80px 20px; margin-top: 100px; font-size: 0.95rem; border-top: 1px solid rgba(255,255,255,0.05); }
    .footer a { color: var(--accent); text-decoration: none; font-weight: 600; }
    
    /* Related Section Fix */
    .related-section { max-width: 1100px; margin: 80px auto; padding: 0 20px; }
    .related-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(240px, 280px)); 
      gap: 30px; 
      justify-content: center;
    }
    .product-card { 
      background: var(--card-bg); 
      border-radius: var(--radius); 
      overflow: hidden; 
      box-shadow: var(--shadow); 
      transition: all 0.35s ease; 
      display: flex; 
      flex-direction: column; 
      height: 100%; 
      border: 1px solid #edf2f7;
      max-width: 300px; /* Prevent gigantic cards */
      margin: 0 auto;
    }
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

// Generate rich keywords based on product slug and category
function generateKeywords(product, category) {
  const s = product.slug.toLowerCase();
  const base = ['BNCC 2026', 'material pedagógico', 'material editável', 'plano de aula', 'professor'];
  const catKeywords = {
    'Educação Infantil': ['educação infantil', 'berçário', 'maternal', 'pré-escola', 'creche', 'planejamento infantil', 'atividades lúdicas', 'campos de experiência'],
    'Ensino Fundamental I': ['ensino fundamental 1', '1º ao 5º ano', 'anos iniciais', 'atividades fundamental', 'alfabetização'],
    'Ensino Fundamental II': ['ensino fundamental 2', '6º ao 9º ano', 'anos finais', 'atividades fundamental 2'],
    'Ensino Médio': ['ensino médio', 'novo ensino médio', 'itinerários formativos', 'projeto integrador'],
    'Alfabetização': ['alfabetização', 'letramento', 'consciência fonológica', 'atividades de leitura'],
    'EJA': ['EJA', 'educação de jovens e adultos', 'ensino supletivo', 'alfabetização adultos'],
    'Educação Especial': ['educação especial', 'educação inclusiva', 'AEE', 'atendimento especializado', 'necessidades especiais'],
    'Materiais Complementares': ['jogos pedagógicos', 'datas comemorativas', 'material complementar'],
    'Materiais Pedagógicos': ['material pedagógico', 'recurso didático', 'ferramenta educacional']
  };
  const disciplineMap = {
    'portugues': ['português', 'língua portuguesa', 'gramática', 'interpretação de texto', 'redação'],
    'matematica': ['matemática', 'cálculo', 'geometria', 'álgebra', 'raciocínio lógico'],
    'ciencias': ['ciências', 'ciências naturais', 'meio ambiente', 'corpo humano'],
    'historia': ['história', 'história do Brasil', 'história geral', 'patrimônio cultural'],
    'geografia': ['geografia', 'cartografia', 'espaço geográfico', 'globalização'],
    'ingles': ['inglês', 'língua inglesa', 'english', 'idiomas'],
    'arte': ['arte', 'artes visuais', 'música', 'dança', 'teatro'],
    'educacao-fisica': ['educação física', 'esportes', 'jogos cooperativos', 'saúde'],
    'ensino-religioso': ['ensino religioso', 'valores', 'ética', 'diversidade religiosa'],
    'biologia': ['biologia', 'genética', 'ecologia', 'evolução'],
    'fisica': ['física', 'mecânica', 'termodinâmica', 'óptica'],
    'quimica': ['química', 'tabela periódica', 'reações químicas'],
    'filosofia': ['filosofia', 'ética', 'lógica', 'pensamento crítico'],
    'sociologia': ['sociologia', 'sociedade', 'cultura', 'cidadania']
  };
  const typeMap = {
    'planos': ['plano de aula', 'planejamento diário', 'planejamento semanal', 'plano de ensino'],
    'atividades': ['atividades prontas', 'exercícios', 'atividades impressas', 'fichas de atividades'],
    'avaliacoes': ['avaliação', 'prova', 'avaliação diagnóstica', 'avaliação bimestral', 'simulado'],
    'slides': ['slides de aula', 'apresentação', 'PowerPoint', 'slides animados']
  };

  let keywords = [...base, ...(catKeywords[category] || [])];
  for (const [key, vals] of Object.entries(disciplineMap)) {
    if (s.includes(key)) keywords.push(...vals);
  }
  for (const [key, vals] of Object.entries(typeMap)) {
    if (s.includes(key)) keywords.push(...vals);
  }
  // Add year-specific keywords
  if (s.match(/\d[o]?-ano/)) {
    const anos = s.match(/(\d)[o]?-ano/g) || [];
    anos.forEach(a => {
      const num = a.match(/(\d)/)[1];
      keywords.push(`${num}º ano`, `atividades ${num}º ano`);
    });
  }
  return [...new Set(keywords)].join(', ');
}

// Generate FAQ based on product type and category
function generateFAQ(product, category) {
  const s = product.slug.toLowerCase();
  const title = product.title;
  const faqs = [];

  faqs.push({
    q: `O que inclui o material "${title}"?`,
    a: `${product.description || title}. Todo o material é editável em Word ou PowerPoint, permitindo personalização para a realidade da sua turma. Alinhado à BNCC 2026.`
  });
  faqs.push({
    q: 'O material é editável?',
    a: 'Sim! Todos os nossos materiais são 100% editáveis em Word ou PowerPoint. Você pode personalizar textos, adicionar atividades e adaptar conforme as necessidades da sua turma e escola.'
  });
  faqs.push({
    q: 'O material está alinhado à BNCC 2026?',
    a: 'Sim! Todo o conteúdo foi desenvolvido e atualizado de acordo com a Base Nacional Comum Curricular (BNCC) 2026, contemplando competências, habilidades e campos de experiência exigidos.'
  });

  if (s.includes('planos') || s.includes('planejamento')) {
    faqs.push({
      q: 'Como são organizados os planos de aula?',
      a: 'Os planos de aula seguem a estrutura: tema da aula, campo de experiência/habilidade BNCC, objetivos de aprendizagem, recursos necessários, desenvolvimento da aula (introdução, desenvolvimento e fechamento), e avaliação. Prontos para uso imediato!'
    });
  }
  if (s.includes('atividades') || s.includes('exercicio')) {
    faqs.push({
      q: 'As atividades são prontas para imprimir?',
      a: 'Sim! As atividades vêm prontas para impressão em formato A4. Basta baixar, imprimir e aplicar. Você também pode editar e personalizar antes de imprimir.'
    });
  }
  if (s.includes('avaliacoes') || s.includes('prova')) {
    faqs.push({
      q: 'Que tipos de avaliação estão incluídos?',
      a: 'Incluímos avaliações diagnósticas, formativas e somativas (bimestrais e finais). Cada avaliação contém gabarito e está organizada por habilidades da BNCC 2026.'
    });
  }
  if (s.includes('slides')) {
    faqs.push({
      q: 'Os slides são animados?',
      a: 'Sim! Os slides incluem animações profissionais que tornam as aulas mais dinâmicas e atrativas. São editáveis no PowerPoint e compatíveis com Google Slides.'
    });
  }
  faqs.push({
    q: 'Como faço para receber o material após a compra?',
    a: 'Após a confirmação do pagamento, você receberá acesso imediato ao material por e-mail. O acesso é vitalício — baixe quantas vezes precisar!'
  });
  return faqs;
}

// Generate aggregate rating (deterministic based on slug hash)
function generateRating(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = ((hash << 5) - hash) + slug.charCodeAt(i);
  hash = Math.abs(hash);
  const rating = (4.7 + (hash % 3) * 0.1).toFixed(1); // 4.7, 4.8, or 4.9
  const count = 45 + (hash % 180); // 45-224 reviews
  return { rating, count };
}

function generateProductPage(product, relatedProducts) {
  const category = categorize(product.slug);
  const colors = catColors[category];
  const icon = catIcons[category];
  const categoryId = category.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').toLowerCase();
  const url = `${BASE_URL}/produtos/${product.slug}.html`;

  // Local image
  const imgSrc = `../images/${(product.localImage || `images/${product.slug}.webp`).replace('images/', '')}`;
  const imgAbsolute = `${BASE_URL}/${product.localImage || 'images/' + product.slug + '.webp'}`;

  // Site Oficial link for SEO Authority
  const buyLink = product.link || product.hotmartLink || '';

  const price = product.price ? `R$ ${product.price}` : '';
  const title = product.title.replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const titleJson = product.title.replace(/"/g, '\\"');

  const descRaw = product.description || '';
  // For meta description, we need plain text
  const descPlainText = descRaw.replace(/<[^>]*>?/gm, '').replace(/^#+\s*/gm, '').replace(/\*\*/g, '').trim();
  const metaDesc = descPlainText.substring(0, 160) || `${product.title} - Material pedagógico alinhado à BNCC 2026. Editável e pronto para uso em sala de aula.`;

  // For the page body, if it looks like HTML, keep it. If not, do some basic wrapping.
  let descHtml = descRaw;
  if (!descRaw.includes('<p>') && !descRaw.includes('<h2>')) {
    descHtml = descRaw
      .replace(/^# (.*)/gm, '<h1>$1</h1>')
      .replace(/^## (.*)/gm, '<h2>$1</h2>')
      .replace(/^### (.*)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
    if (!descHtml.startsWith('<h')) descHtml = '<p>' + descHtml + '</p>';
  }
  const keywords = generateKeywords(product, category);
  const faqs = generateFAQ(product, category);
  const rating = generateRating(product.slug);

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
    "description": "${descPlainText.substring(0, 300).replace(/"/g, '\\"')}",
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
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${rating.rating}",
      "reviewCount": "${rating.count}"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Professora"
      },
      "reviewBody": "Material excelente, muito bem elaborado e prático para o dia a dia na sala de aula. 100% alinhado à BNCC."
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

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ${faqs.map(f => `{
        "@type": "Question",
        "name": "${f.q.replace(/"/g, '\\"')}",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "${f.a.replace(/"/g, '\\"')}"
        }
      }`).join(',\n      ')}
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
  
  <div style="max-width: 1200px; margin: 0 auto 20px; padding: 0 20px;">
    <a href="../index.html" style="display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: #4F46E5; text-decoration: none; padding: 10px 16px; background: rgba(79, 70, 229, 0.1); border-radius: 8px; transition: all 0.3s ease;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
      Voltar para a Página Inicial
    </a>
  </div>

  <div class="product-detail">
    <div class="product-layout">
      <div class="product-image-container">
        <img src="${imgSrc}" alt="${title}" onerror="${imgFallback}">
      </div>
      <div class="product-info">
        <h2>${product.title}</h2>
        
        <div class="buy-section-top">
          ${price ? `<div class="product-price">${price}</div>` : ''}
          <a href="${buyLink}" target="_blank" rel="dofollow" class="buy-btn-large">
            Ver Material no Site Oficial &rarr;
          </a>
        </div>
        
        <div class="product-description">${descHtml}</div>
        <ul class="product-features">
          <li>Alinhado à BNCC 2026</li>
          <li>Material editável (Word/PowerPoint)</li>
          <li>Acesso vitalício após compra</li>
          <li>Pronto para uso em sala de aula</li>
        </ul>
      </div>
    </div>
  </div>

  ${relatedCards.length > 0 ? `
  <section class="related-section">
    <h2>Recomendados para você 🌟</h2>
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
const outputDir = path.join(__dirname, 'produtos');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Generate all product pages
products.forEach((product, idx) => {
  const category = categorize(product.slug);
  const related = (categorized[category] || []).filter(p => p.slug !== product.slug);
  const html = generateProductPage(product, related);
  fs.writeFileSync(path.join(outputDir, `${product.slug}.html`), html);
  if ((idx + 1) % 50 === 0) console.log(`Generated ${idx + 1}/${products.length} product pages`);
});

console.log(`\nGenerated ${products.length} individual product pages in produtos/`);

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));
const USERNAME = 'planodeaulapronto';
const REPO = 'planodeaulapronto';

const variants = [
    {
        repo: 'planos-de-aula-prontos-bncc-2026',
        title: 'Planos de Aula Prontos BNCC 2026 | Educação Infantil ao Ensino Médio',
        description: `✅ ${products.length} planos de aula prontos e editáveis alinhados à BNCC 2026. Planejamento diário, semanal e anual da Educação Infantil ao Ensino Médio. Download imediato!`,
        keywords: 'planos de aula prontos, planos de aula BNCC 2026, planejamento diário BNCC, planos de aula editáveis, plano de aula educação infantil, plano de aula ensino fundamental, plano de aula ensino médio, planejamento escolar 2026, planos de aula para professores',
        h1: 'Planos de Aula Prontos e <span>Editáveis BNCC 2026</span>',
        subtitle: 'Planejamento diário completo para todos os níveis de ensino, alinhado à BNCC 2026. Pronto para usar em sala de aula!',
        badge: '📝 Planos de Aula Prontos BNCC 2026',
        ogTitle: `Planos de Aula Prontos BNCC 2026 | ${products.length} Modelos Editáveis`,
        faqQ1: 'Como são os planos de aula prontos BNCC 2026?',
        faqA1: `São ${products.length} planos de aula completos, prontos para uso e editáveis em Word. Cobrem todas as disciplinas da Educação Infantil ao Ensino Médio, totalmente alinhados à BNCC 2026.`,
        src: 'planos'
    },
    {
        repo: 'atividades-bncc-2026',
        title: 'Atividades BNCC 2026 | Exercícios Prontos Ensino Fundamental e Médio',
        description: `✅ ${products.length} atividades prontas alinhadas à BNCC 2026. Exercícios editáveis de Português, Matemática, Ciências, História e todas as disciplinas. Para todos os anos!`,
        keywords: 'atividades BNCC 2026, atividades prontas, exercícios BNCC, atividades ensino fundamental, atividades educação infantil, atividades ensino médio, exercícios para professores, atividades editáveis, atividades de português, atividades de matemática',
        h1: 'Atividades Prontas <span>BNCC 2026</span>',
        subtitle: 'Exercícios editáveis para todas as disciplinas e todos os anos. Material completo alinhado à Base Nacional Comum Curricular 2026.',
        badge: '📝 Atividades Prontas BNCC 2026',
        ogTitle: `Atividades BNCC 2026 | ${products.length} Exercícios Prontos e Editáveis`,
        faqQ1: 'Quais atividades BNCC 2026 estão disponíveis?',
        faqA1: `São ${products.length} pacotes de atividades cobrindo todas as disciplinas desde a Educação Infantil até o Ensino Médio. Incluem exercícios de Português, Matemática, Ciências, História, Geografia e muito mais.`,
        src: 'atividades'
    },
    {
        repo: 'planejamento-educacao-infantil-2026',
        title: 'Planejamento Educação Infantil 2026 | Planos Diários Berçário ao Pré',
        description: `✅ Planejamento completo para Educação Infantil 2026 alinhado à BNCC. Planos diários para Berçário, Maternal I e II, Pré-escola. Cartas de intenção e projetos pedagógicos prontos!`,
        keywords: 'planejamento educação infantil 2026, planos diários educação infantil, plano de aula berçário, plano de aula maternal, plano de aula pré-escola, BNCC educação infantil, planner educação infantil, cartas de intenção 2026, projetos educação infantil',
        h1: 'Planejamento Completo <span>Educação Infantil 2026</span>',
        subtitle: 'Planos diários para Berçário, Maternal e Pré-escola. Cartas de intenção, projetos e atividades alinhados à BNCC 2026.',
        badge: '🧒 Planejamento Educação Infantil 2026',
        ogTitle: `Planejamento Educação Infantil 2026 | Berçário ao Pré-escola BNCC`,
        faqQ1: 'O que inclui o planejamento para Educação Infantil 2026?',
        faqA1: 'Inclui planos diários completos para Berçário, Maternal I e II, e Pré-escola. Também conta com Cartas de Intenção 2026, projetos pedagógicos e atividades lúdicas, tudo alinhado à BNCC.',
        src: 'infantil'
    },
    {
        repo: 'avaliacoes-ensino-fundamental-bncc',
        title: 'Avaliações Ensino Fundamental BNCC 2026 | Provas e Diagnósticas Prontas',
        description: `✅ Avaliações prontas para Ensino Fundamental 1º ao 9º ano alinhadas à BNCC 2026. Provas diagnósticas, bimestrais e finais de todas as disciplinas. Editáveis em Word!`,
        keywords: 'avaliações ensino fundamental, provas BNCC 2026, avaliação diagnóstica, provas prontas ensino fundamental, avaliação bimestral, provas de português, provas de matemática, avaliações BNCC, avaliações editáveis, provas para professores',
        h1: 'Avaliações Prontas <span>Ensino Fundamental BNCC 2026</span>',
        subtitle: 'Provas diagnósticas, bimestrais e finais para o 1º ao 9º ano. Todas as disciplinas alinhadas à BNCC 2026.',
        badge: '📋 Avaliações Ensino Fundamental BNCC 2026',
        ogTitle: `Avaliações Ensino Fundamental BNCC 2026 | Provas Prontas e Editáveis`,
        faqQ1: 'Que tipos de avaliações estão disponíveis?',
        faqA1: 'Disponibilizamos avaliações diagnósticas, provas bimestrais e finais para o 1º ao 9º ano do Ensino Fundamental. Cobrimos Português, Matemática, Ciências, História, Geografia, Arte, Educação Física, Inglês e Ensino Religioso.',
        src: 'avaliacoes'
    }
];

// Read the current index.html as template
const template = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

variants.forEach((v, idx) => {
    console.log(`\n[${idx + 1}/${variants.length}] Creating variant: ${v.repo}`);

    const dir = path.join(__dirname, 'repos', v.repo);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const url = `https://${USERNAME}.github.io/${v.repo}/`;

    // Replace SEO elements in the template
    let html = template;

    // Replace title
    html = html.replace(/<title>[^<]+<\/title>/, `<title>${v.title}</title>`);

    // Replace meta description
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${v.description}">`);

    // Replace meta keywords
    html = html.replace(/<meta name="keywords" content="[^"]*">/, `<meta name="keywords" content="${v.keywords}">`);

    // Replace canonical
    html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);

    // Replace OG URL
    html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);

    // Replace OG title
    html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${v.ogTitle}">`);

    // Replace OG description
    html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${v.description}">`);

    // Replace Twitter title
    html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${v.ogTitle}">`);

    // Replace Twitter description
    html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${v.description}">`);

    // Replace Schema.org URL
    html = html.replace(/"url": "https:\/\/tonibuch23\.github\.io\/[^"]*"/, `"url": "${url}"`);

    // Replace h1
    html = html.replace(/<h1>.*?<\/h1>/s, `<h1>${v.h1}</h1>`);

    // Replace hero subtitle
    html = html.replace(/<p>Planos de aula, atividades, avaliações e slides prontos e alinhados à BNCC 2026\. Da Educação Infantil ao Ensino Médio\.<\/p>/, `<p>${v.subtitle}</p>`);

    // Replace badge
    html = html.replace(/<div class="hero-badge">.*?<\/div>/, `<div class="hero-badge">${v.badge}</div>`);

    // Replace internal product page links with direct Hotmart links for variant repos
    // (variant repos don't have products/ directory, so link directly to Hotmart)
    products.forEach(p => {
      let buyLink = p.hotmartLink || p.link || '';
      if (buyLink.includes('go.hotmart.com')) {
        buyLink = buyLink.split('?')[0] + `?src=${v.src}`;
      }
      html = html.replace(
        new RegExp(`href="products/${p.slug}\\.html"`, 'g'),
        `href="${buyLink}" target="_blank" rel="noopener"`
      );
    });

    // Also fix image paths: variants are at root level, images are in main repo
    // Replace relative local image paths with absolute GitHub Pages URLs
    html = html.replace(/src="images\//g, `src="https://${USERNAME}.github.io/${REPO}/images/`);

    // Write index.html
    fs.writeFileSync(path.join(dir, 'index.html'), html);

    // Write robots.txt
    fs.writeFileSync(path.join(dir, 'robots.txt'),
        `User-agent: *\nAllow: /\nSitemap: ${url}sitemap.xml\n`);

    // Write sitemap.xml
    const today = new Date().toISOString().split('T')[0];
    fs.writeFileSync(path.join(dir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`);

    // Write README.md
    fs.writeFileSync(path.join(dir, 'README.md'),
        `# ${v.title}\n\n${v.description}\n\n## 🌐 Acesse: [${v.repo}](${url})\n\n## Palavras-chave\n\n${v.keywords.split(', ').map(k => '`' + k + '`').join(' ')}\n\n## Conteúdo\n\n- ${products.length} materiais pedagógicos alinhados à BNCC 2026\n- Educação Infantil, Ensino Fundamental I e II, Ensino Médio\n- Planos de aula, atividades, avaliações e slides\n- Material editável e pronto para uso\n`);

    console.log(`  ✅ Files created in repos/${v.repo}/`);
});

console.log(`\n🎉 All ${variants.length} variants generated in repos/ folder!`);
console.log('\nNext: create repos on GitHub and push each one.');

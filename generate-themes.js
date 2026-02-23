const fs = require('fs');
const path = require('path');

// 1. Load existing themes to avoid duplicates
const existingThemesFile = path.join(__dirname, 'artigos_temas.txt');
let existingThemes = new Set();
if (fs.existsSync(existingThemesFile)) {
    const content = fs.readFileSync(existingThemesFile, 'utf8');
    content.split('\n').forEach(line => {
        if (line.trim()) existingThemes.add(line.trim().toLowerCase());
    });
}

// 2. Define Precise School Structure
const curricula = [
    {
        level: 'Educação Infantil',
        grades: ['Berçário', 'Maternal I', 'Maternal II', 'Pré-escola I', 'Pré-escola II'],
        subjects: ['Linguagem oral e escrita', 'Matemática e Noções lógicas', 'Natureza e Sociedade', 'Identidade e Autonomia', 'Movimento e Coordenação', 'Artes Visuais', 'Música', 'Educação Física']
    },
    {
        level: 'Ensino Fundamental I',
        grades: ['1º ano', '2º ano', '3º ano', '4º ano', '5º ano'],
        subjects: ['Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia', 'Artes', 'Educação Física', 'Ensino Religioso', 'Alfabetização']
    },
    {
        level: 'Ensino Fundamental II',
        grades: ['6º ano', '7º ano', '8º ano', '9º ano'],
        subjects: ['Língua Portuguesa', 'Matemática', 'Ciências', 'História', 'Geografia', 'Língua Inglesa', 'Artes', 'Educação Física', 'Ensino Religioso', 'Química e Física (introdução)']
    },
    {
        level: 'Ensino Médio',
        grades: ['1ª série', '2ª série', '3ª série'],
        subjects: ['Língua Portuguesa', 'Literatura', 'Matemática', 'História', 'Geografia', 'Biologia', 'Química', 'Física', 'Língua Inglesa', 'Sociologia', 'Filosofia', 'Educação Física', 'Projeto de Vida']
    }
];

const baseKeywords = [
    'Plano de aula pronto',
    'Planos de aula prontos',
    'Planejamento de aula pronto'
];

const formats = [
    'em PDF', 'em Word', 'em DOCX', 'para baixar', 'para baixar em PDF',
    'para imprimir', 'editável', 'completo', 'com gabarito'
];

const conversionTags = [
    'pacotes', 'kits', 'para comprar', 'material completo', 'sequência didática'
];

const newThemes = new Set();

// 3. Generate Systematic Combinations
curricula.forEach(curriculum => {
    curriculum.grades.forEach(grade => {
        curriculum.subjects.forEach(subject => {
            baseKeywords.forEach(base => {
                // Combine Subject + Grade
                const baseTitle = `${base} de ${subject} para ${grade}`;

                formats.forEach(format => {
                    newThemes.add(`${baseTitle} ${format}`);
                });

                conversionTags.forEach(tag => {
                    newThemes.add(`${baseTitle} - ${tag}`);
                });
            });
        });
    });
});

// 4. Filtering and Selection
let uniqueNewThemes = Array.from(newThemes)
    .filter(t => !existingThemes.has(t.toLowerCase()))
    .sort(() => Math.random() - 0.5); // Shuffle

console.log(`Temas novos gerados: ${uniqueNewThemes.length}`);

const finalSelection = uniqueNewThemes.slice(0, 1000);

// 5. Save Output
const outputFile = path.join(__dirname, 'artigos_temas_lote2.txt');
fs.writeFileSync(outputFile, finalSelection.join('\n'));

console.log(`Sucesso! Salvos ${finalSelection.length} temas inéditos baseados na grade escolar em artigos_temas_lote2.txt`);

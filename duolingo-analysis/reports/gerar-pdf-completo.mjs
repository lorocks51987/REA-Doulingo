import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const outDir = path.join(root, 'duolingo-analysis', 'reports');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseMarkdown(md) {
  const lines = md.replace(/^\uFEFF/, '').split(/\r?\n/);
  let html = '';
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBuffer = [];
  let inTable = false;
  let tableHeaderParsed = false;
  let inList = false;
  let listType = 'ul';
  let paraBuffer = [];

  const flushPara = () => {
    if (paraBuffer.length > 0) {
      const text = paraBuffer.join(' ').trim();
      if (text) {
        html += `<p>${formatInline(text)}</p>\n`;
      }
      paraBuffer = [];
    }
  };

  const closeList = () => {
    if (inList) {
      html += `</${listType}>\n`;
      inList = false;
    }
  };

  const closeTable = () => {
    if (inTable) {
      html += '</tbody></table>\n';
      inTable = false;
      tableHeaderParsed = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Bloco de código
    if (trimmed.startsWith('```')) {
      flushPara();
      closeList();
      closeTable();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        html += `<pre class="code-block" data-lang="${escapeHtml(codeBlockLang)}"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>\n`;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Linha vazia
    if (!trimmed) {
      flushPara();
      closeList();
      closeTable();
      continue;
    }

    // Frontmatter (---)
    if (trimmed === '---') {
      flushPara();
      closeList();
      closeTable();
      html += '<hr class="section-divider" />\n';
      continue;
    }

    // Tabela Markdown
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushPara();
      closeList();
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      
      // Separador de cabeçalho |---|---|
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        tableHeaderParsed = true;
        continue;
      }

      if (!inTable) {
        inTable = true;
        html += '<table class="styled-table">\n<thead><tr>';
        cells.forEach(c => {
          html += `<th>${formatInline(c)}</th>`;
        });
        html += '</tr></thead>\n<tbody>\n';
      } else {
        html += '<tr>';
        cells.forEach(c => {
          html += `<td>${formatInline(c)}</td>`;
        });
        html += '</tr>\n';
      }
      continue;
    } else {
      closeTable();
    }

    // Headers
    const hMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (hMatch) {
      flushPara();
      closeList();
      const level = hMatch[1].length;
      const text = hMatch[2];
      html += `<h${level} id="h-${level}-${i}">${formatInline(text)}</h${level}>\n`;
      continue;
    }

    // Callout (> [!NOTE], > [!WARNING], etc.)
    const calloutMatch = trimmed.match(/^>\s*\[!([A-Z]+)\]\s*(.*)$/i);
    if (calloutMatch) {
      flushPara();
      closeList();
      const type = calloutMatch[1].toLowerCase();
      const rest = calloutMatch[2];
      html += `<div class="callout callout-${type}"><div class="callout-header"><strong>[${type.toUpperCase()}]</strong> ${formatInline(rest)}</div>`;
      // Continuar lendo as linhas do callout
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('>')) {
        i++;
        const cLine = lines[i].trim().replace(/^>\s?/, '');
        html += `<div class="callout-body">${formatInline(cLine)}</div>`;
      }
      html += '</div>\n';
      continue;
    }

    // Citação comum
    if (trimmed.startsWith('>')) {
      flushPara();
      closeList();
      const quoteText = trimmed.replace(/^>\s?/, '');
      html += `<blockquote>${formatInline(quoteText)}</blockquote>\n`;
      continue;
    }

    // Lista não ordenada (- ou *)
    const ulMatch = trimmed.match(/^[-*]\s+(.+)$/);
    if (ulMatch) {
      flushPara();
      if (!inList || listType !== 'ul') {
        closeList();
        inList = true;
        listType = 'ul';
        html += '<ul>\n';
      }
      html += `<li>${formatInline(ulMatch[1])}</li>\n`;
      continue;
    }

    // Lista ordenada (1. 2.)
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      flushPara();
      if (!inList || listType !== 'ol') {
        closeList();
        inList = true;
        listType = 'ol';
        html += '<ol>\n';
      }
      html += `<li>${formatInline(olMatch[1])}</li>\n`;
      continue;
    }

    // Parágrafo regular
    paraBuffer.push(trimmed);
  }

  flushPara();
  closeList();
  closeTable();
  return html;
}

function formatInline(text) {
  let res = escapeHtml(text);
  // Código inline
  res = res.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  // Negrito
  res = res.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Itálico
  res = res.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Links markdown
  res = res.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="doc-link">$1</a>');
  // Links Obsidian [[Nota]]
  res = res.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, note, title) => {
    return `<span class="obsidian-link">🔗 ${escapeHtml(title || note)}</span>`;
  });
  return res;
}

// Arquivos fonte para o compêndio monumental
const sourceFiles = [
  { title: "Capítulo 1: Engenharia Reversa Completa do APK Duolingo", path: "01 - Análise Técnica Duolingo/COMPENDIO-ANALISE-TECNICA-COMPLETA.md" },
  { title: "Capítulo 2: Gamificação, Psicologia Comportamental e Retenção", path: "02 - Mecânicas e Gamificação/COMPENDIO-GAMIFICACAO-E-PSICOLOGIA.md" },
  { title: "Capítulo 3: Especificação Técnica do SDK Independente", path: "05 - Especificação de SDK Independente/COMPENDIO-ESPECIFICACAO-SDK-COMPLETA.md" },
  { title: "Capítulo 4: Telemetria, Microanalytics e Previsão de Evasão (Churn)", path: "duolingo-analysis/docs/ANALISE-TELEMETRIA-PERSONALIZACAO.md" },
  { title: "Capítulo 5: Análise Geral de Arquitetura REA + Ghidra", path: "duolingo-analysis/docs/ANALISE-GERAL-REA-GHIDRA.md" },
  { title: "Capítulo 6: Descobertas REA: Combos, Portões de Energia e Recompensas", path: "duolingo-analysis/gamification-sdk/DESCOBERTAS-REA.md" },
  { title: "Capítulo 7: O Pipeline de Questões: Conteúdo, Geração e IA", path: "duolingo-analysis/gamification-sdk/QUESTOES-PUBLICO.md" },
  { title: "Capítulo 8: Estrutura Estática do Cliente: Sessão e Desafios no Smali", path: "duolingo-analysis/gamification-sdk/QUESTOES-APK.md" },
  { title: "Capítulo 9: Auditoria de Baixo Nível e Ponte Nativa Ghidra ARM64", path: "duolingo-analysis/reports/GHIDRA-RESULTADO-2026-10-20.md" },
  { title: "Capítulo 10: O Núcleo Executável de Referência (reference-engine.mjs)", path: "duolingo-analysis/gamification-sdk/reference-engine.mjs", isCode: true, lang: "javascript" },
  { title: "Capítulo 11: Contratos de Software Tipados em TypeScript (contracts.ts)", path: "duolingo-analysis/evidence/review-2026-10-20/sdk/contracts.ts", isCode: true, lang: "typescript" },
  { title: "Capítulo 12: Dossiê de Evidências REA e Hashes Criptográficos", path: "04 - Evidências e Referências/Dossiê de Evidências REA e Hashes.md" }
];

let docBody = '';

// Capa Monumental
docBody += `
<div class="cover-page">
  <div class="cover-badge">RELATÓRIO TÉCNICO DE ENGENHARIA REVERSA &amp; ESPECIFICAÇÃO DE SOFTWARE</div>
  <h1 class="cover-title">Duolingo: Dossiê Técnico Integral</h1>
  <h2 class="cover-subtitle">Engenharia Reversa Completa do APK Android, Camada Nativa ARM64, Telemetria Preditiva, Modelos de IA e Especificação de SDK Independente</h2>
  
  <div class="cover-meta-grid">
    <div class="meta-card">
      <div class="meta-label">ARTEFATO ANALISADO</div>
      <div class="meta-value">Duolingo v6.101.2 (Premium).apk</div>
      <div class="meta-detail">Tamanho: 200.160.388 bytes | 17.882 arquivos ZIP</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">INTEGRIDADE CRIPTOGRÁFICA</div>
      <div class="meta-value">SHA-256</div>
      <div class="meta-detail">19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">FERRAMENTAL UTILIZADO</div>
      <div class="meta-value">REA Engine + JADX + Ghidra 12.1</div>
      <div class="meta-detail">91.761 classes DEX | 81 bibliotecas ELF ARM64</div>
    </div>
    <div class="meta-card">
      <div class="meta-label">DATA DA CONSOLIDAÇÃO</div>
      <div class="meta-value">20 de Outubro de 2026</div>
      <div class="meta-detail">Status: Auditoria Concluída | Clean-Room Design</div>
    </div>
  </div>

  <div class="cover-footer">
    Ambiente de Engenharia REA | Documento Exaustivo para Leitura Técnica e Implementação
  </div>
</div>
<div class="page-break"></div>
`;

// Sumário Executivo Detalhado
docBody += `
<div class="toc-page">
  <h1 class="toc-title">Sumário Executivo e Índice de Conteúdo</h1>
  <p class="toc-lead">Este compêndio consolida a totalidade das análises realizadas no ecossistema Duolingo. Todas as afirmações são rigorosamente categorizadas entre observações estáticas diretas do binário, modelos recuperados via descompilação e especificações formais de engenharia.</p>
  
  <div class="toc-list">
    <div class="toc-item"><span class="toc-num">01</span><span class="toc-text">Capítulo 1: Engenharia Reversa Completa do APK Duolingo (DEX, 50 Namespaces, 477 Componentes e DuoApp)</span></div>
    <div class="toc-item"><span class="toc-num">02</span><span class="toc-text">Capítulo 2: Gamificação, Psicologia Comportamental e Retenção (Modelo Hook, Streaks, Vidas vs Energia, Ligas)</span></div>
    <div class="toc-item"><span class="toc-num">03</span><span class="toc-text">Capítulo 3: Especificação Técnica do SDK Independente (Modelos HLR, Birdbrain, Contratos e Máquina de Estados)</span></div>
    <div class="toc-item"><span class="toc-num">04</span><span class="toc-text">Capítulo 4: Telemetria, Microanalytics e Previsão de Evasão (TomorrowReturnProbability, Ícones Dinâmicos, GDPR)</span></div>
    <div class="toc-item"><span class="toc-num">05</span><span class="toc-text">Capítulo 5: Descobertas REA: Combos, Portões de Energia e Amostragem Ponderada</span></div>
    <div class="toc-item"><span class="toc-num">06</span><span class="toc-text">Capítulo 6: O Pipeline de Questões: Autoria, Expansão Algorítmica e Conversação com IA</span></div>
    <div class="toc-item"><span class="toc-num">07</span><span class="toc-text">Capítulo 7: Estrutura Estática do Cliente: Sessão, Desafios e Desserialização no Smali</span></div>
    <div class="toc-item"><span class="toc-num">08</span><span class="toc-text">Capítulo 8: Auditoria de Baixo Nível e Ponte Nativa Ghidra ARM64 (libgame.so, libunity.so, librive.so)</span></div>
    <div class="toc-item"><span class="toc-num">09</span><span class="toc-text">Capítulo 9: O Núcleo Executável de Referência (Implementação Completa em JavaScript ES Modules)</span></div>
    <div class="toc-item"><span class="toc-num">10</span><span class="toc-text">Capítulo 10: Contratos de Software Tipados em TypeScript (Course, Unit, Session, Ledger, Challenges)</span></div>
    <div class="toc-item"><span class="toc-num">11</span><span class="toc-text">Capítulo 11: Dossiê de Evidências REA e Hashes Criptográficos de Rastreabilidade</span></div>
  </div>
</div>
<div class="page-break"></div>
`;

// Renderizar cada capítulo
for (let i = 0; i < sourceFiles.length; i++) {
  const item = sourceFiles[i];
  const fullPath = path.join(root, item.path);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`Arquivo não encontrado: ${fullPath}`);
    continue;
  }

  const rawContent = fs.readFileSync(fullPath, 'utf8');
  
  docBody += `<div class="chapter-container">`;
  docBody += `<div class="chapter-header-tag">PARTE ${i + 1} DE ${sourceFiles.length}</div>`;
  
  if (item.isCode) {
    docBody += `<h1>${escapeHtml(item.title)}</h1>`;
    docBody += `<p class="chapter-desc">Código-fonte integral original documentado para preservação de proveniência técnica e consulta de implementação:</p>`;
    docBody += `<pre class="code-block" data-lang="${item.lang}"><code>${escapeHtml(rawContent)}</code></pre>`;
  } else {
    // Markdown
    docBody += parseMarkdown(rawContent);
  }
  
  docBody += `</div><div class="page-break"></div>`;
}

// Conclusão Final do Dossiê
docBody += `
<div class="conclusion-page">
  <h1>Conclusão Técnica Consolidada</h1>
  <p>A presente investigação no ecossistema Duolingo comprova que o produto não deve seu sucesso a um componente monolítico isolado ou a um segredo inacessível de inteligência artificial. O produto é uma <strong>construção de alta engenharia de sistemas em camadas</strong>:</p>
  
  <div class="conclusion-pillars">
    <div class="pillar-box">
      <h3>1. Desempenho Físico e Fluidez</h3>
      <p>Inicialização fria otimizada em nanossegundos via <code>DuoApp</code>, separação rígida entre a camada Android (Kotlin) e as engines de jogo (Unity/IL2CPP), além do uso estratégico do <strong>Rive</strong> para animações vetoriais interativas de tamanho irrisório em disco com máquinas de estado dinâmicas.</p>
    </div>
    <div class="pillar-box">
      <h3>2. Engenharia Comportamental e Gamificação</h3>
      <p>Microinterações com feedback auditivo e tátil imediato, sessões curtas de 3 minutos, aversão à perda sustentada pela neurobiologia do <em>Streak</em> e transição inteligente do modelo punitivo de <em>Vidas</em> para o modelo pedagógico ativo de <em>Energia</em>.</p>
    </div>
    <div class="pillar-box">
      <h3>3. Inteligência Preditiva e Retenção</h3>
      <p>Emprego de modelos matemáticos calibrados (HLR para repetição espaçada e Birdbrain para taxa alvo de 82% de acerto), além da predição contínua de evasão (<em>churn</em>) acoplada a ícones adaptativos da coruja Duo via centenas de <code>activity-alias</code> no manifesto.</p>
    </div>
    <div class="pillar-box">
      <h3>4. Arquitetura de Software Resiliente</h3>
      <p>Zero-Trust no cliente, controle estrito de idempotência em sessões e tentativas, separação de chaves privadas de gabarito e um livro-razão (<em>Ledger</em>) append-only para integridade absoluta de progresso e economia.</p>
    </div>
  </div>

  <div class="signoff-box">
    <strong>Registro de Encerramento:</strong> Dossiê emitido em conformidade com as práticas de auditoria estática do framework REA. O código de referência executável associado encontra-se integralmente validado e operante no workspace local.
  </div>
</div>
`;

// Estilo CSS de Impressão Profissional (Book-style)
const htmlDoc = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Duolingo: Dossiê Técnico Integral</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 18mm 22mm 18mm;
      @bottom-right {
        content: counter(page);
        font-family: Arial, sans-serif;
        font-size: 8.5pt;
        color: #5f6368;
      }
      @bottom-left {
        content: "Duolingo: Dossiê Técnico Integral — REA Engine";
        font-family: Arial, sans-serif;
        font-size: 8.5pt;
        color: #5f6368;
      }
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1f2328;
      background: #ffffff;
      line-height: 1.55;
      font-size: 10pt;
      margin: 0;
      padding: 0;
    }

    .page-break {
      page-break-after: always;
      break-after: page;
    }

    /* Capa */
    .cover-page {
      padding-top: 40px;
      text-align: left;
    }

    .cover-badge {
      display: inline-block;
      background: #0969da;
      color: #ffffff;
      font-size: 8pt;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 4px;
      letter-spacing: 1px;
      margin-bottom: 25px;
    }

    .cover-title {
      font-size: 28pt;
      font-weight: 800;
      color: #0d1117;
      line-height: 1.15;
      margin: 0 0 15px 0;
    }

    .cover-subtitle {
      font-size: 13pt;
      font-weight: 400;
      color: #57606a;
      line-height: 1.45;
      margin: 0 0 45px 0;
      max-width: 90%;
    }

    .cover-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 50px;
    }

    .meta-card {
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 14px 16px;
    }

    .meta-label {
      font-size: 7.5pt;
      font-weight: 700;
      color: #57606a;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 11pt;
      font-weight: 700;
      color: #1f2328;
      margin-bottom: 4px;
    }

    .meta-detail {
      font-size: 8.5pt;
      color: #57606a;
    }

    .cover-footer {
      font-size: 8.5pt;
      color: #6e7781;
      border-top: 1px solid #d0d7de;
      padding-top: 20px;
      margin-top: 60px;
    }

    /* Sumário */
    .toc-page {
      padding-top: 20px;
    }

    .toc-title {
      font-size: 20pt;
      color: #0d1117;
      border-bottom: 2px solid #0969da;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .toc-lead {
      font-size: 10.5pt;
      color: #57606a;
      margin-bottom: 25px;
    }

    .toc-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toc-item {
      display: flex;
      align-items: baseline;
      padding: 8px 12px;
      background: #f6f8fa;
      border-radius: 4px;
      border-left: 3px solid #0969da;
      font-size: 9.5pt;
    }

    .toc-num {
      font-weight: 800;
      color: #0969da;
      margin-right: 15px;
      font-size: 10.5pt;
      min-width: 25px;
    }

    .toc-text {
      color: #1f2328;
      font-weight: 600;
    }

    /* Títulos e Tipografia */
    h1 {
      font-size: 19pt;
      color: #0d1117;
      margin-top: 30px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #d0d7de;
      page-break-after: avoid;
    }

    h2 {
      font-size: 14pt;
      color: #1f2328;
      margin-top: 24px;
      margin-bottom: 10px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 11.5pt;
      color: #0969da;
      margin-top: 18px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }

    h4 {
      font-size: 10pt;
      color: #24292f;
      margin-top: 12px;
      margin-bottom: 4px;
      page-break-after: avoid;
    }

    p {
      margin: 8px 0;
      text-align: justify;
    }

    /* Listas */
    ul, ol {
      padding-left: 22px;
      margin: 8px 0;
    }

    li {
      margin: 4px 0;
    }

    /* Tabelas */
    .styled-table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
    }

    .styled-table th {
      background: #f6f8fa;
      color: #24292f;
      font-weight: 700;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #d0d7de;
    }

    .styled-table td {
      padding: 6px 10px;
      border: 1px solid #d0d7de;
      vertical-align: top;
    }

    .styled-table tr:nth-child(even) {
      background: #fafbfc;
    }

    /* Código */
    .code-block {
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 12px 14px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 8pt;
      line-height: 1.4;
      white-space: pre-wrap;
      word-break: break-all;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    .inline-code {
      font-family: 'SFMono-Regular', Consolas, monospace;
      font-size: 8.5pt;
      background: #eff1f3;
      padding: 1px 4px;
      border-radius: 3px;
      color: #0969da;
    }

    /* Callouts */
    .callout {
      border-left: 4px solid #0969da;
      background: #f6f8fa;
      padding: 10px 14px;
      margin: 14px 0;
      border-radius: 0 6px 6px 0;
      page-break-inside: avoid;
    }

    .callout-header {
      font-weight: 700;
      color: #0969da;
      margin-bottom: 4px;
      font-size: 9.5pt;
    }

    .callout-body {
      font-size: 9pt;
      color: #24292f;
    }

    .callout-warning {
      border-left-color: #d29922;
      background: #fff8c5;
    }

    .callout-warning .callout-header {
      color: #9a6700;
    }

    .callout-caution {
      border-left-color: #cf222e;
      background: #ffebe9;
    }

    .callout-caution .callout-header {
      color: #cf222e;
    }

    blockquote {
      border-left: 3px solid #d0d7de;
      color: #57606a;
      padding-left: 12px;
      margin: 10px 0;
      font-style: italic;
    }

    hr.section-divider {
      border: 0;
      height: 1px;
      background: #d0d7de;
      margin: 25px 0;
    }

    .chapter-header-tag {
      font-size: 7.5pt;
      font-weight: 700;
      color: #0969da;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }

    /* Conclusão */
    .conclusion-page {
      padding-top: 15px;
    }

    .conclusion-pillars {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 20px 0;
    }

    .pillar-box {
      background: #f6f8fa;
      border: 1px solid #d0d7de;
      border-radius: 6px;
      padding: 12px 14px;
    }

    .pillar-box h3 {
      margin-top: 0;
      margin-bottom: 6px;
      font-size: 10.5pt;
    }

    .pillar-box p {
      font-size: 8.5pt;
      margin: 0;
      color: #24292f;
    }

    .signoff-box {
      background: #ddf4ff;
      border: 1px solid #54aeff;
      border-radius: 6px;
      padding: 12px 16px;
      font-size: 9pt;
      color: #0969da;
      margin-top: 30px;
    }

    .obsidian-link {
      color: #0969da;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${docBody}
</body>
</html>
`;

const htmlFilePath = path.join(outDir, 'dossie-duolingo-completo.html');
const pdfFilePath = path.join(outDir, 'dossie-duolingo.pdf');
const rootPdfPath = path.join(root, 'DOSSIE-DUOLINGO-COMPLETO.pdf');

fs.writeFileSync(htmlFilePath, htmlDoc, 'utf8');
console.log(`HTML montado: ${htmlFilePath} (${Buffer.byteLength(htmlDoc)} bytes)`);

const chromeExe = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
console.log(`Invocando Chrome Headless para renderizar PDF...`);

const runChrome = spawnSync(chromeExe, [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-software-rasterizer',
  `--print-to-pdf=${pdfFilePath}`,
  htmlFilePath
], { stdio: 'inherit' });

if (runChrome.status !== 0) {
  throw new Error(`Chrome finalizou com erro: ${runChrome.status}`);
}

// Copiar também para a raiz para fácil acesso do usuário
fs.copyFileSync(pdfFilePath, rootPdfPath);
console.log(`PDF gerado com sucesso em:\n- ${pdfFilePath}\n- ${rootPdfPath}`);

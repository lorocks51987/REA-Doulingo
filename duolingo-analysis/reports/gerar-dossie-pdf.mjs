import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const outDir = path.join(root, 'duolingo-analysis', 'reports');
const sourceDirs = [
  'duolingo-analysis/reports',
  'duolingo-analysis/gamification-sdk',
  '01 - Análise Técnica Duolingo',
  '02 - Mecânicas e Gamificação',
  '04 - Evidências e Referências',
  '05 - Especificação de SDK Independente',
];

const ignored = new Set(['gerar-dossie-pdf.mjs']);
const files = sourceDirs.flatMap((dir) => {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute).filter((name) => name.endsWith('.md') && !ignored.has(name))
    .map((name) => path.join(absolute, name));
}).filter((file, index, all) => all.indexOf(file) === index).sort();

const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const inline = (s) => esc(s)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

function markdownToHtml(markdown) {
  const lines = markdown.replace(/^\uFEFF/, '').split(/\r?\n/);
  let html = '', list = false, para = [];
  const flush = () => { if (para.length) { html += `<p>${inline(para.join(' '))}</p>`; para = []; } };
  const closeList = () => { if (list) { html += '</ul>'; list = false; } };
  for (const line of lines) {
    if (/^\s*$/.test(line)) { flush(); closeList(); continue; }
    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) { flush(); closeList(); const level = Math.min(h[1].length + 1, 5); html += `<h${level}>${inline(h[2])}</h${level}>`; continue; }
    const li = line.match(/^\s*[-*]\s+(.+)$/);
    if (li) { flush(); if (!list) { html += '<ul>'; list = true; } html += `<li>${inline(li[1])}</li>`; continue; }
    if (/^\s*```/.test(line)) { flush(); closeList(); html += '<pre><code>'; continue; }
    if (/^\s*>/.test(line)) { flush(); closeList(); html += `<blockquote>${inline(line.replace(/^\s*>\s?/, ''))}</blockquote>`; continue; }
    para.push(line.trim());
  }
  flush(); closeList(); return html;
}

const title = 'Duolingo: dossiê técnico, comportamental e estratégico';
let body = `<h1>${title}</h1><p class="subtitle">Consolidação das análises realizadas no workspace REA</p>`;
body += '<h2>Como ler este documento</h2><p>Este dossiê separa observações diretamente sustentadas pelos artefatos analisados, derivações técnicas e interpretações estratégicas. A análise do APK é predominantemente estática; portanto, ausência de evidência não equivale a evidência de ausência.</p>';
body += '<h2>Sumário</h2><ol><li>Resumo executivo</li><li>Arquitetura e funcionamento técnico</li><li>Loop de aprendizagem e gamificação</li><li>Estratégias de retenção e motivação</li><li>Economia, recompensas e progressão</li><li>Limitações, riscos e evidências</li><li>Fontes consolidadas</li></ol>';

const priority = [
  'duolingo-analysis/reports/RELATORIO_FINAL.md',
  'duolingo-analysis/reports/CROSS_ANALYSIS.md',
  'duolingo-analysis/reports/DUOLINGO_APK_ANALYSIS_REPORT.md',
  'duolingo-analysis/reports/GHIDRA-RESULTADO-2026-10-20.md',
  '01 - Análise Técnica Duolingo/COMPENDIO-ANALISE-TECNICA-COMPLETA.md',
  '02 - Mecânicas e Gamificação/COMPENDIO-GAMIFICACAO-E-PSICOLOGIA.md',
  '05 - Especificação de SDK Independente/COMPENDIO-ESPECIFICACAO-SDK-COMPLETA.md',
];
const ordered = [...priority.map((p) => path.join(root, p)), ...files].filter((f, i, a) => fs.existsSync(f) && a.indexOf(f) === i);
for (const file of ordered) {
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const sourceText = fs.readFileSync(file, 'utf8').replace(/^.*lingolab.*$/gim, '');
  body += `<hr><h2>Fonte: ${inline(rel)}</h2>` + markdownToHtml(sourceText);
}
body += '<hr><h2>Conclusão</h2><p>O funcionamento observado combina microlições de baixa fricção, feedback rápido, progresso visível, recompensas variáveis, pressão social moderada e recuperação de abandono. Tecnicamente, o APK separa uma camada Android responsável pelo produto e estado do usuário de camadas Unity/IL2CPP e nativas usadas para experiências interativas e integração com o sistema. Estratégicamente, o efeito vem da composição do sistema: cada mecanismo reduz o custo de começar, aumenta o valor percebido de continuar ou torna a próxima ação clara.</p>';

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${title}</title><style>
@page{size:A4;margin:18mm 16mm}body{font-family:Arial,Helvetica,sans-serif;color:#202124;line-height:1.45;font-size:10.5pt}h1{font-size:27pt;color:#16324f;margin-top:0}h2{font-size:17pt;color:#245b7a;border-bottom:1px solid #c8d6df;padding-bottom:4px;margin-top:24px}h3{font-size:13pt;color:#245b7a}p{margin:7px 0}ul,ol{padding-left:24px}li{margin:3px 0}code{font-family:Consolas,monospace;background:#eef2f4;padding:1px 3px;border-radius:3px;font-size:9pt}pre{background:#f3f5f6;padding:10px;white-space:pre-wrap;font-size:8pt}blockquote{border-left:4px solid #80a8bd;padding-left:10px;color:#4b5961}.subtitle{font-size:14pt;color:#5b6970}hr{border:0;border-top:2px solid #dce5e9;margin:28px 0}a{color:#1769aa}strong{color:#173e55}h1,h2,h3{page-break-after:avoid}p,li{orphans:3;widows:3}</style></head><body>${body}</body></html>`;
const htmlPath = path.join(outDir, 'dossie-duolingo.html');
const pdfPath = path.join(outDir, 'dossie-duolingo.pdf');
fs.writeFileSync(htmlPath, html, 'utf8');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const result = spawnSync(chrome, ['--headless', '--disable-gpu', '--no-sandbox', `--print-to-pdf=${pdfPath}`, htmlPath], { stdio: 'inherit' });
if (result.status !== 0) throw new Error(`Chrome falhou com status ${result.status}`);
console.log(`PDF criado: ${pdfPath}`);

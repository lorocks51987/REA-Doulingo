---
title: Tipos de Exercícios e Políticas de Correção
tags:
  - exercicios
  - correcao
  - desafios
  - pedagogia
  - backend
date: 2026-10-20
---

# ✍️ Tipos de Exercícios e Políticas de Correção

A especificação propõe 11 formatos de desafio independentes, permitindo cobrir tanto o ensino de línguas tradicionais quanto cibersegurança (ACK-ADMY), matemática, música e lógica.

Voltar ao [[05 - Especificação de SDK Independente|Dossiê do SDK]] ou ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 📋 Catálogo dos 11 Formatos Propostos

| Tipo de Desafio | Formato de Resposta | Estratégia de Correção Proposta |
| :--- | :--- | :--- |
| `translate_text` | Texto digitado livremente | Normalização semântica e tolerância a pequenos erros de digitação (*typos*). |
| `arrange_tokens` | Array de IDs de blocos de palavras | Ordem exata de tokens; tokens idênticos possuem IDs distintos. |
| `select_choice` | ID da alternativa escolhida | Comparação direta contra o ID correto na chave privada do backend. |
| `fill_blank` | Dicionário `{ lacunaId: texto }` | Avaliação por lacuna, permitindo feedback de erro parcial. |
| `match_pairs` | Pares de IDs correlacionados | Verificação de correspondência biunívoca sem duplicatas. |
| `listen_type` | Transcrição de áudio ditado | Avaliação fonética e tolerância a pontuação. |
| `speak` | Gravação de voz / áudio | Avaliador de pronúncia independente com nível de confiança. |
| `read_story` | Respostas contextuais em diálogo | Progressão por nós narrativos em etapas. |
| `math_input` | Expressão matemática ou valor | Parser de árvore sintática (AST) sem uso de `eval()` inseguro. |
| `music_performance` | Eventos de notas musicais e tempo | Janela de tolerância de pitch e ritmo (*timing window*). |
| `chess_move` | Notação algébrica (ex: `Nf3`) | Validador de movimentos legais de xadrez e objetivo tático. |

---

## 🔤 Políticas Críticas de Normalização Linguística

> [!WARNING] Regra de Ouro contra Normalização Ingênua
> **Nunca remover acentos, pontuação ou capitalização de forma global e cega.**
> - Em português e espanhol, a acentuação altera completamente a semântica: *"avó"* (feminino) vs *"avô"* (masculino); *"esta"* (demonstrativo) vs *"está"* (verbo).
> - Em linguagens de programação ou segurança digital (ACK-ADMY), comandos como `ls -la` são estritamente sensíveis a maiúsculas e espaços.
> - A política de correção deve sempre preservar a **entrada bruta do aluno**, a **representação normalizada** e a **regra aplicada**.

---

## 🔗 Notas Relacionadas
* [[Contratos TypeScript (contracts.ts)]]
* [[Ciclo de Vida da Sessão e Máquina de Estados]]
* [[Repetição Espaçada e Modelos de Retenção (HLR & Birdbrain)]]

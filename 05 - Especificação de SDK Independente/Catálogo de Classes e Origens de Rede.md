---
title: Catálogo de Classes e Origens de Rede
tags:
  - catalogo
  - classes-dex
  - endpoints
  - auditoria
  - rea
date: 2026-10-20
---

# 🌐 Catálogo de Classes e Origens de Rede

Registro dos artefatos catalogados pela inspeção do REA, diferenciando fatos observados de suposições operacionais.

Voltar ao [[05 - Especificação de SDK Independente|Dossiê do SDK]] ou ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 📦 1. Mapeamento de Classes `com.duolingo`

* **Universo Geral**: 76.741 classes analisadas pelo motor JADX (e 91.761 definições nos 10 arquivos DEX 039).
* **Classes do Domínio Duolingo**: **9.021 correspondências** sob o namespace `com.duolingo` (Evidência REA: `ev_581755dbf6a98201ad0e7289f086b5bd123784852ee20b26e278705d289f59bc`).
* **Classes de Desafio Identificadas**:
  * `ApiGuess` (com subclasses `Int`, `Null`, `String`, `StringList` — evidência `ev_07d5a62efbd12891e1f8fcd491e5fb46e0c289e863c3d3925c58a7486aa7f3a8`).
  * `BlankableToken`, `ChallengeDisplaySettings`, `ChallengeImage`.
  * `LessonProgressBarAndroidView` (17 métodos, 15 campos — animação com `ArgbEvaluator` e `ValueAnimator`).

---

## 📡 2. Origens Literais de URL Encontradas

A busca em strings descompiladas encontrou **194 origens de URL**:

> [!CAUTION] Limitação de Auditoria
> A presença de uma URL em strings descompiladas **não prova**:
> - Que o endpoint está ativo ou operacional em 2026;
> - Que o aplicativo envia dados para ela em fluxos normais;
> - Qual é o protocolo de autenticação requerido.
> Nenhuma chamada ativa foi disparada para servidores remotos para preservar o isolamento local.

### Categorias Principais de Origens:
1. **Domínios Oficiais**: `duolingo.com`, subdomínios de API e CDNs de mídia.
2. **Infraestrutura e Analytics**: Adjust, Sentry, Google APIs, Firebase, Amazon AWS S3.
3. **Publicidade e Monetização**: IronSource, Unity Ads, Google AdMob.

---

## 🔗 Notas Relacionadas
* [[Visão Geral e Identidade do APK]]
* [[Dossiê de Evidências REA e Hashes]]
* [[Contratos TypeScript (contracts.ts)]]

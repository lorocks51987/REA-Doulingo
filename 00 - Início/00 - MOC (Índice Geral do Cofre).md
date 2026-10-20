---
title: MOC - Mapa Geral de Conteúdo do Cofre
tags:
  - moc
  - engenharia-reversa
  - duolingo
  - gamificacao
  - ack-admy
  - sdk
  - compendios
date: 2026-10-20
status: concluído
version: 2.0.0
---

# 🧭 MOC — Mapa Geral de Conteúdo (Duolingo, REA & ACK-ADMY)

Bem-vindo ao **Cofre Central de Engenharia Reversa, Gamificação e Especificação de Software**. Este repositório de conhecimento reúne de forma densa e estruturada todas as descobertas da descompilação do aplicativo Duolingo via REA (JADX + Ghidra), cruzadas com as pesquisas científicas públicas e consolidadas na especificação de um SDK independente e blueprint para o projeto **ACK-ADMY**.

---

## 📚 Compêndios Mestres (Leituras Principais Densas e Detalhadas)

Para uma imersão profunda em cada área, consulte os 4 compêndios técnicos de referência:

* 🔬 [[COMPENDIO-ANALISE-TECNICA-COMPLETA]] — **Engenharia Reversa Completa do APK**: 91.761 definições DEX, os 50 namespaces, 477 componentes no manifesto, ciclo do `DuoApp`, Ghidra ARM64, Unity IL2CPP, Rive, classes `ApiGuess` e barra de progresso interpolada.
* 🎮 [[COMPENDIO-GAMIFICACAO-E-PSICOLOGIA]] — **Gamificação e Psicologia Comportamental**: O modelo Hook de retenção, neurobiologia da ofensiva (*Streak*), o colapso de *Vidas (Hearts)* e ascensão de *Energia (Energy)*, Diamond Tournament, Duolingo Score e os novos verticais (Math, Music, Chess).
* 📐 [[COMPENDIO-ESPECIFICACAO-SDK-COMPLETA]] — **Especificação Técnica do SDK Independente**: Metodologia epistêmica de 7 marcadores, formulação matemática do HLR ($p = 2^{-\Delta/h}$), modelo neural Birdbrain, contratos TypeScript completos (`contracts.ts`), máquina de estados de sessão, 11 tipos de exercícios e ledger append-only imutável.
* 🛡️ [[COMPENDIO-BLUEPRINT-ACK-ADMY]] — **Blueprint de Aplicação Prática no ACK-ADMY**: Transposição das mecânicas para cibersegurança (Escudos Digitais, Energia de Investigação), divisão estrita de Aluno vs Admin, arquitetura web/PWA mobile-first e checklist rigoroso de qualidade.

---

## 🗺️ Navegação por Tópicos Específicos

### 🔬 01. Análise Técnica e Arquitetura do APK
* [[COMPENDIO-ANALISE-TECNICA-COMPLETA]] *(Compêndio Mestre)*
* [[Visão Geral e Identidade do APK]] — Metadados, SHA-256 e escopo do arquivo local de 200 MB.
* [[Arquitetura Híbrida (Android DEX vs Unity vs Rive)]] — Como o app orquestra Kotlin, Unity C++ e animações vetoriais.
* [[Ciclo de Vida e Performance (DuoApp)]] — Inicialização em tempo crítico e injeção postergada de dependências.
* [[Camada Nativa e JNI (Ghidra & C++)]] — Engenharia reversa em `libgame.so` e tratamento de exceção com Ghidra.
* [[Segurança, Ofuscação e Comunicação de Rede]] — Proteção R8/ProGuard e modelo de validação no servidor.

### 🎮 02. Mecânicas de Gamificação e Psicologia
* [[COMPENDIO-GAMIFICACAO-E-PSICOLOGIA]] *(Compêndio Mestre)*
* [[Psicologia do Loop de Engajamento]] — Gatilho, ação, recompensa variável e aversão à perda.
* [[Sistema de Microlições e Trilha de Aprendizado]] — Microlições de 3 a 5 min e eliminação de fadiga decisória.
* [[Sequência (Streak), Vidas e Ligas]] — A tríade de retenção diária e a dinâmica semanal de 30 estudantes.
* [[Microinterações e Feedback Visual com Rive]] — O papel do som em latência zero e animações vetoriais dinâmicas.

### 🚀 03. Aplicações para o ACK-ADMY e LingoLab
* [[COMPENDIO-BLUEPRINT-ACK-ADMY]] *(Compêndio Mestre)*
* [[Diretrizes de UX e UI Educacional]] — Padrões de design mobile-first e acessibilidade para o ACK-ADMY.
* [[Modelo de Implementação Própria (Clean-Room)]] — Diretrizes éticas e legais de reimplementação independente.

### 🗃️ 04. Evidências e Referências
* [[Dossiê de Evidências REA e Hashes]] — Registros de evidências (`ev_*`) do REA e hashes criptográficos.
* [[Inventário de Classes e Bibliotecas ELF ARM64]] — Lista das 22 bibliotecas nativas e contadores brutos.

### 💻 05. Especificação de SDK Independente
* [[COMPENDIO-ESPECIFICACAO-SDK-COMPLETA]] *(Compêndio Mestre)*
* [[Dossiê Técnico e Especificação do SDK]] — O documento base com matriz de evidências e limitações.
* [[Contratos TypeScript (contracts.ts)]] — Interfaces e tipos de dados do núcleo pedagógico.
* [[Ciclo de Vida da Sessão e Máquina de Estados]] — Diagrama de estados da sessão e idempotência de transação.
* [[Tipos de Exercícios e Políticas de Correção]] — Catálogo dos 11 formatos e políticas contra normalização cega.
* [[Repetição Espaçada e Modelos de Retenção (HLR & Birdbrain)]] — Algoritmos matemáticos de retenção.
* [[Economia, Vidas vs Energia e Ledger de XP]] — Livro-razão append-only e comparação Hearts vs Energy.
* [[Catálogo de Classes e Origens de Rede]] — Mapeamento das classes `com.duolingo` e 194 URLs literais.

---

## 📊 Grafo de Conhecimento (Graph View)

> [!TIP] Dica de Navegação no Obsidian
> Pressione **`Ctrl + G`** para abrir o **Graph View**. Observe os quatro grandes polos centrais formados pelos **Compêndios Mestres**, conectando os nós de baixo nível de engenharia reversa aos nós de produto, design e código TypeScript!

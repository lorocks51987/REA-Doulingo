# 🦉 REA-Doulingo: Dossiê de Engenharia Reversa, Gamificação e SDK Independente

Repositório dedicado à análise estática profunda, descompilação (JADX, Ghidra 12.1, Smali) e especificação de software do aplicativo **Duolingo** (versão Android `6.101.2`, build `2476`), executada localmente utilizando o framework **REA (Reverse Engineer Anything)**.

---

## 📄 Dossiê Completo em PDF para Leitura

Todo o material consolidado (análises técnicas, psicologia comportamental, modelos matemáticos, contratos de software e código de referência) foi compilado em um **livro técnico em PDF de alta resolução**:

👉 **[Baixar / Abrir o Dossiê Técnico Completo (PDF)](DOSSIE-DUOLINGO-COMPLETO.pdf)**  
*(Também disponível em [`duolingo-analysis/reports/dossie-duolingo.pdf`](duolingo-analysis/reports/dossie-duolingo.pdf))*

---

## 🔬 1. Identidade e Metadados do Artefato

* **Arquivo Analisado**: `Duolingo v6.101.2 (Premium).apk`
* **SHA-256**: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`
* **Tamanho**: `200.160.388 bytes` (~200 MB)
* **Entradas no ZIP**: `17.882` arquivos
* **Código DEX**: 10 arquivos DEX 039 com **91.761 definições de classe** (76.741 classes consolidadas no JADX).
* **Pacote Proprietário**: **9.021 classes** sob o namespace `com.duolingo`, divididas em 50 módulos funcionais.
* **Superfície Android**: **477 componentes** no manifesto (233 activities, **210 activity-aliases** para troca dinâmica de ícones da coruja na tela inicial, 17 receivers e 13 services) e 40 permissões declaradas.
* **Camada Nativa**: 81 bibliotecas nativas, sendo 22 bibliotecas ELF ARM64-v8a.

---

## 🏗️ 2. Arquitetura Híbrida em Três Camadas

```
┌────────────────────────────────────────────────────────┐
│               1. CAMADA ANDROID (DEX)                  │
│  Kotlin / Java | 9.021 classes com.duolingo            │
│  Ciclo de Vida (DuoApp), Sessão, Rede e Sentry         │
└──────────────────────────┬─────────────────────────────┘
                           │ JNI / C++ Bridge
            ┌──────────────┴──────────────┐
            ▼                             ▼
┌──────────────────────────┐ ┌──────────────────────────┐
│   2. MOTOR RIVE (C++)    │ │  3. MOTOR UNITY (IL2CPP) │
│  librive.so (~3.8 MB)    │ │  libil2cpp.so (~29 MB)   │
│  libgame.so (~4.5 MB)    │ │  libunity.so (~20 MB)    │
│  Animações vetoriais,    │ │  Minigames com física,   │
│  State Machines e        │ │  interações lúdicas e    │
│  visemas dos personagens │ │  proteção contra fraude  │
└──────────────────────────┘ └──────────────────────────┘
```

1. **Camada DEX (Kotlin)**: Controla o produto, navegação, banco SQLite/Room local e chamadas à API remota.
2. **Motor Rive (C++)**: Renderiza a coruja Duo e os personagens em gráficos vetoriais minúsculos acoplados a **máquinas de estado** e **visemas labiais sincronizados por fonemas**.
3. **Motor Unity + IL2CPP (C++)**: Executa os minigames pesados a partir de binário C++ compilado.
4. **Ponte JNI (`libgame.so` no Ghidra)**:
   * `GameActivityEventsInit`: Fila assíncrona de toques e eventos de hardware do NDK.
   * `_ShowImpl`: Elevação suave do teclado virtual Android sem congelar a engine gráfica.
   * `libunwind`: Tratamento de falhas em C++ para evitar crashes silenciosos.

---

## ⚡ 3. Inicialização Crítica e Telemetria de Evasão (Churn)

* **`DuoApp.onCreate()`**: Captura `SystemClock.elapsedRealtimeNanos()` antes do carregamento do sistema e conecta-se ao Sentry Performance para auditar o caminho crítico de abertura (*Cold Start*).
* **Injeção Tardia (`s8m / lazyDependencies`)**: Módulos pesados (TTS, áudio e banco) só sobem no momento em que o aluno clica para iniciar um exercício.
* **Predição de Retorno no Dia Seguinte**:
  * Classes `TomorrowReturnProbabilityRemoteDataSource` e `TomorrowReturnProbabilityFeatureSet`.
  * Valida as chaves `latest_tomorrow_prob` e `previous_tomorrow_prob` em relação à data atual via `/v1/features`.
  * Se a probabilidade de retorno cair, o sistema concede automaticamente um congelamento preventivo de sequência (`ChurnStreakFreezeRewardView`) e agenda ícones tristes de inatividade na tela inicial (cooldown de 1 a 3 dias via `activity-alias`).

---

## 🧩 4. O Pipeline de Questões Desmistificado

A análise encerrou o mito de que *"ou tudo é pré-cadastrado ou uma IA gera tudo ao vivo"*:

1. **Autoria (Offline)**: Linguistas criam frases e metas pedagógicas com auxílio de LLMs;
2. **Geração Algorítmica de Variantes**: Uma **única frase** origina múltiplos exercícios (lacunas, ordenação de blocos com distratores automáticos, ditado e compreensão auditiva);
3. **Montagem de Sessão (No Servidor)**: Ao receber POST `/sessions`, o **Session Generator** e a IA **Birdbrain** selecionam 10 a 15 exercícios sob medida para calibrar a taxa de acerto do aluno em ~82%;
4. **Conversação Generativa**: Restrita a recursos de IA como a chamada de vídeo com a Lily (*Video Call* no plano Max).
5. **Tipagem de Resposta (`ApiGuess`)**: O cliente Android formata as tentativas através das subclasses `ApiGuess.Int` (múltipla escolha), `ApiGuess.String` (texto livre), `ApiGuess.StringList` (tokens arrastados) ou `ApiGuess.Null` (pulos/timeout).

---

## 🎮 5. Gamificação, Psicologia Comportamental e Economia

* **Aversão à Perda e o *Streak***: A dor psicológica de perder o fogo de 100 dias mantém a disciplina diária. O *Friend Streak* adiciona responsabilidade social com até 5 amigos simultâneos.
* **Transição de Vidas (*Hearts*) para Energia (*Energy*)**: A substituição do modelo punitivo de corações por um sistema de energia contínua eliminou o medo de errar, tornando a revisão final de erros 100% gratuita.
* **Sorteio Ponderado Comprovado no Smali (`defpackage.cid.b`)**: Algoritmo cliente de amostragem usando `java.util.Random.nextDouble() * totalWeight` com operadores lógicos (`InLessonRewardRequirement`) para conceder Energia bônus.
* **Ligas e Diamond Tournament**: Microgrupos balanceados de 30 alunos (evitando tabelas globais desmotivadoras) com fechamento semanal às 22h de domingo.
* **Métrica TSLW (*Time Spent Learning Well*)**: Foco em tempo útil na trilha principal + 0.5 × tempo em práticas paralelas.

---

## 🧠 6. Modelos Matemáticos

* **Half-Life Regression (HLR)**: Modelagem matemática do esquecimento da memória humana:
  $$p = 2^{-\frac{\Delta}{h}} \quad \text{com} \quad h = 2^{\theta \cdot x}$$
  Onde $\Delta$ é o intervalo transcorrido e $h$ é a meia-vida calculada pelo produto escalar de pesos $\theta$ e características $x$.
* **Birdbrain e Zona de Flow**: Calibragem da dificuldade para manter o aluno na faixa de **80% a 85% de acertos**, evitando tédio (>95%) ou frustração (<65%).
* **Sleeping Bandit**: Seleção de notificações com penalidade temporal de recência para evitar a fadiga do usuário.

---

## 💻 7. O Núcleo Executável de Referência (`reference-engine.mjs`)

O repositório inclui uma implementação original e funcional em JavaScript puro (ES Modules) das regras de gamificação, totalmente coberta por testes automatizados:

```bash
# Executar a suíte de testes (sem dependências externas)
node --test duolingo-analysis/gamification-sdk/reference-engine.test.mjs
```

### Funcionalidades do Motor:
* `recordAttempt`: Registro idempotente de tentativas (`correct`, `wrong`, `ungraded`), com rastreio de `currentRun`, `bestRun` e emissão de efeitos visuais.
* `previewXp`: Cálculo racional rígido com `BigInt` (sem erros de float), escolha estrita do maior boost ativo sem empilhamento indevido e bônus de combo/perfeição.
* `drawReward`: Sorteio ponderado determinístico normalizado a partir de amostras unitárias.
* `advanceQuest` e `claimQuest`: Progresso de missões e resgate de baús à prova de clique duplo.
* `rankCohort`: Classificação de ligas com critérios de desempate por XP, chave e ID.

---

## 🗂️ 8. Estrutura do Repositório e Cofre Obsidian

O repositório foi organizado como um **Cofre Obsidian** navegável:

```text
├── DOSSIE-DUOLINGO-COMPLETO.pdf                  # Dossiê técnico completo em PDF
├── 00 - Início/                                  # MOC (Mapa Central do Cofre)
├── 01 - Análise Técnica Duolingo/                # Compêndio técnico e descompilações
├── 02 - Mecânicas e Gamificação/                 # Compêndio de gamificação e psicologia
├── 03 - Diretrizes de Implementação e UX/        # Diretrizes de design e mobile-first
├── 04 - Evidências e Referências/                # Hashes SHA-256 e IDs REA (ev_*)
├── 05 - Especificação de SDK Independente/       # Contratos TypeScript e máquina de estados
└── duolingo-analysis/
    ├── docs/                                     # Relatórios de telemetria e arquitetura
    ├── gamification-sdk/                         # Motor executável (reference-engine.mjs)
    └── reports/                                  # HTML e PDF compilados
```

---

## ⚖️ Conformidade e Isenção Legal

Este projeto constitui um trabalho de **pesquisa técnica, interoperabilidade e engenharia reversa** para fins educacionais e científicos. Nenhuma API privada foi atacada, nenhum código-fonte proprietário protegido foi incorporado ao motor de referência, e nenhum termo de confidencialidade foi violado. Duolingo é marca registrada da Duolingo, Inc.

---
title: Compêndio Técnico Completo de Engenharia Reversa do Duolingo
tags:
  - compendio
  - engenharia-reversa
  - apk
  - jadx
  - ghidra
  - arm64
  - dex
  - unity
  - rive
date: 2026-10-20
version: 1.0.0
---

# 🔬 Compêndio Técnico Completo: Engenharia Reversa do APK Duolingo

Este documento consolida exaustivamente todas as evidências observadas (`APK-OBS`), estruturas recuperadas (`APK-DER`) e análises estáticas conduzidas localmente no binário do Duolingo utilizando o framework **REA (Reverse Engineer Anything)**, **JADX headless 0.7.1**, **Ghidra 12.1 (AArch64)** e inspeção profunda de pacotes.

Voltar ao [[00 - MOC (Índice Geral do Cofre)|MOC Central]].

---

## 1. Identidade e Metadados Criptográficos do Artefato

* **Arquivo Local**: `duolingo-analysis/binaries/Duolingo v6.101.2 (Premium).apk`
* **Nome do Pacote**: `com.duolingo`
* **Versão Declarada**: `6.101.2` (Código de Versão: `2476`)
* **Tamanho do Arquivo**: `200.160.388 bytes` (~200 MB)
* **Entradas no ZIP**: `17.882` entradas
* **Hash SHA-256**: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`
* **Ambiente de Análise**: Temurin JDK 21.0.12.1 (64-bit), Windows x64.
* **SDK Mínimo (`minSdkVersion`)**: `29` (Android 10)
* **SDK Alvo (`targetSdkVersion`)**: `36` (Android 16 preview)
* **Classe Central de Aplicação**: `com.duolingo.core.DuoApp`
* **Activity Inicial de Lançamento**: `com.duolingo.splash.LaunchActivity`
* **Metadados Unity Extraídos**: `6.933.960 bytes` em assets Unity compilados.

> [!CAUTION] Ressalva de Autenticidade
> A designação "Premium" reflete o nome do arquivo recebido localmente. A assinatura digital do APK perante as chaves oficiais da Duolingo Inc. na Google Play Store não foi validada nesta sessão; modificações de terceiros não foram atestadas.

---

## 2. Métricas de Código e Descrepância de Contagem DEX vs. Engine

A análise física dos cabeçalhos dos arquivos `.dex` revelou:
* **Total de Arquivos DEX**: 10 arquivos (`classes.dex` até `classes10.dex`, formato DEX 039).
* **Definições de Classes nos Cabeçalhos DEX**: **91.761 definições de classe**.
* **Classes Carregadas pelo Modelo JADX**: **76.741 classes**.
* **Classes Pertencentes ao Namespace `com.duolingo`**: **9.021 classes** (Evidência REA: `ev_581755dbf6a98201ad0e7289f086b5bd123784852ee20b26e278705d289f59bc`).

*Explicação Técnica da Discrepância (91.761 vs 76.741)*: A diferença numérica decorre da forma como o JADX consolida classes sintéticas geradas pelo compilador Kotlin (lambdas, adaptadores D8/R8, pontes de acesso privado e classes anônimas com `$`) em relação às definições puras dos índices DEX.

---

## 3. Distribuição Completa dos 50 Namespaces do Produto

As 9.021 classes exclusivas do aplicativo dividem-se em 50 módulos funcionais:

| Namespace (`com.duolingo.*`) | Classes | Classes Críticas e Papel no Sistema |
| :--- | :---:| :--- |
| **`core`** | 2.342 | `DuoApp`, `AccountService`, `AdjustUtils`, `challenges.*`, `performance.*` |
| **`data`** | 2.009 | `LeaderboardType`, `LeaguesReactionVia`, `achievements.Achievement` |
| **`feature`** | 1.214 | `AchievementNumberCharacter`, renderização de camadas de assets de conquistas |
| **`session`** | 439 | `BaseSessionActivity`, `EasierLessonNudgeDialogFragment`, fluxo de lição |
| **`plus` / `super`** | 281 | `AggressiveFreeTrialHookFragment`, `HorizontalPurchaseOptionView` |
| **`debug`** | 221 | `AchievementsV4LocalProgressDebugDialogFragment`, `AddPastXpDialogFragment` |
| **`signuplogin`** | 204 | `AbstractEmailAndPhoneLoginFragment`, rotinas de autenticação OAuth e credenciais |
| **`sessionend`** | 201 | `AdventuresSessionEndArgs`, `FrameFirstLessonFragment`, tela de celebração |
| **`streak`** | 194 | `StreakCountView`, `StreakIncreasedHeaderRedesignView`, `StreakNudgeHeaderView` |
| **`profile`** | 160 | `BaseProfileFragment`, `ChinaModerationView`, adaptadores de cursos |
| **`home`** | 144 | `CurrencyToolbarItemView` (gemas/cristais), `DuoTabView`, bandeiras de idioma |
| **`adventureslib`** | 133 | `AdventureObject`, `AdventureStage`, narrativa contextual de minigames |
| **`videocall`** | 133 | `AdventuresTaskCompletionData`, controle de animação para chamada com IA (Lily) |
| **`onboarding`** | 126 | `AcquisitionSource`, questionários iniciais de pesquisa e nivelamento |
| **`feedback`** | 102 | `AdminSubmittedFeedbackFragment`, envio de relatórios de erro de digitação |
| **`ai`** | 92 | `TomorrowReturnProbabilityDebugDialogFragment`, telemetria de evasão (*churn*) |
| **`goals`** | 92 | `ComebackXpBoostRewardState`, Daily Quests e baús escalonados |
| **`feed`** | 69 | `AvatarsWithReactionsView`, feed social de progresso de amigos |
| **`rampup`** | 69 | `RampUpTimerBoostView`, desafios contra o relógio de dificuldade progressiva |
| **`leagues`** | 64 | `ContestScreenState`, `LeagueRepairOfferViewModel` (reparo de rebaixamento) |
| **`settings`** | 59 | `EnableSocialFeaturesBottomSheetFragment`, seletores de hora de lembrete |
| **`speechrecognition`** | 48 | `AudioFormat`, `FlashcardsGradingRequest`, pipeline de envio de voz |
| **`notifications`** | 45 | `DelayedReminderWorker`, `ExpireStalePushesWorker`, `FcmIntentService` |
| **`maker`** | 44 | `MultiSourceAudioPlayer`, curvas de interpolação e animação de interface |
| **`stories`** | 42 | `HardcodedStorySessionsDialogFragment`, motor de diálogos interativos |
| **`duoradio`** | 40 | `DuoRadioArrangeChallengeFragment`, exercícios de compreensão auditiva longa |
| **`explanations`** | 35 | `AccurateWidthExplanationTextView`, explicações gramaticais na lição |
| **`adventures`** | 33 | `AdventuresChoiceImageFragment`, episódios gráficos com escolhas |
| **`chess`** | 33 | `ChessGameReviewActivity`, `ChessMatchQuitBottomSheetFragment` (Xadrez) |
| **`achievements`** | 29 | `AchievementV4DetailFragment`, progresso de medalhas e recompensas |
| **`report`** | 29 | `ReportActivity`, reporte de traduções incorretas ou áudio inaudível |
| **`shop`** | 29 | `RewardedVideoAwardActivity`, compra de congelamento de streak e cosméticos |
| **`energy`** | 27 | `EnergyDripConfirmationActivity`, rotinas do sistema moderno de Energia |
| **`legendary`** | 26 | `LegendaryAttemptPurchaseOrigin`, desafios de nível Lendário na trilha |
| **`messages`** | 26 | `AgeBackfillAgeInputActivity`, avisos de conformidade e verificação etária |
| **`alphabets`** | 19 | `AnimatingStrokeView`, traçado interativo de alfabetos (Kana, Cirílico, Hangul) |
| **`rewards`** | 19 | `AddFriendsRewardsActivity`, bonificações de gemas por convite social |
| **`splash`** | 19 | `CombinedLaunchHomeBridge`, redirecionador rápido de tela inicial |
| **`share`** | 18 | `ImageShareBottomSheetV2`, gerador de imagens para Instagram Stories e WhatsApp |
| **`liveevents`** | 15 | `EventsSocialCollaborationIntroActivity`, eventos ao vivo em comunidade |
| **`grade`** | 14 | `Base`, `Blame`, `CompactForms`, modelo de correção e atribuição de erro |
| **`mathgrade`** | 14 | `MathEntity$ShapeNameType`, `MathEntity$SymbolType` (avaliação de matemática) |
| **`androidmath`** | 9 | `MTMathView`, renderizador de fórmulas e frações matemáticas |
| **`music`** | 7 | `InstrumentTabFragment`, `SongLandingActivity`, teclado e percepção musical |
| **`ads`** | 6 | `BackendInterstitialAdDecisionRequest`, tomada de decisão de exibição de anúncios |
| **`excess`** | 5 | `AnalyticsUserPropertyTracker`, telemetria de propriedades de usuário |
| **`promocode`** | 5 | `QueryPromoCodeResponse`, resgate de vouchers e cupons promocionais |
| **`web`** | 5 | `WebViewActivity`, renderização de termos legais e suporte |
| **`user`** | 4 | `RefreshLoggedInUserWorker`, sincronização em segundo plano da conta |
| **`xpboost`** | 4 | `XpBoostAnimatedRewardActivity`, ativação do dobro de XP por 15 minutos |
| **`deeplinks`** | 3 | `DeepLinkHandler`, roteamento a partir de notificações push e links web |
| **`referral`** | 3 | `ReferralInterstitialActivity`, programa de indicação de novos estudantes |
| **`wechat`** | 3 | `WeChatFollowInstructionsActivity`, integração com o ecossistema chinês |
| **`billing`** | 2 | `GooglePlayBillingManager`, ciclo de compra de assinaturas via Google Play |
| **`delaysignup`**| 2 | `MarketingOptInFragment`, navegação como visitante antes do cadastro |
| **`math`** | 2 | `MathTutorActivity`, tutor inteligente de exercícios matemáticos |
| **`resurrection`**| 2 | `ResurrectionAppUpdateDialogFragment`, recuperação de usuários inativos há meses |
| **`schools`** | 2 | `SchoolsClassroom`, suporte a turmas escolares e acompanhamento por professor |
| **`transliterations`** | 2 | `BlankableJuicyTransliterableTextView`, conversão fonética de ideogramas |
| **`mathcalculator`** | 1 | `CursorType`, calculadora integrada para resolução de problemas numéricos |
| **`tieredchest`** | 1 | `DailyQuestTieredChestsTreatmentContext`, baús de recompensas escalonadas |

---

## 4. O Manifesto Android e Superfície de Ataque/Exposição

A inspeção do `AndroidManifest.xml` revelou uma superfície massiva:
* **Total de Componentes**: **477 componentes**.
  * **Activities**: 233
  * **Activity-Aliases**: 210 (utilizados principalmente para troca dinâmica do ícone do aplicativo na tela inicial do celular, adaptando a expressão da coruja Duo conforme o Streak ou dias de inatividade).
  * **Receivers de Broadcast**: 17
  * **Services**: 13
  * **Content Providers**: 4
* **Componentes com `android:exported="true"`**: 228 componentes declarados explicitamente como exportados (atenção: requer validação rigorosa de permissões internas para prevenir invocação indevida por outros apps maliciosos instalados no mesmo dispositivo).
* **40 Permissões Declaradas**: Internet, gravação de áudio (`RECORD_AUDIO`), câmera, leitura e escrita de calendário (`READ_CALENDAR`, `WRITE_CALENDAR`), notificações (`POST_NOTIFICATIONS`), boot completo (`RECEIVE_BOOT_COMPLETED`), vibração e verificação de rede.

---

## 5. Decompilação do Ciclo Crítico: `com.duolingo.core.DuoApp`

A descompilação de `DuoApp.java` (arquivo preservado em `duolingo-analysis/logs/duolingo-DuoApp.java`) expõe a engenharia extrema aplicada ao tempo de inicialização (*Cold Start*):

```java
// Trecho observado no bytecode JADX
public final class DuoApp extends qmj {
    public qa90 A;
    public bqx B;
    public s8m C; // lazyDependencies
    public final LinkedHashSet D = new LinkedHashSet();
    public AdjustInstance b;
    public wq70 z; // timerTracker

    @Override
    public final void onCreate() {
        f fVar = f.w;
        long jUptimeMillis = SystemClock.uptimeMillis();
        f fVarC = f.c();
        g gVar = fVarC.f;
        if (gVar.c == 0) {
            gVar.f(jUptimeMillis);
            fVarC.i(this);
        }
        Duration durationOfNanos = Duration.ofNanos(SystemClock.elapsedRealtimeNanos());
        kqr.n = n6z.A;
        super.onCreate();
        
        // Carga estritamente postergada
        s8m s8mVar = this.C;
        if (s8mVar == null) {
            jcl.O("lazyDependencies");
            throw null;
        }
        Object obj = s8mVar.i.get();
        // ...
    }
}
```

### Análise das Decisões de Arquitetura do `DuoApp`:
1. **Medição Nanométrica**: O app captura `SystemClock.elapsedRealtimeNanos()` antes de invocar `super.onCreate()`, garantindo precisão total de métricas de inicialização.
2. **Injeção Tardia (`s8m / lazyDependencies`)**: Evita a instanciação prematura de módulos de som, reconhecimento de voz e banco de dados durante a subida do processo.
3. **Gerenciamento de Erros via Sentry Performance**: Monitoramento contínuo de quadros congelados (*frozen frames*) para evitar penalizações pelo algoritmo da Google Play Console.

---

## 6. Inspeção de Classes de Desafio: `ApiGuess` e `LessonProgressBar`

### A. Tipagem de Resposta: `ApiGuess`
* Evidência: `ev_07d5a62efbd12891e1f8fcd491e5fb46e0c289e863c3d3925c58a7486aa7f3a8`
* Estrutura interna:
  * `com.duolingo.core.challenges.ApiGuess$Int`: Valor inteiro representando a alternativa escolhida.
  * `com.duolingo.core.challenges.ApiGuess$String`: Texto livre preenchido na tradução.
  * `com.duolingo.core.challenges.ApiGuess$StringList`: Lista ordenada de identificadores de palavras arrastadas.
  * `com.duolingo.core.challenges.ApiGuess$Null`: Resposta ausente ou desafio pulado.

### B. Animação da Barra de Progresso: `LessonProgressBarAndroidView`
* Evidência: `ev_08e146d192677902b60a807a85d622cc71afed33001cc145181d0511cdb9ea16`
* Contém 17 métodos e 15 campos declarados.
* Utiliza `ArgbEvaluator` acoplado ao `ProgressBarStreakColorState` para realizar a interpolação suave da tonalidade da barra, transmitindo reforço visual contínuo sem solavancos de renderização.

---

## 7. Camada Nativa ARM64 e Engenharia Reversa no Ghidra

O APK empacota 81 bibliotecas nativas somando todas as arquiteturas, sendo 22 bibliotecas em `lib/arm64-v8a`:

```
lib/arm64-v8a/
├── libil2cpp.so          (~29 MB) - Código Unity compilado para binário C++
├── libunity.so           (~20 MB) - Runtime gráfico da engine Unity
├── libgame.so            (~4.5 MB) - Loop de eventos proprietário de jogo
├── librive.so            (~3.8 MB) - Motor vetorial C++ do Rive
├── librive-android.so    (~1.2 MB) - Camada de integração JNI do Rive
├── libduolingounity.so   (~1.2 MB) - Ponte JNI entre a interface Android e Unity
└── libmain.so            (~250 KB) - Ponto de entrada nativo padrão
```

### Funções Extraídas e Analisadas no Ghidra (`libgame.so`):
* **`GameActivityEventsInit`**: Configura a fila de processamento assíncrono de eventos de toque, gestos e janelas do Android NDK.
* **`_ShowImpl`**: Aciona via JNI o `InputMethodManager` do sistema operacional para elevar suavemente o teclado virtual Android sem interromper o loop da engine gráfica.
* **Tratamento de Exceções (`libunwind`)**: Captura falhas críticas de ponteiros nulos em C++ e gera dump estruturado para a telemetria, prevenindo encerramento forçado silencioso (*silent crash*).

---

## 8. Segurança, Ofuscação e Catálogo de Rede

1. **Ofuscação R8/ProGuard**: A esmagadora maioria das classes de negócio do APK utiliza nomes minificados de 1 a 3 caracteres (`defpackage.b89`, `defpackage.Ped`), com remoção extensiva de tabelas de símbolos e inlining de métodos.
2. **Origens de Rede Encontradas**:
   * Foram indexadas **194 origens de URL** em strings literais.
   * Domínios pertencentes à operação do Duolingo, CDNs de mídia da Amazon CloudFront/S3, endpoints de telemetria do Sentry (`o18448.ingest.sentry.io`), Adjust e redes de publicidade integrada.
   * Nenhuma requisição exploratória ativa foi realizada contra tais origens durante a análise para preservar total isolamento local.

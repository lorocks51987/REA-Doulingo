# Análise estática do APK Duolingo — 20/10/2026

## Alvo e validação desta rodada

Arquivo: `C:\dev\REA\duolingo-analysis\binaries\Duolingo v6.101.2 (Premium).apk`.

SHA-256: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`.

A leitura direta do arquivo confirmou 200.160.388 bytes, 17.882 entradas ZIP, 10 arquivos DEX versão 039, 91.761 definições de classes nos cabeçalhos e 81 bibliotecas `.so`. O membro `assets/bin/Data/Managed/Metadata/global-metadata.dat` tem 6.933.960 bytes. Evidência local: [artifact-identity.json](artifact-identity.json), produzida por leitura ZIP/cabeçalhos, sem executar o APK; não é um registro REA.

Existem dois APKs no diretório `binaries`. Esta análise usa o 6.101.2, cuja identidade coincide com as evidências anteriores. Não compara a versão 5.158.4. O nome “Premium” não autentica a distribuição: assinatura e correspondência com uma versão oficial continuam sem verificação.

## Estrutura recuperada

A busca anterior REA/JADX, reexaminada nesta rodada, contém 9.021 correspondências de `com.duolingo`, num universo de 76.741 classes reportadas pelo engine. Seu SHA-256 de alvo coincide com o arquivo atual. Evidência: `ev_581755dbf6a98201ad0e7289f086b5bd123784852ee20b26e278705d289f59bc`, em [classes-duolingo.json](../audit-2026-10-19/classes-duolingo.json).

As 76.741 classes do engine não equivalem às 91.761 definições dos cabeçalhos DEX. A diferença permanece sem explicação comprovada; não há cobertura integral de decompilação.

| Área | Exemplos observados no inventário de classes | Alcance da conclusão |
|---|---|---|
| Exercícios | `core.challenges.ApiGuess`, `BlankableToken`, `ChallengeDisplaySettings`, `ChallengeImage` | Existem representações de desafios; avaliação completa não rastreada |
| Sessões e progresso | `data.session.progressbar.LessonProgressBarAndroidView`, `SessionQuitSoundEffect`, `SessionQuitHaptics` | Existem pontos para progresso e feedback; nomes não comprovam comportamento |
| Sequência | `core.rewards.StreakFreezeReward`, `core.streak.CumulativeLessonStats`, `FreezesToUse` | Há tipos de sequência/proteção; regras finais não recuperadas |
| Ligas | `data.LeaderboardType`, `data.leagues.LeaderboardState` | Há representação de ranking; cálculo remoto desconhecido |
| Loja | `core.shop.ShopItem`, `ShopItemId`, `core.rewards.ShopReward` | Há modelos de loja/recompensa; autorização de compras não investigada |
| Entrada no app | `SaveOnboardingProgressCondition`, `OnboardingLoadingProgressBarExperiment` | Há modelos de onboarding e experimentos |

Esse mapa é um índice de candidatos, não prova de que cada recurso esteja ativo nesta versão ou conta.

## Nova consulta REA: barra de progresso

A consulta focal desta rodada terminou com sucesso via CLI REA/JADX 0.7.1: `ev_08e146d192677902b60a807a85d622cc71afed33001cc145181d0511cdb9ea16`, preservada integralmente em [lesson-progress-class.json](lesson-progress-class.json). O arquivo foi serializado pelo redirecionamento do PowerShell; pode exigir leitura UTF-16LE conforme o consumidor.

`LessonProgressBarAndroidView` apresenta 17 entradas de métodos e 15 campos. Há `onDraw(Canvas)`, `onSizeChanged`, acesso ao progresso como `float`, estado `ProgressBarStreakColorState`, `setProgressColor(int)`, `Paint`, `ArgbEvaluator` e `ValueAnimator`. Isso confirma uma representação Android para desenho/progresso e tipos de animação/cor; os corpos desses métodos não foram decompilados nesta consulta. Não demonstra a fórmula de avanço, a duração das animações ou a integração completa da tela de lição.

## Uma regra efetivamente decompilada: probabilidade de retorno

Reexaminado o corpo de `TomorrowReturnProbabilityRemoteDataSource$TomorrowReturnProbabilityFeatureSet.parseFromFeatures`, na evidência `ev_7e4fbf30db830ab50ee121e18bbda0f0de66d122f63c4d643f9fec14658b6a20`, em [retention-method.json](../audit-2026-10-19/retention-method.json).

O método procura uma feature de data, converte seu valor para `LocalDate` e exige data anterior à data obtida do `Instant` recebido. Depois procura a feature numérica correspondente e cria um objeto com probabilidade, data e instante. Retorna `null` quando faltam valores compatíveis.

Conclusão derivada do corpo decompilado: este método valida e consome uma probabilidade fornecida; ele não contém o treinamento ou os pesos de um modelo de previsão. O uso dessa probabilidade para escolher notificações ou recompensas não foi estabelecido.

## Camada nativa e Ghidra

Foi reexaminado o pseudocódigo já exportado em [ghidra-libduolingounity.txt](../audit-2026-10-19/ghidra-libduolingounity.txt). A evidência é saída direta de Ghidra da rodada anterior, não uma nova execução nem um registro REA desta rodada.

`JNI_OnLoad`, em `00104a80`, registra funções para `com/unity3d/player/NativeLoader`. O carregador em `00104ce4` usa `dlopen`/`dlsym` e referencia `libil2cpp.so`. Isso sustenta a interpretação de uma ponte/carregador Unity. Não sustenta atribuir a esse pequeno módulo toda a lógica pedagógica do app.

A investigação anterior de `libil2cpp.so` ficou parcial: análise atingiu prazo e a exportação foi interrompida antes da amostra de pseudocódigo. A presença do metadata IL2CPP oferece um próximo ponto de investigação, mas não recupera automaticamente o projeto C# original. Consulte [o relatório anterior](../audit-2026-10-19/ANALISE.md) para os limites e logs.

## Implicações para criar um aplicativo semelhante

Como proposta de implementação, o mapa acima permite separar um novo produto em motor de exercícios, sessão/progresso, sequência/recompensas, ranking, onboarding e sincronização. Uma primeira versão pode implementar exercícios próprios, correção, persistência de progresso e sequência diária; regras de ranking e personalização devem ser especificadas explicitamente.

Essa divisão é uma decisão de projeto sugerida, não uma reconstrução comprovada da arquitetura interna. O APK não fornece, por si só, o backend operacional, o banco completo de cursos, os modelos remotos ou o código-fonte original. Nenhum desses itens foi recuperado nesta análise.

## Cobertura e pendências

- Identidade e inventário ZIP/DEX: verificados novamente nesta rodada.
- Mapa de módulos: parcial, derivado do inventário REA anterior com identidade correspondente.
- Barra de progresso: nova inspeção REA de membros concluída; corpos e fluxo de chamadas não examinados.
- Método de retenção: corpo REA anterior reexaminado; consumidores finais não rastreados.
- Ghidra: saída anterior reexaminada; IL2CPP continua parcial.
- Execução Android, tráfego real, comportamento de conta e backend: não observados.
- Autenticidade da distribuição: não verificada.

O runtime compilado da árvore atual do REA está ausente; a CLI local informou esse bloqueio. Foi utilizada uma instalação anterior em cache para a consulta focal bem-sucedida, sem instalar ferramentas nem modificar configuração do cliente. As evidências anteriores foram preservadas com seus caminhos originais internos; a coincidência de digest vincula o APK movido ao mesmo conteúdo.

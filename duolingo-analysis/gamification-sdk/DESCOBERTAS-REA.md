# Descobertas REA: combos, recompensas e competição

Data: 20/10/2026. Análise estática focal, sem executar o APK, conta ou serviços Duolingo.

Alvo: `C:\dev\REA\duolingo-analysis\binaries\Duolingo v6.101.2 (Premium).apk`.

SHA-256: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`. Autenticidade oficial não verificada. Todos os registros REA válidos desta rodada preservam essa identidade. Nenhuma constatação de servidor é deduzida apenas do nome local “Premium”.

## Como a investigação foi realizada

Reutilizados os inventários anteriores para selecionar candidatos. Três consultas iniciais usaram a CLI do REA 6.4.0 instalado em cache, com JADX headless 0.7.1. As consultas seguintes usaram `AndroidAnalysisService` e `createAndroidAnalysisProvider` dessa mesma instalação: são o fluxo compartilhado CLI/MCP do REA, com admissão do APK, snapshot, parser de requisições e composição de Evidence. Não foram substituídos por chamadas diretas a um decompilador sem proveniência.

O adaptador manteve um worker JADX por vez. A instância compartilhada reutilizou a sessão de leitura e foi encerrada por `provider.close()` em `finally`; os registros `*.cleanup.json` preservam o retorno desse encerramento. Não se alteraram as configurações ou o código de produção do REA.

Os arquivos [DISCOVERY-LOCAL.md](DISCOVERY-LOCAL.md), [QUESTOES-APK.md](QUESTOES-APK.md) e [DISTRIBUICAO-LOCAL.md](DISTRIBUICAO-LOCAL.md) contêm observações de shell/smali, com proveniência separada. A extração smali preexistente não foi regenerada nesta rodada. Quando usada como corroboração, essa limitação continua aplicável.

## R1. Não existe apenas um significado de “combo”

**Observado:** `ComboState` tem flag de uso e três inteiros; a inspeção local de sua representação identifica combo atual, maior combo e último recorde. O estado de combo run é outro objeto, que guarda sequência inicial, atual, elegibilidade, histórico de Energia e experimentos. Sequência diária é um terceiro domínio.

Evidências REA: [combo-state-class.json](evidence/combo-state-class.json), `ev_85d2d7c5c71647dfd32d8da9a5db27c8bfbcdcfd87a2a16755d935105fb58f8e`; [combo-session-fields.json](evidence/combo-session-fields.json), `ev_a7897902529c7daa2996f3e6f52cf646bb96a402b4a0f638bf6958721f866f75`.

**Consequência:** não modelar combo, streak diária e boost como um único contador. Identidade de domínio importa para explicar o que foi perdido, mantido ou recompensado.

## R2. Correto, incorreto e sem nota têm caminhos diferentes

**Derivado:** o dispatcher de combo distingue três resultados. O mapeamento de enum foi confirmado separadamente; portanto não se inferiu o significado apenas dos índices de um `switch` decompilado.

| Resultado | Caminho examinado |
|---|---|
| `CORRECT` | Chama atualização com incremento habilitado |
| `WRONG` | Chama reset com motivo de resposta incorreta |
| `NONE` | Chama atualização sem incrementar; não usa o caminho de erro |

Fontes: [combo-grade-transition.json](evidence/combo-grade-transition.json), `ev_294daef96622b07145b400036e55248c0a04331572fb787368508835da898c46`; [grade-map-values.json](evidence/grade-map-values.json), `ev_3e7abb55106e02529bc677a548bb0e4bb4fd45abd193290fd58f49f80093b043`; [combo-increment.json](evidence/combo-increment.json), `ev_9cebce47061c796aa52c879d370dbfd0bde9a0e63644a0fd45bfee167d1259f8`.

**Limite:** a origem de toda classificação `NONE` não foi rastreada. Ela não significa automaticamente “pulou”, “acertou parcialmente” ou “erro de rede”. A rotina de atualização tem outros gates; não afirmar que todo acerto de todo modo incrementa um combo visível.

## R3. O melhor combo pode sobreviver à quebra do atual

**Derivado:** a atualização calcula um candidato de maior contador usando o máximo entre o recorde do estado e o novo contador. No caminho de reset de sessão elegível, a rotina zera o atual e conserva o maior valor considerado, além de registrar um motivo de perda.

Fonte: [combo-reset.json](evidence/combo-reset.json), `ev_6a2f55c9c3379abedff642cef49e5069247cf633c2df3dbc8f9ee38df6232222`, em conjunto com R2 e o mapa de campos R1.

**Limite:** isso descreve o produtor examinado, não política de armazenamento de recorde para todas as modalidades. A decompilação do atualizador relata blocos duplicados; seus ramos completos de onboarding não foram reconstituídos como uma especificação executável do app.

## R4. Perfeição e elegibilidade são gates explícitos

**Derivado:** no estado de combo run examinado, o teste de perfeição combina sessão concluída e todos os desafios marcados como corretos até aquele ponto. O acesso a um contador opcional exige sessão elegível e uma destas condições: sequência inicial positiva ou esse teste de perfeição verdadeiro.

Evidências: [combo-session-perfect.json](evidence/combo-session-perfect.json), `ev_55c2ab541d1e82bf807ef45ed552cf7f1db3d4d6ccdf1f264adbb17d9f69914d`; [combo-session-visible.json](evidence/combo-session-visible.json), `ev_7bb2301892387bae6c0f760e2fca069667cddde3c174ffacb00f0aabf920cb40`; nomes semânticos corroborados pelo `toString` de R1.

**Limite:** contador opcional disponível não prova, sozinho, que uma tela específica o exibe. Não foi rastreado todo produtor do booleano “todos corretos”, especialmente em modalidades que aceitam resposta sem nota.

## R5. Experimento altera como o contador é combinado

**Derivado:** um predicado soma aos gates anteriores uma condição de experimento. Outro método soma o contador inicial a uma quantidade recebida quando esse predicado é verdadeiro; caso contrário devolve apenas a quantidade recebida.

Evidências: [combo-session-experiment.json](evidence/combo-session-experiment.json), `ev_eb61a4ed6deca55b4255f8217c9dd674d476faafa02ef48e0621d6de7300d06a`; [combo-session-offset.json](evidence/combo-session-offset.json), `ev_5af674c78a7f0eeb2b26f4a8e060a2d45e621b8b5ee7b162e26f7ca81a2433da`.

O estado guarda ainda tratamentos de onboarding, reset de limite de Energia, data de criação de usuário e informação de início anterior do combo. Esses campos indicam políticas adicionais; não se recuperou a matriz de atribuição por conta.

**Consequência:** é plausível que usuários vejam resultados diferentes por elegibilidade e variante, mas não foi reproduzida uma conta ou comparação A/B real.

## R6. Abandono por falta de Energia tem tratamento específico

**Derivado:** o método de abandono examinado contém um ramo condicionado por parâmetro de saída, sessão elegível, sequência inicial positiva, marcador anterior de recompensa de Energia e experimento de reset. Seu log associa esse ramo à saída sem Energia, e ele atualiza o estado correspondente.

Fonte: [combo-quit.json](evidence/combo-quit.json), `ev_adcf94571e21c7dd96c38b8d177721e63e4896845906d108f53faf56fe904509`.

**Limites:** o booleano recebido não foi rastreado até todos os chamadores; não universalizar a razão do log a toda invocação. Não concluir que todo abandono quebra o combo, que nunca quebra ou que sempre remove Energia. Há avisos de reconstrução de corrotina.

O método de conclusão também foi decompilado: [combo-complete-persist.json](evidence/combo-complete-persist.json), `ev_79c3c1941bdcdb169724d0817343c7eb39bd51ce7e05ee2b5110f2a225af18c6`. Ele agenda uma operação com usuário/contador e atualiza estado; armazenamento durável e confirmação remota dessa operação não foram acompanhados. O nome do arquivo é rótulo de investigação, não afirmação de persistência concluída.

## R7. Há marcos nomeados de acertos; eles não prometem prêmio

**Observado no inventário REA:** `ComboMoment` declara `IN_A_ROW_5`, `10`, `15`, `20`, `25`, `IN_A_ROW_LONG_SESSION` e `PERFECT`.

Fonte: [energy-combo-class.json](evidence/energy-combo-class.json), `ev_7e7609cbdc33c7a6b9962b2114952bda40c7ed06eba3786c2380c3e4b8916fad`.

**Limites:** enumeração não prova que todos os marcos estejam ativos, nem que todo quinto acerto conceda prêmio. O inicializador decompilado [energy-combo-values.json](evidence/energy-combo-values.json) tem placeholders, apesar do indicador de texto completo; ele não foi tratado como recuperação confiável de todos os nomes serializados. A extração smali anterior oferece corroboração local separada.

## R8. Recompensas de Energia têm um modelo de regras rico

**Observado/derivado da representação:** `InLessonReward` guarda ID, momentos de combo, requisitos de comprimento/tipo de sessão e matéria, exigência de Legendary, quantidade de erros admitida, checagem de combo run, overrides do cliente, experimentos e uma distribuição de probabilidades.

Fonte: [in-lesson-reward-fields.json](evidence/in-lesson-reward-fields.json), `ev_61a431c66fb571a585408c0cd851e6b98e26a6eae033d544c565c4ea4d9aa1bf`.

`InLessonRewardRequirement` guarda valor esperado e operador; o enum de operadores declara EQ, NEQ, G, GEQ, L e LEQ. O template contém lista de recompensas.

Fontes: [reward-requirement-fields.json](evidence/reward-requirement-fields.json), `ev_208eb54f506406eec7530c12f0a9c642ed18755e14d69b3f2330cf2c5fc55d5b`; [reward-operator-class.json](evidence/reward-operator-class.json), `ev_00f718380d49e0e9f3138d533420a5b6f2a8519cf534f07bba7f507ab483395f`; [reward-template-fields.json](evidence/reward-template-fields.json), `ev_41718a44906d71d226a336ac800d75ece62474203dd49f4b46e0e3d68b9c5070`.

**Limite:** conhecer o schema não revela os templates ativos de uma conta, sua origem completa ou a interpretação integral de cada comparação. O inicializador de operadores tem placeholders e não basta para recuperar símbolos serializados.

## R9. Há seleção ponderada de quantidade de Energia no cliente

**Derivado, com ressalvas de decompilação:** o método `defpackage.cid.b` obtém template, procura uma recompensa, lê o mapa de quantidades/pesos, soma pesos e usa um valor aleatório multiplicado pela soma. O trecho de seleção acumula pesos e associa o resultado a uma quantidade. Calcula também uma soma de quantidade × peso separada da quantidade escolhida.

Evidência REA: [reward-sampling.json](evidence/reward-sampling.json), `ev_553ad90b4c3f3e6c6235a6fba6e59b49cc63b56f7f8c752d87129ba7f03f8b39`.

O Java tem avisos de blocos duplicados, ramos de corrotina deslocados e uma condição de iteração inconsistente. Portanto, não foi executado nem transcrito como algoritmo fiel. A leitura smali anterior corrobora o percurso de pesos e segue a origem até `java.util.Random.nextDouble()`; caminhos e linhas estão em [DISTRIBUICAO-LOCAL.md](DISTRIBUICAO-LOCAL.md), cuja extração não foi regenerada.

O filtro `cid.c` foi obtido pelo REA em **smali**, após falha da representação Java: [reward-filtering.json](evidence/reward-filtering.json), `ev_bf86a31d130e90ead16bb9906c2bceeca3a7d5b17e72b1fcc2e8d10cd1cce251`. Isso é fallback explícito, não código Java recuperado.

**Conclusão com escopo:** há infraestrutura cliente para escolha variável de Energia, condicionada por regras. Uma distribuição com uma quantidade só também é suportável e resulta em prêmio fixo. Não se observaram pesos ativos, sorteios reais ou concessão aceita pelo servidor. Não estender a descoberta a XP, gemas, todas as contas ou efeito causal de dependência.

**Detalhe matemático:** a soma quantidade × peso não divide pela soma de pesos no trecho examinado. Não afirmar normalização universal. O simulador independente normaliza explicitamente seu próprio valor esperado, como uma escolha de design nova.

## R10. Boosts: variantes existem; a fórmula completa continua aberta

**Observado:** o enum declara variantes com nomes correspondentes a 1,5, dobro e triplo. O inicializador confirma a presença desses três elementos, mas não realiza o cálculo numérico de XP.

Fonte: [xp-multiplier-values.json](evidence/xp-multiplier-values.json), `ev_bddf5baaa869a3505799cacd838cfee37388ff6feb2eb58d5bbe57d5b2d8b16d`.

Não foram estabelecidas duração, regra de acúmulo, momento de validade, arredondamento, cobertura por modalidade ou concessão por tipo de baú. O relato oficial sobre XP é complementar e não fornece esses coeficientes. [Pesquisa pública](GAMIFICACAO-PUBLICO.md).

## R11. Regras de liga são dados, não uma tabela universal recuperada

**Observado/derivado:** `LeaguesRuleset` representa tamanho/tipo de coorte, promovidos, rebaixados, vencedores, perdedores, recompensas, tipo de pontuação, configuração por divisões e período de pausa de vencedor.

Fonte: [league-rules-fields.json](evidence/league-rules-fields.json), `ev_0fddf06d32f82497b390618a052e71b7032aba711a545e358e781bc66f8666fb`.

Isso sustenta modelar competição como regras configuráveis. Não recupera o algoritmo de coorte, desempate, antifraude, quantidade de promovidos para cada competição ativa ou o fechamento autoritativo. Os nomes internos não permitem inferir que todos os dados sejam contagens simples; há campos com listas e opcionais.

## R12. O cliente recebe representações estruturadas de sessão/questão

O REA inspecionou `SessionSurrogate`, confirmando coleções, contexto, metadata e tipos de suporte de sessão: [session-payload-class.json](evidence/session-payload-class.json), `ev_bfd82ef21da7642b466990e6c6f370b29623a90ea51ce57f13b9b25796cc1a88`.

A leitura local de serializadores e transporte segue pedido de sessão → conversor → modelo de sessão. Os nomes de grupos adaptativos e os campos de prompt/alternativas/correção estão documentados com suas fontes em [QUESTOES-APK.md](QUESTOES-APK.md). Uma consulta inicial a `ChallengeSurrogate` usou namespace incorreto e foi preservada como falha; ela não é contada como inspeção bem-sucedida.

A consulta corrigida a `com.duolingo.core.challenges.ChallengeSurrogate` terminou com sucesso: [challenge-payload-class.retry1.json](evidence/challenge-payload-class.retry1.json), `ev_299f6151af52a1e4cb5e33a2dd69d4a4268fd1ae1af0491f3263b8e3c4a8d2e2`. O inventário é uma estrutura ampla de tipos/coleções opcionais de desafio; não um conjunto de questões reais de uma conta ou prova de que cada campo seja preenchido em toda modalidade.

**Conclusão:** o cliente é orientado a dados e tem suporte a adaptação/revisão; isso não decide se o servidor armazenou, transformou ou gerou cada item. A distinção entre autoria, criação de variantes, seleção e conversação vem de fontes públicas explícitas, não de um campo chamado `generatorId`.

## R13. Missões e feedback: mais dimensões, menos extrapolação

A descoberta local anterior nesta rodada identificou missões relacionadas a lições, caminho, precisão, perfeição, escuta/fala, tempo, revisão e matérias. Também encontrou estados de feedback, apresentação de fim de sessão e variantes de combo sem Energia. São fontes de descoberta estática, não novos métodos dessas áreas decompilados pelo REA. [Locais e limites](DISCOVERY-LOCAL.md).

Isso orienta a próxima investigação, mas não prova frequência, valor de recompensa ou eficácia. As fontes públicas sobre hábito, cooperação e competição estão em [GAMIFICACAO-PUBLICO.md](GAMIFICACAO-PUBLICO.md); resultados históricos não são garantias para 2026 ou para um clone.

## Checklist de cobertura

| Pergunta do usuário | Estado |
|---|---|
| Como são criadas as questões? | Pipeline público esclarecido; backend privado não recuperado |
| Como funciona a sequência de acertos? | Transições e gates focais examinados; modalidades completas não cobertas |
| Combos sempre dão XP/Energia? | Não há base para universalizar; regras distintas e templates identificados |
| Há recompensa variável? | Caminho ponderado identificado; sem distribuição real/runtime |
| Como são boosts e ligas? | Modelos e variantes recuperados; fórmula e parâmetros ativos desconhecidos |
| Por que estimula retorno? | Mecanismos e estudos públicos; sem alegação clínica ou medição própria |
| Existe um SDK utilizável? | Núcleo original em memória com testes; módulos restantes especificados |

Índice integral: [evidence-index.json](evidence-index.json). Validação: [VALIDACAO.md](VALIDACAO.md). A investigação é focal e parcial; não decompilou todos os métodos nem reconstruiu o backend.

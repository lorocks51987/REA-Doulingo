# Descobertas locais de gamificação

Data: 2026-10-20. Inspeção estática por `rg` e leitura de smali no diretório `duolingo-extracted`; esta nota não atribui identificadores Evidence do REA a inspeções de shell. Nenhuma execução do aplicativo, autenticação ou consulta ao backend. Linhas referem-se à extração local e podem mudar ao regenerá-la.

Esta é uma nota de pesquisa derivada do cliente, separada de qualquer implementação independente. Contém descrições factuais e identificadores, sem transcrição de corpos proprietários. Uma única pessoa ter visto o código e depois implementar não estabelece clean-room formal.

## Combos são conceitos distintos

| Arquivo relativo a `duolingo-extracted/` | Método / linhas | Observação estática |
| --- | --- | --- |
| `smali_classes5/com/duolingo/core/session/timed/ComboState.smali` | construtor `(ZIII)` 93; `toString` 231 | Estado contém habilitação de combos, combo atual, maior combo e último recorde. Campos observáveis em 234–250. Não fornece sozinho a transição nem o ganho de XP. |
| `smali_classes2/com/duolingo/data/session/state/InLessonStreakState$ActiveStreak.smali` | construtor `(IZ)` 47; `toString` 133 | Estado de sequência de respostas corretas contém `numCorrectInARow` e `isInComboRun`. Há separação explícita entre contador e participação no combo. |
| `smali_classes2/com/duolingo/data/session/state/InLessonStreakState$ComboLost.smali` | classe | Há estado específico de combo perdido; inventário de classe, sem transição examinada. |
| `smali_classes2/com/duolingo/data/session/state/InLessonStreakState$PerfectLesson.smali` | classe | Lição perfeita tem representação própria. Também existem estados `Skipped` e `None`; não devem ser reduzidos a resposta incorreta sem examinar o produtor. |
| `smali_classes5/com/duolingo/data/comborun/ComboGradeResult.smali` | inicializador 32 | Resultado interno enumera correto, incorreto e nenhum. `NONE` não é prova de erro. |
| `smali_classes5/com/duolingo/data/comborun/ComboRunTracking$LossReason.smali` | inicializador 32; strings 39, 51, 63 | Telemetria distingue resposta incorreta, abandono de sessão e perda de sequência. A enumeração não demonstra quais condições disparam cada evento. |
| `smali/pu7.smali` | inicializador 20 | Declara eventos de início de combo, perda de combo e novo maior combo. Inspeção direta do pequeno arquivo. |
| `smali_classes6/com/duolingo/sessionend/sessioncomplete/SessionCompleteComboRunState.smali` | construtor 65; `toString` 204 | Apresentação de fim de sessão distingue ativo, início, contador do combo, mostrar perfeito e elegibilidade de texto de elogio. Separar recompensa de domínio e celebração visual. |
| `smali_classes3/qe10.smali` | construtor 52; `toString` 672 | Estado da barra de sessão acompanha desafios restantes/concluídos/corretos, combos perdidos, respostas corretas seguidas e erros, além de tratamentos de experimentos de apresentação. Contadores têm semânticas diferentes. |

Conclusão limitada: o APK contém pelo menos sequência de respostas na lição, combo de sessão cronometrada e combo run com acompanhamento de recorde. Não é correto afirmar que todos sejam o mesmo mecanismo ou que toda sequência aumente XP.

## Energia e recompensas

`smali_classes5/com/duolingo/core/session/api/message/InLessonEnergyRewardState.smali`, construtor `(IILjava/lang/String;)` linha 43 e `toString` linha 184, preserva quantidade da recompensa, energia antes dela e identificador da recompensa. Isso permite representar entrega e animação sem reduzir a recompensa a um simples contador.

`smali_classes5/com/duolingo/session/inlessonstreak/ClientEnergyRewardType.smali`, inicializador linha 64 e `getBackendBaseRewardId` linha 392, distingue recompensas por contexto: lição curta/longa, Practice Hub, variantes de lição perfeita, Stories/Duoradio, idiomas/xadrez e experimentos de alteração de energia. Nas linhas 269–287 há variantes denominadas combo pequeno sem energia e combo na fronteira de lição curta; nas linhas 297–301 há controle sem recompensa. São variantes disponíveis no binário, não demonstração de elegibilidade ou ativação para uma conta.

Conclusão limitada: combo pode existir sem devolver energia; quantidades, limites e seleção de variante exigem examinar o produtor/configuração e não foram recuperados nesta nota.

## XP

`smali_classes5/com/duolingo/data/xpboost/XpBoostMultiplier.smali`, inicializador linha 32, declara variantes de multiplicador 1,5; 2; 3 pelos identificadores do enum. A observação não recupera fórmula de arredondamento, prioridade, empilhamento, validade temporal nem todos os contextos de XP.

Também foram localizados `XpMultiplierType`, `ComebackBoostAutoActivationEntryPoint` e suas variantes Path, PracticeHub, RegularSession, Roleplay e Stories. Estes são candidatos de investigação; a existência de um ponto de entrada não prova uma recompensa automática para todo usuário.

## Competição

Todos os caminhos desta seção começam por `smali/com/duolingo/data/leagues/`.

- `LeaguesRuleset.smali`: construtor serializado linha 132, `toString` 570. Expõe tamanho e tipo da coorte, quantidades/listas relacionadas a rebaixados, perdedores, promovidos e vencedores, recompensas, tipo de pontuação, configuração em divisões e intervalo de pausa de vencedor. Strings de campos: 575–647. Isso demonstra regras modeladas como dados; não autoriza fixar números globais.
- `LeaguesRuleset$ScoreType.smali`: inicializador declara XP (46) e coroas (56). Disponibilidade histórica no binário não prova modalidade ativa.
- `LeaguesRuleset$CohortType.smali`: `RANDOM` na linha 44. O nome não explica os filtros/segmentação do servidor.
- `LeaguesContest$RankZone.smali`: promoção, permanência e rebaixamento nas linhas 52, 62 e 72.
- `LeaguesContest.smali`: `toString` 935–1001 preserva coorte, conclusão, metadados, zonas de promoção/rebaixamento, vencedor/perdedor, pontuação, usuário e recompensas. Zona e resultado final aparecem separadamente.
- `LeaguesCohort.smali`: construtor 73; `toString` 275 preserva ranking, divisão, ID e informação da coorte.
- `LeaguesUserScore.smali`: construtor 33; `toString` 158 preserva curso e Duolingo Score. Isso não demonstra que o Duolingo Score substitua XP na ordenação de ligas.

Foram localizadas telas de reparação de liga, cartão de ranking e progressão de ranking no fim de sessão. A regra de custo/reversão de rebaixamento não foi examinada.

## Missões

`smali_classes2/com/duolingo/goals/dailyquests/DailyQuestType.smali`, inicializador aproximadamente 150–805: catálogo contém objetivos por lições, caminho mais avançado, histórias, precisão de 80%/90%, lições perfeitas, níveis, escuta, fala, revisão de erros, tempo, unidades, Practice Hub, Match Madness, Ramp Up, videochamada, música, matemática e xadrez. Existem variantes starter/core/hard. Esses nomes indicam dimensões disponíveis, não o número de repetições exigido nem a distribuição para uma conta.

Exemplos de localização: precisão 80% 375–395; 90% 573–593; perfeito 609–627; revisão de erros 679–681; tempo 735–753; videochamada 787–805.

Foram localizados componentes independentes para progresso e recompensa de missão diária, recompensa com boost de retorno, escolha de parceiro e progresso/recompensa de missão de amigos. Inventário de telas não estabelece algoritmos de pareamento, cobrança social ou efeito causal sobre retenção.

## Próxima fronteira verificável

### Produtores adicionais localizados

- `smali/eu7.smali`: `b(UserId, ComboGradeResult, boolean)` linha 317 roteia a nota usando `smali_classes6/yt7.smali`: correto incrementa, incorreto chama reset com motivo de resposta incorreta, nenhum chama atualização com indicador para preservar o contador. `a(UserId, boolean, boolean)` linha 76 incrementa o contador apenas se o último booleano for falso (94–106) e mantém maior combo com `max` (110–116). O significado do booleano restante exige preservar contexto do chamador.
- `smali/eu7.smali`: `d(boolean, Lyv8)` linha 536 inclui tratamento de saída sem energia e atualização de teto de recompensa (697–699); `f(UserId, LossReason)` linha 797 é a fronteira de reset. Inspeção parcial, sem reconstrução completa de transições/efeitos.
- `smali_classes2/xt7.smali`: `ComboRunSessionState` é identificado pelo `toString` 634. Estado inclui combo inicial, elegibilidade da sessão, tratamentos de experimentos, sessão concluída, todas as respostas corretas até agora, maior combo que concedeu energia, taxa de redução de energia, recorde, criação do usuário e participação anterior. `e()` linha 326 é verdadeiro quando sessão concluída e todas as respostas corretas. `c()` linha 246 retorna combo atual somente com elegibilidade e (combo inicial positivo ou lição perfeita); caso contrário retorna nulo. `d()` linha 278 exige essa mesma condição e participação no experimento associado. `b(int)` linha 227 soma combo inicial ao argumento apenas quando `d()` é verdadeiro. São fatos desta versão do cliente, sem afirmar política universal.
- `smali_classes6/ru7.smali`: inicialização habilitada `a(int)` linha 6 usa combo atual/maior zero e último recorde informado; inicialização desabilitada `b()` linha 20 usa valores zero. `qu7.smali` no mesmo diretório confirma nomes via contrato de serialização.
- `smali_classes6/oc00.smali`: `invoke(Object)` caso próximo à linha 966 atualiza combo cronometrado para o inteiro recebido e maior combo para `max(maior anterior, recebido)`, preservando habilitação/último recorde. Não atualiza nesse ramo se houver sidequest ativo. Não é o produtor original do inteiro recebido.

Para documentar regras como fatos, seguir referências das classes acima até os produtores de transição: nota da resposta → atualização dos contadores → elegibilidade → recompensa identificada → consumo/acknowledgement → apresentação. Confirmar política de abandono, resposta sem nota, repetição de evento e fim de sessão. Para competição, seguir desserialização do ruleset e cálculo de zona. Valores remotos e tratamentos experimentais devem permanecer parâmetros desconhecidos até haver evidência correspondente. Sem esse percurso, qualquer SDK executável deve marcar suas fórmulas como política original proposta.

# SDK independente de gamificação e competitividade

Pesquisa e versão de referência: 20/10/2026, v0.1.0. Foco: regras de jogo, feedback, progressão, recompensas, missões e competição. Este pacote é separado do dossiê geral anterior.

## Resposta à dúvida sobre as questões

O processo descrito publicamente combina conteúdo preparado, criação algorítmica de variantes e montagem personalizada de sessões. Conversação pode gerar conteúdo durante a interação. Portanto, “todas pré-cadastradas” e “todas inventadas ao abrir a lição” são simplificações incorretas. [Fonte primária](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/).

O detalhamento e as fontes estão em [QUESTOES-PUBLICO.md](QUESTOES-PUBLICO.md). O fluxo de dados observado no cliente está em [QUESTOES-APK.md](QUESTOES-APK.md). Nenhuma dessas evidências recupera o banco do servidor ou estabelece o percentual atual de conteúdo gerado por IA.

Este SDK recebe **resultado de uma tentativa**, não precisa saber se o exercício foi escrito, instanciado de template ou gerado. Autoria, seleção e correção ficam em componentes próprios. Isso evita confundir novidade visual com novo direito a recompensa.

## 1. Separação da pesquisa e da implementação

O [relatório REA](DESCOBERTAS-REA.md) contém fatos do APK e suas limitações. Este documento contém uma **proposta de implementação independente**. Nenhum corpo decompilado ou asset foi incorporado ao módulo executável de referência.

Não há equipe implementadora formalmente isolada: esta investigação teve acesso à decompilação. Logo, não certifica um processo clean-room estrito. Para uma organização com essa exigência, uma equipe de revisão deve produzir requisitos comportamentais sanitizados antes de entregá-los a implementadores independentes.

Classificação usada:

- **Verificado no APK:** regra ou estrutura limitada aos caminhos inspecionados, sem execução.
- **Publicado:** declaração da empresa, com contexto temporal e disponibilidade variável.
- **Hipótese de design:** interpretação sobre motivação; não prova dependência ou efeito causal.
- **Regra original:** decisão configurável deste SDK, sem alegação de equivalência ao Duolingo.
- **Desconhecido:** depende de servidor, conta, experimento ou código ainda não examinado.

## 2. Os mecanismos que devem ter estados diferentes

| Mecanismo | Unidade | Quando muda | O que não significa |
|---|---|---|---|
| Sequência de acertos | Respostas consecutivas | Resultado corrigido | Não é sequência diária |
| Combo de sessão | Estado de uma modalidade | Acerto, erro e elegibilidade | Não garante recompensa |
| Combo que atravessa sessões | Sequência inicial e atual | Conclusão, retomada e políticas | Não é obrigatório para todo aluno |
| Lição perfeita | Sessão | Conclusão qualificada | Não é simplesmente contador alto |
| Sequência diária | Dias locais | Atividade elegível/proteção | Não mede proficiência |
| XP | Ledger de atividade | Recibo confirmado | Não é nota de idioma |
| Boost | Janela de elegibilidade | Concessão, início e expiração | Não se soma automaticamente a outro |
| Energia/vidas | Recurso de acesso | Consumo, reposição e recompensa | Não são XP |
| Missão | Meta em um período | Evento elegível e resgate | Completar não é resgatar |
| Liga | Participantes em um intervalo | Pontuação e fechamento | Snapshot não confirma promoção |

O APK examinado modela vários desses conceitos separadamente. As especificidades recuperadas estão no relatório REA; os comportamentos do núcleo executável abaixo são deliberadamente explícitos e originais.

## 3. Contrato de eventos para gamificação

Um evento confiável precisa de identidade estável, revisão de política, origem e resultado de correção. O cliente visual pode prever feedback; concessões competitivas devem usar a autoridade escolhida pelo novo produto.

Envelope proposto:

```typescript
type Grade = 'correct' | 'wrong' | 'ungraded';
type Authority = 'preview' | 'confirmed';
type GamificationEvent = {
  eventId: string;
  attemptId?: string;
  sessionId: string;
  userId: string;
  policyRevision: string;
  occurredAt: string;
  authority: Authority;
  grade?: Grade;
};
```

Esse envelope é especificação de integração, não o formato da API privada do Duolingo nem um objeto automaticamente aceito pelo módulo de referência. As funções executáveis usam entradas menores descritas na seção 13.

Regras de integração:

1. Reenviar o mesmo evento imutável retorna o resultado anterior.
2. Reutilizar uma identidade com conteúdo diferente produz conflito.
3. Resultado ainda não corrigido não deve virar erro do aluno.
4. Correção tardia demanda evento de revisão/estorno com referência à decisão anterior, não edição invisível.
5. O proprietário do estado persiste nova revisão, evento consumido e efeitos na mesma transação.
6. UI, som, vibração e animação consomem efeitos; não são autoridades para criar saldo.

## 4. Combo: contador, recorde, elegibilidade e recompensa

### Comportamento de referência implementado

`recordAttempt` conserva contador atual e melhor contador na sessão. Acerto incrementa; erro zera o atual; sem nota preserva ambos. A tentativa fica registrada por identidade e a revisão aumenta uma vez. Esse contrato não implementa toda a política experimental do app analisado.

| Sequência original de exemplo | Combo atual | Melhor combo |
|---|---:|---:|
| Acerto | 1 | 1 |
| Acerto | 2 | 2 |
| Sem nota | 2 | 2 |
| Erro | 0 | 2 |
| Acerto | 1 | 2 |

O efeito `correct_run` permite à interface mudar texto, cor, animação ou som. O efeito `run_ended` informa o valor anterior. Eles não concedem XP ou Energia por si sós.

### Política a definir para um produto completo

Manter como configuração: modalidades elegíveis; início da exibição; contagem entre sessões; comportamento de pular; correção de erro; abandono; expiração; recordes; introdução do recurso; interação com Energia; limiar e repetição de prêmios. O núcleo atual só cobre uma sessão, sem persistência de combo entre sessões.

O APK contém estados e gates mais complexos do que o núcleo de demonstração. Não universalizar seus marcos enumerados ou seu tratamento de experimentos como configuração de todos os usuários.

## 5. XP e boosts

Publicado: a engenharia descreve XP calculado pelo backend e previsão no cliente. [Fonte](https://blog.duolingo.com/frontend-prediction/). O coeficiente exato de cada componente não foi recuperado.

### Fórmula original do módulo de referência

```text
bruto = base + acertos × valor_por_acerto + bônus_combo + bônus_perfeito
prévia = piso(bruto × maior_boost_ativo)
```

Escolhas originais, não fórmulas descobertas:

- O bônus de combo é o maior prêmio de marco alcançado; não soma todos os marcos.
- Perfeito exige ao menos um acerto e nenhum erro; tentativas sem nota não somam acertos.
- Boosts não se multiplicam entre si: vale o maior ativo.
- A validade é `[início, fim)`: no instante do fim, o boost expirou.
- Empate de fator usa ID do boost em ordem textual para ter resultado reproduzível.
- A divisão é racional com inteiros e truncamento para baixo; overflow vira erro de capacidade.
- O retorno é `preview`. O módulo não grava XP nem confirma prêmio remoto.

Configuração de exemplo, inteiramente autoral:

```javascript
const policy = {
  revision: 'original-demo-v1',
  baseXp: 9,
  perCorrectXp: 2,
  perfectBonusXp: 3,
  comboMilestones: [
    { run: 4, bonusXp: 2 },
    { run: 8, bonusXp: 5 }
  ]
};
```

Esses valores não são números do Duolingo. Escolheram-se números de demonstração para não apresentar uma reconstrução inexistente. Uma aplicação real deve versionar a política e fixá-la durante a sessão.

Concessão definitiva exige ledger durável, autorização, identidade de conclusão, deduplicação e eventual estorno. Esses componentes não estão implementados no módulo em memória.

## 6. Recompensa variável e Energia

A investigação encontrou um campo de distribuição e um produtor de seleção ponderada de Energia. Escopo, fonte e confirmação estão em [DESCOBERTAS-REA.md](DESCOBERTAS-REA.md) e [DISTRIBUICAO-LOCAL.md](DISTRIBUICAO-LOCAL.md). Isso não implica aleatoriedade em toda recompensa ou toda conta.

Para o novo produto, separar:

```text
evento → contexto → regra elegível → quantidade escolhida → recibo → consumo/apresentação
```

O contexto pode incluir modalidade, duração/classificação de sessão, matéria, marco de combo, perfeição, quantidade de erros e experimento. Dados desconhecidos permanecem desconhecidos; não converter campo ausente para zero e ativar uma regra por acidente.

`drawReward` é um simulador original que recebe quantidades, pesos não negativos e uma amostra explícita `u` no intervalo `[0,1)`. Ele normaliza o valor esperado, ignora pesos zero e rejeita soma vazia/não positiva/infinita. A escolha na fronteira entre faixas usa intervalos semiabertos. Não chama a rede nem gera aleatoriedade escondida.

Exemplo autoral: prêmios `1` com peso `2` e `4` com peso `6` dão valor esperado `3,25`. O fato de a média ser `3,25` não significa que esse valor será concedido; o resultado é um dos prêmios discretos. Os valores são apenas de teste.

Uma implantação real precisa de política pública de chances quando aplicável, fonte de aleatoriedade apropriada, proteção contra reexecução e proprietário da concessão. O simulador não é uma implementação de economia monetizada.

## 7. Missões, baús e progresso

### Implementado no núcleo

`advanceQuest` recebe um recibo confirmado com ID, métrica e quantidade. Só a métrica correspondente progride; o progresso é limitado à meta. Recibo idêntico não progride duas vezes; recibo com mesmo ID e dados alterados conflita. `claimQuest` registra uma intenção local de resgate uma única vez após a conclusão.

O resgate retorna `quest_claim_intent`: não paga automaticamente XP, moedas ou dinheiro. O aplicativo deve vincular essa intenção a um ledger persistente com chave de concessão própria. Um resgate concorrente em dois processos exige transação no armazenamento, não só a verificação em memória.

### Extensão especificada

Cada missão tem revisão, período, fuso, métrica, alvo, filtros, recompensa e estado de resgate. Filtros de curso/matéria/dificuldade e janela temporal são aplicados antes de chamar o núcleo. Sua validade não deve depender do texto exibido.

Catálogo original de métricas: sessões elegíveis, lições do caminho, acertos, sessões com precisão mínima, sessões perfeitas, prática de fala/escuta, revisão e minutos qualificados. Precisão, tempo e quantidade de questões exigem unidades explícitas. Tempo parado não deve ser somado silenciosamente a tempo de estudo.

Baú é uma apresentação de recompensa. Deve consumir um recibo identificado: abrir, reabrir ou reproduzir animação não concede novamente. Se o conteúdo do baú é variável, identificar a política de seleção; não chamar de aleatório um prêmio fixo ou vice-versa.

## 8. Ligas e competitividade

O novo produto precisa separar coorte, pontuação, snapshot, zona e fechamento. O pareamento e os números globais do Duolingo continuam desconhecidos; o APK modela regras como dados.

`rankCohort` implementa apenas um snapshot determinístico original:

1. XP maior vem primeiro.
2. Empate usa `tieKey` e depois ID, ambos em ordem textual.
3. Os primeiros `promote` estão na zona de promoção.
4. Os últimos `demote` estão na zona de rebaixamento.
5. Zonas sobrepostas, IDs repetidos e valores inválidos são rejeitados.

O retorno tem `status: snapshot`. Não promove ninguém, não escolhe participantes e não fecha uma liga. O desempate não foi extraído do Duolingo.

Uma implementação completa exige calendário autoritativo, período fechado, tolerância explícita para eventos atrasados, recibos de XP elegíveis, reversões e auditoria. Comparar candidatos com rotinas parecidas é decisão de matchmaking; ordenar a tabela não substitui essa decisão.

Progressão de liga, torneio, colocação semanal e ranking de amigos devem ter identidades próprias. Um aluno de curso diferente pode compartilhar uma competição de atividade sem ter proficiência comparável.

## 9. Sequência diária, proteção e retorno

Esta parte é **especificada, ainda não implementada** no núcleo executável.

`DailyStreakPolicy` define atividade qualificadora, fuso, fechamento do dia, proteções, reparação e mudança de fuso. Guardar o instante e a data civil resolvida pela autoridade escolhida; não inferir dia local dividindo timestamp por 24 horas.

Estados distintos: praticado, protegido, ausente, pendente e reparado. Proteção preserva continuidade sem afirmar que houve estudo. Missão diária e sequência diária podem ter metas diferentes.

Retorno pode usar meta curta, lembrete opt-in, proteção e recompensa de retomada. Cada mensagem tem motivo de elegibilidade e limite de frequência. A documentação pública contém experimentos de continuidade e flexibilidade; não prova uma regra universal de punição crescente. [Pesquisa pública consolidada](GAMIFICACAO-PUBLICO.md).

## 10. Por que esses recursos podem estimular retorno

O usuário pediu os elementos que tornam a experiência “viciante”. Aqui isso é tratado como **engajamento, hábito e motivação**, sem diagnóstico de dependência. As relações abaixo são hipóteses de design informadas pelos mecanismos observados; resultados causais publicados estão separados no anexo público.

| Camada | Mecanismo | Hipótese de motivação | Medição adequada |
|---|---|---|---|
| Ação | Correção, som, cor e reação | Resposta percebida imediatamente | Clareza, erro e latência observada |
| Acertos | Combo e recorde | Domínio aparente e meta próxima | Precisão e variedade do conteúdo |
| Sessão | Barra e finalização | Objetivo finito e sensação de conclusão | Conclusão, abandono, revisão correta |
| Recompensa | Prêmio e boost | Antecipação e escolha de próxima atividade | Consumo, retorno e aprendizagem |
| Dia | Sequência e missão | Continuidade e compromisso escolhido | Dias qualificados e bem-estar reportado |
| Semana | Liga e cooperação | Comparação e responsabilidade social | Participação, justiça e opt-out |
| Longo prazo | Unidades e objetivos | Progresso acumulado | Retenção de conhecimento e habilidade |
| Retomada | Proteção e reparação | Reduzir custo de voltar | Retorno após pausa e permanência |

Um sistema pode elevar XP e tempo de uso sem elevar aprendizagem. Por isso, o SDK não chama XP de proficiência. Publicações sobre retenção não demonstram efeito clínico nem garantem que o mesmo experimento funcione em outro produto.

Configuração original recomendada: movimento reduzido, áudio/vibração opcionais, notificações controláveis, competição opcional e possibilidade de pausa. Esses controles são parte das regras de uma experiência sustentável.

## 11. Funções adicionais para uma implementação completa

| Contrato proposto | Responsabilidade | Situação |
|---|---|---|
| `EligibilityPolicy` | Aplicabilidade por contexto e experimento | Especificado |
| `CrossSessionCombo` | Sequência inicial, conclusão e abandono | Especificado; gates reais variam |
| `RewardLedger` | Concessão, estorno e deduplicação durável | Especificado |
| `EnergyAccount` | Capacidade, reserva, consumo e recarga | Especificado |
| `DailyStreak` | Dia local, proteção e reparação | Especificado |
| `CooperativeQuest` | Participantes, contribuição e resgate | Especificado |
| `LeagueFinalizer` | Fechamento e promoção confirmada | Especificado |
| `ReminderSelector` | Elegibilidade e frequência | Especificado |
| `ExperimentAssignment` | Atribuição estável e exposição | Especificado |
| `LearningOutcomeTracker` | Aprendizagem separada de engajamento | Especificado |

Os contratos não presentes no arquivo executável não são funcionalidades prontas. A escolha de próximos módulos deve partir da experiência desejada, sem inventar detalhes para preencher lacunas do app analisado.

## 12. Fronteiras com o sistema de questões

O módulo pedagógico entrega resultado e cobertura; o de gamificação entrega efeitos e recibos. Requisitos:

- `contentId` identifica conteúdo; `challengeInstanceId`, a apresentação; `attemptId`, a resposta. Eles não são intercambiáveis.
- Uma transformação do mesmo conteúdo pode render outro exercício sem representar nova habilidade aprendida.
- Repetições e correções têm políticas próprias de recompensa.
- Questão gerada precisa de validação e chave de correção antes de conceder um resultado competitivo.
- Falha do reconhecedor de fala ou corretor não é automaticamente erro.
- A dificuldade selecionada não deve ser usada para inventar um acerto ou mudar um erro para preservar um combo.
- A política de seleção registra sua revisão e razão; não faz parte do cálculo de XP implementado aqui.

## 13. Uso do núcleo executável

Arquivo: [reference-engine.mjs](reference-engine.mjs). Sem instalação, rede, dependência ou configuração do REA. Não usa endpoints do Duolingo.

| Função | Entrada | Saída |
|---|---|---|
| `newSession` | ID e revisão de política | Estado inicial |
| `recordAttempt` | Estado e tentativa corrigida | Novo estado, efeitos, indicador de duplicata |
| `previewXp` | Estado, política, boosts e instante | Prévia discriminada de XP |
| `drawReward` | Distribuição e amostra explícita | Quantidade selecionada e valor esperado |
| `advanceQuest` | Missão e recibo confirmado | Progresso idempotente |
| `claimQuest` | Missão | Intenção única de resgate |
| `rankCohort` | Participantes e tamanho das zonas | Snapshot ordenado |

Todas retornam `{ok:true,value}` ou `{ok:false,error}`. O consumidor verifica `ok`; não deve converter falha em recompensa zero e prosseguir como se houvesse confirmação. Estados são objetos serializáveis e as transições não alteram a entrada. Estado restaurado precisa passar pela validação de fronteira do aplicativo; as verificações do módulo são limitadas ao contrato de referência.

```javascript
import { newSession, recordAttempt, previewXp } from './reference-engine.mjs';

const created = newSession('demo-session', policy.revision);
if (!created.ok) throw new Error(created.error.message);
const result = recordAttempt(created.value, {
  id: 'attempt-1', grade: 'correct', expectedRevision: 0
});
if (!result.ok) throw new Error(result.error.message);
const preview = previewXp(result.value.session, policy, [], 0);
console.log(preview); // prévia; não é concessão de XP no servidor
```

O exemplo pressupõe `policy` da seção 5. O armazenamento de tentativas/recibos é limitado à vida dos objetos; cabe à integração definir retenção e persistência. Não expor funções de concessão diretamente a clientes não confiáveis. O núcleo não implementa autenticação, corretor, antifraude, banco, transação distribuída, servidor ou app.

## 14. Validação e evidências

Testes do núcleo: `node --test duolingo-analysis/gamification-sdk/reference-engine.test.mjs`. O relatório [VALIDACAO.md](VALIDACAO.md) registra o resultado efetivo, consultas REA, limitações e checks documentais.

Índice consultável: [evidence-index.json](evidence-index.json). Os arquivos de pesquisa preservam o alvo e os IDs de Evidence; os arquivos de implementação usam políticas originais. Não foi executado o APK nem observada uma conta real.

# Gamificação: regras públicas e limites de reconstrução

Consulta: 2026-10-20. `PUBLICO` = descrição oficial, sem reprodução independente. `HISTORICO` = regra/experimento do período da publicação, sem garantia de disponibilidade atual. `PROPOSTA` = desenho original do SDK. Nenhuma afirmação clínica sobre dependência é derivada destas fontes. Artigos podem ser atualizados conservando URL; disponibilidade varia por conta, plataforma e experimento.

## G1 — Combo de acertos interfere em XP, mas o servidor decide

`PUBLICO`: a engenharia do Duolingo descreve o backend calculando XP com quantidade de desafios corretos, bônus de sequência de acertos dentro da lição, boosts e outras variáveis. O cliente calcula uma previsão para apresentar o resultado rapidamente; ela pode divergir por correção diferente ou boost que o servidor não considera ativo. Portanto, encontrar no APK uma animação ou previsão de combo não prova a recompensa final. [Frontend prediction](https://blog.duolingo.com/frontend-prediction/).

`DESCONHECIDO`: fórmula, teto, limiar e arredondamento atuais; se um erro quebra o combo em todas as modalidades; se repetir a correção conta como acerto remunerado. Não assumir que o bônus cresce linearmente ou que a mesma regra vale para Energia.

## G2 — Combo também pode repor Energia

`PUBLICO`, rollout experimental descrito: Energia começa cheia, é consumida durante lições e pode ser recuperada com respostas consecutivas corretas. Revisar erros ao final não consome Energia. A recarga completa leva aproximadamente um dia; anúncio recompensado e gemas permitem reposição. A publicação menciona bônus por lição perfeita, adicionar amigo e baús, e declara testes em andamento. Não publica valores exatos ou limiar de acertos. [Energy](https://blog.duolingo.com/duolingo-energy/).

`INFERENCIA`: separar `correctRun`, `energyGranted` e `xpGranted` evita confundir três mecanismos visualmente próximos. Não há prova de que qualquer combo receba simultaneamente as duas recompensas.

## G3 — Ligas são competição de atividade, não classificação de proficiência

`PUBLICO`, descrição sujeita a atualização: ligas comparam XP entre cursos, agrupam hábitos de estudo semelhantes e fusos próximos e renovam a competição semanalmente. Há dez níveis de liga na descrição. O torneio Diamante possui quartas, semifinais e finais; top 10 pode qualificar quando houver rodada anunciada, não toda semana. A empresa declara monitoramento de ganhos ilegítimos e remoção de participantes. É possível sair tornando o perfil privado. A disponibilidade de torneio por plataforma citada no artigo é histórica. [Leaderboards and leagues](https://blog.duolingo.com/duolingo-leagues-leaderboards/).

`DESCONHECIDO`: função exata de pareamento, desempate, limites de promoção por liga, detecção de fraude e fechamento autoritativo. “Domingo no fuso” não resolve horário exato ou horário de verão para reconstrução.

## G4 — Missão cooperativa usa interdependência

`PUBLICO`, descrição histórica: Friends Quests emparelham amigos ativos, atribuem objetivo compartilhado como XP ou lições perfeitas e oferecem cinco dias para conclusão. Há lembretes pré-escritos, presente de boost usando gemas, crédito ao objetivo mensal e opção de desativação. O texto antigo descreve pareamento aleatório entre amigos mútuos; não prova a política atual. A associação publicada entre seguir amigos e concluir cursos não demonstra causalidade. [Friends Quests](https://blog.duolingo.com/friends-quests/).

`PUBLICO`, retrospectiva de 2025: pareamento universal passou a incluir alunos sem amigos; aumentaram recompensas por concluir as três missões diárias; baús receberam experiência visual revisada. Isso demonstra evolução em relação ao guia anterior, sem publicar uma tabela completa de prêmios. [2025 highlights](https://blog.duolingo.com/product-highlights/).

## G5 — XP e boosts atravessam matérias

`PUBLICO`: XP e boosts obtidos em uma matéria podem ser usados no conjunto do aplicativo. Objetivos gerais como XP, respostas corretas e minutos estudados podem ser satisfeitos em matérias distintas; objetivos específicos permanecem restritos ao tipo de atividade. Uma lição de Matemática pode preservar a sequência num dia diferente de uma lição de idioma. [Math, Music and Language](https://blog.duolingo.com/new-subjects/).

`DESCONHECIDO`: multiplicadores atuais por baú/missão, durações, possibilidade de acumulação e regra de início ou expiração. As fontes primárias desta investigação não sustentam universalizar 1,5×, 2× ou 3× nem durações de 15/30 minutos.

## G6 — Preservar a sequência ficou mais fácil após um experimento

`HISTORICO`: separar meta diária e sequência permitiu estender a sequência com uma única lição. No A/B publicado, a retenção no dia 14 aumentou 3,3% e os usuários ativos diários 1%, em termos relativos. Em contrapartida, menos pessoas alcançaram a meta diária. O estudo não publica todos os detalhes necessários para reprodução estatística externa. [Improving the streak](https://blog.duolingo.com/improving-the-streak/).

`HISTORICO`: oferecer uma aposta de sete dias com moeda virtual e retorno dobrado elevou retenção no dia 7 em 14% no relato oficial. Oferecer proteção de fim de semana elevou retorno semanal em 4% e reduziu perda de sequência em 5%. São resultados de experimentos antigos, não previsão de efeito para um novo produto. [Streak experiments](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/).

`HISTORICO`: permitir dois Streak Freezes foi associado, no experimento relatado, a aumento relativo de 0,38% nos ativos diários. Flexibilidade integra o mecanismo de continuidade; punição rígida não é o único desenho descrito. [Habit and flexibility](https://blog.duolingo.com/how-duolingo-streak-builds-habit/).

## G7 — Lembretes são seleção de templates, não necessariamente texto novo

`HISTORICO`: notificações pré-escritas recebem personalização e seleção por elegibilidade, idioma e estado da sequência. O sistema compara desempenho entre mensagens enviadas a públicos comparáveis, evitando premiar automaticamente templates destinados a alunos que já retornariam. A métrica descrita é concluir uma lição após receber o lembrete. [Notification selection](https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/).

## Regras originais recomendadas para o contrato

`PROPOSTA`: manter as seguintes decisões explícitas, sem preenchê-las com números supostamente extraídos do Duolingo:

| Recurso | Decisão que a configuração deve possuir |
|---|---|
| Combo | Evento elegível, início, quebra, teto e recompensa |
| Boost | Multiplicador racional, janela temporal, elegibilidade e acumulação |
| XP | Base, bônus separados, arredondamento, confirmação e deduplicação |
| Energia | Capacidade, custo, bônus, recarga e regras de consumo |
| Missões | Métrica, cobertura, período, recompensa e resgate único |
| Ligas | Coorte, calendário, desempate, confirmação e promoção |
| Sequência | Dia local, conclusão elegível, proteção e reparação |

`HIPOTESE DE DESIGN`: feedback imediato torna progresso perceptível; objetivo próximo oferece direção; prazo cria ocasião de retorno; cooperação cria compromisso; liga oferece comparação; proteção permite retomar. Estas explicações são hipóteses úteis para um produto original, não prova de que todos os mecanismos produzem dependência ou aprendizagem.

Medir retorno, conclusão e proficiência separadamente. Os relatos de retenção acima não autorizam tratar minutos, XP ou sequência como equivalentes de domínio linguístico.

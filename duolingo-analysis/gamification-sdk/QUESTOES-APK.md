# Questões: evidência estática do cliente

Inspeção local em 2026-10-20 por shell, sem executar APK nem chamar serviços do Duolingo. Não são Evidence novos do REA. Caminhos abaixo relativos a `C:/dev/REA/duolingo-extracted/`. Esta nota descreve contratos e fluxo observáveis; não reproduz implementações proprietárias.

## Resposta curta e limites

O cliente tem um fluxo concreto que envia parâmetros de sessão e desserializa uma sessão contendo conjuntos de desafios e dados de apresentação/correção. Isso sustenta que as lições usuais não precisam ser inventadas integralmente no telefone. **Não permite decidir, sozinho, se o servidor escolheu itens previamente escritos, instanciou templates, gerou conteúdo dinamicamente ou combinou essas estratégias.** Identificadores chamados generator não demonstram uso de IA generativa.

Também existem representações de lição adaptativa, reposição de erros e sessões offline. Essas características não devem ser confundidas com geração livre de frases nem com prova de que todas as questões estão cadastradas individualmente.

## Solicitação → resposta de sessão

| Fonte | Localização | Observação |
| --- | --- | --- |
| `smali/is10.smali` | `b(SessionRouteParams, Priority, Lyv8): Object`, 345; POST 601; `/sessions` 704; construção do pedido 716 | Monta pedido HTTP POST de sessão com parâmetros serializados e conversores separados de pedido/resposta. Não foi feito tráfego real. |
| `smali_classes2/com/duolingo/data/session/x1.smali` | implementação de `KSerializer`; construtor 23; `serialize` 85 | Serializador dos parâmetros `SessionRouteParams`, utilizado na construção anterior. |
| `smali/kg00.smali` | construtor 12, lazy `b` | Proprietário do conversor de resposta usado por `is10`. |
| `smali_classes2/v5z.smali` | ramo 524–546 | A lazy de `kg00` cria conversor Kotlinx com `Session.Companion.serializer()`. Liga concretamente o fluxo HTTP ao modelo de sessão, em vez de inferir isso só pelo nome do arquivo. |
| `smali_classes2/com/duolingo/data/session/SessionRouteParams$Lesson$Request.smali` | `toString` aproximadamente 982–1091 | Solicitação preserva tipos/IDs de desafios, idiomas, número de desafios adaptativos de sufixo, nível, sessão no nível, skill, metadados de caminho, experimentos, árvore e opções de formato. |
| `smali_classes2/com/duolingo/data/session/f0.smali` | descritor 32–108 | Confirma os nomes desses campos no contrato serializado da solicitação de lição. |

O método completo de `is10` inclui outros caminhos e tratamentos; esta inspeção identifica o caminho HTTP, sem afirmar que toda sessão passe por ele.

## Conteúdo recebido e transformado

- `smali/com/duolingo/core/session/x2.smali`, descritor de `SessionSurrogate` 26 e 116–140: campos serializados de desafios principais, adaptativos, pós-adaptativos, substituição de erros, desafios intercalados adaptativos, contexto da sessão e anotações TTS.
- `smali/com/duolingo/core/session/SessionSurrogate.smali`, `toString` 1522 e campos 1679–1715: confirma a representação de fronteira com essas coleções. O descritor serializado chama o campo intercalado de `adaptiveInterleavedChallenges`, enquanto a representação interna usa nome `interleavedChallengesField`; preservar essa diferença ao documentar limites.
- `smali/com/duolingo/core/session/Session.smali`, construtor 81 e `toString` 1449–1504: modelo interno contém os grupos de desafios, contexto e anotações. Coleção disponível não demonstra que todo item seja mostrado nem a ordem final ao usuário.
- `smali/com/duolingo/core/challenges/ChallengeSurrogate.smali`, `toString` 18100: campos de alternativas 18223, resposta correta/índices/soluções 18247–18273; `generatorId` 18377; áudio, texto, variantes, transliteração, TTS e partes do prompt 18859–18895; identificador da sentença 18957; tradução/áudio da solução 18999–19005; tokens 19155. São campos opcionais de uma representação ampla de tipos de exercício, não promessa de que todos aparecem em cada questão.
- `smali/com/duolingo/core/challenges/Flashcard.smali`, `toString` 503–553: prompt, melhor tradução, traduções alternativas aceitas, componente de conhecimento, imagem, idioma alvo e transliteração. Isso demonstra dados concretos de conteúdo e correção no cliente.
- `smali/com/duolingo/core/challenges/GeneratorId.smali`, `toString` 186–190: par de tipo específico e ID. O nome não revela algoritmo gerador nem origem editorial.

## Persistência e modalidades diferentes

`smali_classes2/hkc.smali`, construtor 14 e strings 31–43, associa recurso chamado Session a um caminho local `rest/2017-06-30/sessions/<identificador>.json` e conversor. Há outro construtor no mesmo arquivo para manifesto offline; não atribuir todos os ramos dessa classe sintética a sessões comuns. A presença de recurso em disco não torna todo o catálogo de cursos embutido no APK.

`smali/okp.smali`, interface de rede, `b(MathTutorSessionRequest, continuation)` 36 e rota anotada 54, declara criação de sessão Math Tutor; `a(sessionId, MathTutorNextStepRequest, continuation)` 6 e rota 31 declara próximo passo. A resposta tipada é `MathTutorSessionResponse` ou `MathTutorNextStepResponse`, respectivamente. `smali_classes5/com/duolingo/data/math/tutor/network/MathTutorSessionResponse.smali`, `toString` 293–329, contém sessão, desafio/versionamento, passo, layout, grafo de tutor e propriedades de rastreamento. É um fluxo distinto de idiomas e não prova que a geração de questões linguísticas use o mesmo mecanismo.

## O que ainda não foi estabelecido

Não foram recuperados o banco editorial, templates do servidor, algoritmo de seleção final, parâmetros de personalização, política de geração por curso ou percentual de conteúdo criado com IA. Não houve captura de requisição/resposta de conta real. Logo, a conclusão adequada é **sessão orientada a dados com suporte a adaptação e revisão; mecanismo de autoria e montagem no backend parcialmente desconhecido**. Um SDK independente deve separar catálogo de conteúdo, instância de questão, seleção adaptativa, correção e apresentação, deixando explícitas as políticas originais adotadas.

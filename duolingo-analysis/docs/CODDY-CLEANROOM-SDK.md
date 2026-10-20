# Especificação clean-room independente para uma plataforma como a Coddy

Data: 2026-10-20. Este documento transforma comportamentos observáveis publicamente em uma especificação original. Ele não reproduz código, marca, textos, ilustrações, cursos, prompts, assets ou dados do Coddy.

## Regra de clean-room

A equipe de implementação deve trabalhar apenas com esta especificação comportamental e com conteúdo novo. Uma equipe de pesquisa pode observar páginas públicas e registrar fatos; uma equipe separada escreve código sem acessar bundles, código-fonte privado, APIs não documentadas ou materiais proprietários. Cada requisito recebe a classificação `observado`, `derivado` ou `proposto`. A aprovação deve exigir testes de comportamento e revisão de licenças.

## Contrato de produto

O produto é um ambiente de aprendizagem prática: o aluno escolhe um objetivo, lê uma explicação curta, edita um programa, executa testes, recebe feedback e avança em uma trilha. O mesmo motor pode oferecer linguagens, SQL, matemática, xadrez e ferramentas de referência. A conta guarda progresso por jornada, sequência, XP, energia, certificados e preferências.

### Requisitos observados

- Lições interativas e desafios com código executável.
- Playground sem configuração local para várias linguagens.
- Roadmaps ordenados por profissão/objetivo.
- Dicas de IA contextualizadas ao código, lição e último erro.
- Limite de energia e de mensagens no plano gratuito; planos pagos removem ou ampliam limites.
- Sequência diária, congelamento, XP, ligas, recompensas e certificados verificáveis.
- Apps móveis e site com progresso ligado à conta.

### Requisitos derivados

- Um serviço de execução isolado deve existir para validar código em linguagens distintas.
- Progresso, energia e compras precisam de autoridade no servidor para funcionar entre dispositivos.
- Certificados precisam de um identificador público e uma página de verificação.
- O tutor precisa receber somente o contexto da lição e a tentativa necessária para explicar o erro.

## Domínio e estados

### Jornada

`locked -> available -> active -> completed`. Uma jornada contém seções; cada seção contém lições; uma lição contém explicação, editor, testes, dica, solução e critérios de conclusão. Desbloqueios devem ser idempotentes e baseados em eventos de conclusão confirmados pelo servidor.

### Submissão

`draft -> running -> passed|failed|timed_out|rejected`. Toda execução recebe `runId`, `lessonVersion`, linguagem, limite de recursos e hash do código. Repetir o mesmo `runId` retorna o mesmo resultado; um `runId` com payload diferente é conflito.

### Energia

O plano gratuito pode gastar uma unidade por desafio/quiz concluído e recarregar em intervalos definidos pelo produto. Falhas de execução, leitura e prática podem ser gratuitas. A cobrança deve ocorrer no servidor depois de validar o tipo de atividade, com deduplicação por tentativa.

### Sequência

Uma sequência é uma função de dias de atividade, fuso horário e janela de recuperação. O congelamento é um recurso separado, consumido apenas quando a política permite. Nunca derive a data do cliente sem registrar o fuso e a versão da política.

### XP e ranking

XP deve ser um ledger de eventos aceitos, não um número enviado pelo navegador. A tabela de líderes deve usar uma janela temporal e uma coorte explícita; empates precisam de regra determinística. Exibir posição não concede autoridade para promoção ou recompensa.

### Tutor de IA

Entradas: objetivo da lição, código atual, último erro/teste e pergunta do aluno. Saídas: explicação, hipótese, dica e próximos passos. Antes de a tarefa ser resolvida, o tutor deve bloquear ou substituir uma resposta que contenha a solução completa; depois de várias tentativas, pode oferecer uma ação explícita para revelar a solução. O chat é persistido por lição com política de retenção e controles de privacidade.

## Modelo de dados original

```ts
type Lesson = {
  id: string; version: number; courseId: string; sectionId: string;
  language: string; objective: string; explanation: string;
  starterCode: string; tests: TestCase[]; solution?: string;
  hints: string[]; prerequisites: string[];
};

type TestCase = { id: string; input: string; expected: string; hidden: boolean };

type Run = {
  runId: string; lessonId: string; lessonVersion: number;
  sourceHash: string; status: 'running'|'passed'|'failed'|'timeout'|'rejected';
  tests: Array<{ id: string; passed: boolean; output?: string; error?: string }>;
  cpuMs: number; memoryBytes: number; createdAt: string;
};

type LearnerState = {
  userId: string; activeJourneys: string[]; completedLessons: string[];
  xp: number; streakDays: number; freezes: number; energy: number;
  dailyCounters: Record<string, number>; policyRevision: string;
};
```

## Arquitetura de referência

```text
Browser / mobile
  ├─ Content API: cursos, lições, versões, localização
  ├─ Progress API: conclusão, streak, XP, energy, idempotency
  ├─ Judge Gateway: valida linguagem e cria Run
  │    └─ Worker pool: sandbox sem rede, filesystem efêmero
  ├─ Tutor API: contexto mínimo + política anti-solução
  ├─ Ranking API: coorte e janela
  ├─ Certificate API: emissão e verificação pública
  └─ Billing/entitlements: plano, limites e restauração
```

### Executor seguro

Cada worker deve iniciar sem privilégios, com filesystem temporário, rede desativada, seccomp/AppContainer equivalente, limite de processos, CPU, memória, tempo e saída. O gateway deve validar o tamanho do programa, linguagem, versão do compilador e dependências permitidas. O processo deve ser encerrado mesmo se não responder; nenhum segredo deve entrar no ambiente do worker.

### Persistência e consistência

Use outbox/event log para `lesson_completed`, `run_passed`, `energy_spent`, `streak_extended`, `xp_granted`, `certificate_issued` e `ai_hint_requested`. O ledger deve aceitar uma chave de idempotência por operação e guardar `policyRevision`. Leituras podem ser eventualmente consistentes; concessões e cobrança precisam de confirmação transacional.

## API mínima

```text
GET  /v1/journeys
GET  /v1/lessons/:id
POST /v1/runs                         -> Run
POST /v1/runs/:id/complete            -> progresso confirmado
POST /v1/tutor/messages               -> dica contextual
GET  /v1/me/leaderboard?season=...
GET  /v1/certificates/:publicId       -> verificação pública
POST /v1/entitlements/restore
```

Todos os POST devem aceitar `Idempotency-Key`; respostas devem devolver `requestId`, `policyRevision` e erros tipados. O cliente nunca envia `xp`, `energy` ou `completed=true` como autoridade.

## Conteúdo e qualidade

O pipeline de autoria deve validar sintaxe, testes ocultos, tradução, acessibilidade, solução e pré-requisitos antes da publicação. Versione cada lição; não altere testes de uma versão já usada em certificados. Meça taxa de falha inesperada, tempo até aprovação, abandono e pedidos de dica. Conteúdo gerado por IA precisa de revisão humana e testes de regressão.

## Métricas de produto

Colete apenas o necessário e com finalidade definida: início/conclusão de lição, resultado de testes, tempo de execução, uso de dica, avanço de jornada, retorno diário e conversão de plano. Evite registrar código completo ou chats indefinidamente; retenha hashes, diagnósticos e amostras redigidas quando possível. Explique telemetria na política de privacidade e ofereça exclusão/exportação.

## Fases de implementação

1. Conteúdo original, editor JavaScript/Python e testes determinísticos.
2. Judge remoto isolado e ledger de progresso.
3. Jornadas, sequência, XP, energia e certificados.
4. Roadmaps, rankings e app móvel.
5. Tutor contextual com filtros anti-solução, limites e revisão de segurança.
6. Novas linguagens, matemática, projetos, ferramentas e plano pago.

Cada fase deve passar por testes de concorrência, replay, timeout, sandbox escape, abuso de energia, alteração de ranking, exclusão de conta e restauração de compra.

## O que continua desconhecido

A tecnologia de frontend/backend, provedor de execução, modelo de IA, prompts, esquema de banco, algoritmo de ranking, controles antifraude e métricas internas do Coddy não são públicos. Nenhuma dessas partes deve ser inventada como se tivesse sido extraída.

## Fontes usadas como especificação comportamental

- https://coddy.tech/pt
- https://coddy.tech/docs/pt
- https://coddy.tech/help/pt
- https://coddy.tech/ai-tutor
- https://coddy.tech/landing/courses

As páginas públicas descrevem lições, playgrounds, tutoria contextual, energia, planos, certificados e catálogo; este documento converte essas observações em uma arquitetura nova.

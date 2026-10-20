# Análise pública do Coddy.Tech

Data: 2026-10-20. Alvo: `https://coddy.tech/pt`.

Esta análise usa inspeção pública da página e pesquisa web. O REA disponível neste projeto é especializado em artefatos Android/APK; portanto, não tratei a página web como se fosse um APK nem alego ter recuperado o backend, código-fonte privado ou dados de usuários. A implementação sugerida abaixo é uma reconstrução independente de comportamento, não uma cópia de código, marca, texto, ilustrações ou cursos.

## O produto observado

O Coddy se apresenta como uma plataforma de programação interativa, gratuita para começar, com mais de 20 linguagens, roadmaps profissionais, editor no navegador, execução de código, testes automáticos, ajuda de IA, sequência diária, XP/pontuação, energia, placares e certificados. A página em português declara 5.856.119 alunos em 202 países e 87.916.026 envios ao vivo no momento da captura; esses números são conteúdo dinâmico exibido pelo próprio site, não uma medição independente.

O catálogo inclui Python, JavaScript, TypeScript, React, SQL, C/C++, Java, Go, Rust, PHP, Dart, Ruby, Swift, Kotlin, Unity, Docker, Kubernetes, matemática, xadrez e outras áreas. A página também expõe playgrounds para várias linguagens, ferramentas de referência e cursos com certificado verificável.

## Diferenciais funcionais

1. **Aprender escrevendo código real.** A unidade de ensino é um editor executável com entradas, saídas e casos de teste, em vez de apenas múltipla escolha.
2. **Roadmaps por objetivo.** O usuário escolhe uma profissão e recebe uma sequência ordenada de cursos; isso reduz a decisão sobre o que estudar depois.
3. **Feedback imediato.** Cada envio recebe resultado dos testes e pode abrir uma ajuda de IA (Bugsy).
4. **Amplitude de catálogo.** A mesma conta pode alternar linguagens, matemática e xadrez mantendo progresso separado.
5. **Sinal de empregabilidade.** Certificados com ID/URL de verificação e integração com LinkedIn transformam conclusão em artefato compartilhável.
6. **Distribuição multiplataforma.** A página promete web, iOS e Android, com execução no navegador e sem instalação de IDE.
7. **Retenção conhecida.** Sequência, congelamentos, metas, energia, recompensas e leaderboard tornam visível a prática diária.

## Arquitetura provável

O HTML público mostra uma aplicação web moderna com navegação por catálogo, landing pages localizadas, rotas de cursos e playgrounds. A execução de código exige uma fronteira de serviço isolada: o navegador envia código e configuração de linguagem; um executor remoto ou sandbox retorna stdout, erros, tempo e resultados dos testes. Certificados exigem uma API de progresso e uma página pública de verificação. A tutora de IA exige um serviço separado com contexto da lição e limites de segurança.

Uma arquitetura independente plausível:

```text
Web/mobile client
  -> API de conta e progresso
  -> Course/content service
  -> Judge gateway -> sandboxes efêmeras por linguagem
  -> Hint service -> modelo de IA com contexto mínimo
  -> Gamification service (streak, XP, energy, leaderboard)
  -> Certificate service (ID e verificação pública)
```

O backend real, provedores de nuvem, framework exato, regras de ranking e isolamento dos workers não são observáveis pela página e permanecem desconhecidos.

## Modelo de conteúdo

Cada lição deve possuir objetivo, explicação curta, código inicial, editor, conjunto de testes, dicas graduais, solução de referência, linguagem, dificuldade e pré-requisitos. O curso é um grafo ou lista ordenada de lições; o roadmap é uma visão que compõe cursos. Os testes devem ser executados no servidor para não confiar no resultado produzido pelo cliente.

## Como reproduzir o comportamento de forma independente

Comece por um MVP com uma linguagem segura (Python ou JavaScript), editor web, testes fixos, progresso por lição, sequência e certificados. Em seguida, adicione workers isolados, outras linguagens, roadmaps, leaderboard e dicas de IA. Mantenha conteúdo e regras originais: nomes, ilustrações, textos, identidade visual e exercícios do Coddy não devem ser copiados.

Contratos mínimos:

```ts
type Lesson = {
  id: string; title: string; language: string;
  prompt: string; starterCode: string;
  tests: Array<{ input: string; expected: string }>;
};

type Submission = {
  lessonId: string; code: string; clientRunId: string;
};

type SubmissionResult = {
  passed: boolean; tests: Array<{ passed: boolean; stdout?: string; error?: string }>;
  durationMs: number; score: number;
};
```

Segurança é o ponto mais difícil: cada execução precisa de processo/contêiner efêmero, usuário sem privilégios, filesystem temporário, rede desabilitada, limite de CPU/memória/tempo, tamanho máximo de saída e encerramento garantido. Nunca execute código enviado pelo usuário dentro do processo da API.

## O que torna a experiência eficaz

O ciclo é curto: escolher objetivo → ler uma ideia → editar código → executar → ver teste → pedir dica → avançar. Roadmaps dão direção; tarefas práticas fornecem prova de habilidade; streak e placar criam retorno; certificados oferecem um resultado externo. O valor diferencial sobre um app de quiz é que o produto valida artefatos executáveis, não apenas reconhecimento de respostas.

## Limites da reprodução

Pode-se reproduzir a categoria de produto e os mecanismos gerais. Não se deve copiar HTML, CSS, JavaScript, marca, textos, imagens, conteúdo de cursos, avatar Bugsy, certificados ou dados do Coddy. Também não há evidência pública suficiente para declarar compatibilidade com o backend, algoritmo de IA, sistema de ranking, sandbox ou métricas internas do Coddy.

## Fontes públicas

- Página principal: https://coddy.tech/pt
- Catálogo: https://coddy.tech/landing/courses
- Certificações: https://coddy.tech/certifications/pt
- Documentação: https://coddy.tech/docs/pt
- Central de ajuda: https://coddy.tech/help/pt
- Pesquisa de catálogo e cursos: https://coddy.tech/landing/pt/c/courses

As características acima foram derivadas do conteúdo público dessas páginas na data indicada; números e ofertas podem mudar.

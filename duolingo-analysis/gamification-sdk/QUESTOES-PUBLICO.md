# Questões: conteúdo, geração e seleção

Consulta pública: 2026-10-20. Este anexo usa apenas declarações oficiais; não reproduz código, prompts privados ou conteúdo do APK. `PUBLICO` significa descrição da empresa, não reprodução independente do backend. `PROPOSTA` significa desenho original para um SDK, não regra recuperada do Duolingo.

## Resposta direta

As duas coisas existem: conteúdo previamente preparado e sistemas que produzem variantes e montam sessões. Além disso, conversas de IA podem gerar falas durante a interação. Não há evidência para afirmar que toda pergunta normal seja inventada por um LLM quando o aluno abre uma lição.

É necessário separar quatro operações:

| Operação | O que se sabe publicamente | O que isso não prova |
|---|---|---|
| Autoria | Especialistas e ferramentas de IA produzem conteúdo | Que toda frase venha de IA |
| Construção de exercícios | Algoritmos transformam material em atividades | Que toda variante esteja armazenada como questão completa |
| Montagem da sessão | Seleção e ordenação de candidatos para o aluno | Que Birdbrain escreva texto livre |
| Conversação generativa | Respostas e perguntas podem ser produzidas ao vivo | Que o mesmo pipeline seja usado em todas as lições |

## Descoberta Q1 — Uma frase pode render vários exercícios

`PUBLICO`: o processo oficial divide currículo, conteúdo bruto, exercícios e personalização. A mesma frase pode originar lacuna, banco de palavras com distratores ou discriminação auditiva. Algoritmos escolhem elementos como a posição da lacuna; determinados exercícios de compreensão recebem autoria humana. Logo, contar frases e contar questões exibíveis são operações diferentes. A publicação também descreve um conjunto de exercícios por lição e seleção personalizada. [Processo oficial](https://blog.duolingo.com/how-duolingo-experts-work-with-ai/).

`DESCONHECIDO`: quais transformações ocorrem offline, quais no servidor ao solicitar uma sessão e quais ficam no cliente da versão analisada; quantas variantes reais derivam de cada item.

## Descoberta Q2 — Birdbrain não equivale a um chatbot

`PUBLICO`, histórico de 2020: Birdbrain estima a chance de um aluno acertar determinado exercício. O Session Generator usa isso para selecionar candidatos com dificuldade apropriada. A empresa relata testes A/B com melhora de aprendizagem e retorno ao aplicativo, sem fornecer nesta publicação tamanho suficiente para reconstituir o efeito. Isso descreve recomendação adaptativa, não geração livre de enunciados. [Introdução ao Birdbrain](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/).

`PUBLICO`, histórico: o Session Generator é descrito como componente de backend que seleciona a sequência de desafios a partir de dados de cursos. A publicação antiga não certifica a linguagem ou arquitetura do servidor atual. [Relato de engenharia](https://blog.duolingo.com/rewriting-duolingos-engine-in-scala/).

## Descoberta Q3 — IA de autoria pode alimentar um banco preparado

`PUBLICO`: a descrição de criação com LLM mostra especialistas definindo objetivo, tema e restrições; o modelo oferece candidatos e o especialista seleciona e edita antes de publicação. Isso é geração na produção do curso, não demonstração de geração por requisição de aluno. A declaração histórica sobre revisão humana não permite afirmar que toda questão de 2026 recebe revisão manual individual. [Criação assistida](https://blog.duolingo.com/large-language-model-duolingo-lessons/).

`PUBLICO`, 2025-04-30: a empresa anunciou 148 cursos com IA generativa, ferramentas internas e conteúdo compartilhado, partindo de cursos-base adaptados a outras línguas. O anúncio menciona IA criando e validando conteúdo; não publica o protocolo de validação nem garante revisão humana individual de cada item. [Anúncio oficial](https://investors.duolingo.com/news-releases/news-release-details/duolingo-launches-148-new-language-courses).

## Descoberta Q4 — Video Call tem geração durante a sessão

`PUBLICO`: a primeira pergunta da chamada é preparada enquanto ela toca, separadamente das instruções principais. O fluxo combina abertura, pergunta, conversa e encerramento. Há avaliações durante a chamada e um resumo de fatos extraído da transcrição para personalizar chamadas futuras. Isso distingue conversa generativa de seleção de exercícios tradicionais. Não foram recuperados prompts reais, política completa de memória ou quantidade exata de turnos. [Descrição técnica oficial](https://blog.duolingo.com/ai-and-video-call/).

## Consequências para o SDK de gamificação

`PROPOSTA`: desacoplar o gerador de conteúdo do contabilizador de recompensas. A questão deve registrar `contentId`, versão, objetivo, modalidade, origem editorial/algorítmica/generativa e validação. Uma tentativa deve registrar a decisão do corretor e o evento de recompensa separadamente. Assim, variar a apresentação não cria automaticamente um novo direito a XP ou uma conclusão de lição.

`PROPOSTA`: o contrato de seleção recebe progresso, necessidades de revisão e restrições; devolve itens com razões verificáveis. Dificuldade adaptativa deve considerar aprendizagem e continuidade, com métricas distintas para retenção, precisão e tempo útil. Uma sequência de acertos não deve provar domínio sem cobertura suficiente.

Não se conhecem os pesos atuais de Birdbrain, a probabilidade-alvo de acerto, os limites de repetição remunerada ou a combinação exata entre erro, dificuldade e XP. Qualquer número usado no SDK deve ser configuração original ou uma regra explicitamente confirmada por outra evidência, nunca apresentado como fórmula interna recuperada.

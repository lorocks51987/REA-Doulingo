# Análise geral do aplicativo — REA + Ghidra

Data da consolidação: 2026-10-20. Alvo principal: `Duolingo v6.101.2 (Premium).apk`, SHA-256 `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`.

## Como o aplicativo é dividido

O APK combina uma aplicação Android extensa, componentes Unity/IL2CPP e serviços remotos. O inventário REA encontrou 17.882 entradas ZIP, 10 DEX com 91.761 definições de classe, 81 bibliotecas nativas e 40 componentes declarados no manifesto. Esses números descrevem o artefato analisado; não provam que todos sejam usados em uma sessão.

### Camada Android/Java/Kotlin

É a camada mais legível para o produto. Ela contém modelos de sessão, desafios, progresso, recompensas, energia, combos, quests e ligas. O fluxo observado monta uma requisição de sessão, envia-a ao serviço remoto e desserializa um payload que inclui `challenges`, variantes adaptativas, substituição de erros, desafios intercalados, contexto de sessão e anotações TTS. O cliente mantém transições locais de nota e estado de combo, mas a autoridade final de recompensas e progresso deve ser tratada como remota quando o payload ou o fluxo exigir confirmação.

### Camada Unity/IL2CPP

`libduolingounity.so` tem 47 funções e funciona como carregador JNI de `com/unity3d/player/NativeLoader`, encaminhando para `libunity.so`. O passe Ghidra não encontrou regras de XP ou questões nessa ponte. `libil2cpp.so` foi importada, mas o passe padrão encontrou metadados de exceção inconsistentes e não gerou um relatório confiável; essa lacuna permanece explícita em [GHIDRA-RESULTADO-2026-10-20.md](reports/GHIDRA-RESULTADO-2026-10-20.md).

### Backend e conteúdo

As fontes públicas indicam uma arquitetura híbrida: especialistas e ferramentas de IA criam conteúdo bruto; pipelines geram variantes, distratores e formatos; um gerador de sessão seleciona e ordena desafios; modelos como Birdbrain predizem dificuldade. A presença de modelos de desafio no APK não permite distinguir, sozinha, conteúdo pré-cadastrado, variante transformada ou item gerado no servidor.

## Fluxo de uma sessão

1. O cliente constrói parâmetros de rota e uma requisição de sessão.
2. O servidor retorna um conjunto de desafios e contexto de sessão.
3. O cliente apresenta desafios e envia tentativas/telemetria.
4. O estado de nota classifica cada tentativa em `CORRECT`, `WRONG` ou `NONE`.
5. A máquina de combo preserva a sequência atual, registra o maior combo e aplica gates de experimento, idade da conta e elegibilidade.
6. O pipeline de recompensa filtra templates por momento do combo, duração/tipo de sessão, matéria, erros permitidos, experimentos e requisitos de energia; quando há distribuição, usa amostragem ponderada.
7. Quests, liga, energia e progresso são atualizados conforme recibos e confirmações disponíveis.

Essa sequência é um modelo de integração derivado de evidências parciais. Não é uma reprodução do protocolo privado.

## Regras observadas

Os enums de combo expõem momentos `IN_A_ROW_5`, `10`, `15`, `20`, `25`, `LONG_SESSION` e `PERFECT`. A transição de nota distingue acerto, erro e ausência de nota. O reset pode preservar o maior combo; o término pode ser condicionado a elegibilidade, combo inicial, energia e experimento. A estrutura de recompensa possui requisitos, operador (`EQ`, `NEQ`, `GT`, `GE`, `LT`, `LE`), templates, requisitos de sessão e distribuição probabilística. Boosts possuem categorias `ONE_POINT_FIVE`, `DOUBLE` e `TRIPLE`, mas os valores efetivos, duração e combinação não foram provados no APK.

Ligas possuem campos de tamanho/tipo de coorte, pontuação, promovidos, rebaixados, vencedores, perdedores, recompensas e período de espera. Isso prova um contrato de regras, não o algoritmo de matchmaking nem os números globais.

## Por que o produto tende a funcionar

As evidências públicas e locais convergem para um ciclo curto de feedback: desafio de baixa duração, correção imediata, sequência visível, recompensa variável, objetivo diário/quest, competição por coorte e retorno por streak/lembretes. A adaptação reduz frustração ao selecionar dificuldade e formato; a aleatoriedade limitada das recompensas cria antecipação; as ligas fornecem comparação social. A investigação não permite afirmar causalidade clínica nem “vício” em sentido médico.

## O que é fato, inferência e desconhecido

- Fato: os modelos e campos citados foram recuperados do APK por REA/JADX/Ghidra.
- Fato: o cliente possui transições explícitas de nota e estruturas de combo/recompensa.
- Inferência: a seleção final de conteúdo e a autoridade de concessão são predominantemente server-side.
- Desconhecido: pesos de Birdbrain, fórmulas privadas de XP, cohortização, tabelas de drops, critérios completos de elegibilidade e conteúdo remoto em tempo real.
- Não observado: execução do APK, login, tráfego autenticado, compra, alteração de bytes ou injeção.

## Índice de evidências e documentos de apoio

O [índice do SDK](../gamification-sdk/evidence-index.json) preserva 39 registros REA bem-sucedidos e 2 falhas. A documentação detalhada está em [gamification-sdk/SDK-GAMIFICACAO.md](../gamification-sdk/SDK-GAMIFICACAO.md), [gamification-sdk/DESCOBERTAS-REA.md](../gamification-sdk/DESCOBERTAS-REA.md), [evidência da revisão](../evidence/review-2026-10-20/ANALISE.md) e [resultado Ghidra](../reports/GHIDRA-RESULTADO-2026-10-20.md).

Este material é uma análise independente baseada em artefato local e fontes públicas. Não é SDK oficial, não fornece compatibilidade com API do Duolingo e não certifica um processo jurídico de clean-room.

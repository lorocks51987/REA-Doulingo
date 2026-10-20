# Validação da rodada de gamificação

Data: 20/10/2026.

## Análise REA

Foram executadas consultas focais de classes, buscas e métodos com a instalação REA 6.4.0 já existente em cache, usando JADX headless 0.7.1 e JDK 21 existente. Os IDs, operações, seletores, representação, hashes e limitações estão em [evidence-index.json](evidence-index.json).

Os três comandos CLI iniciais possuem arquivos `*.run.json`. As rodadas seguintes usaram o mesmo serviço de aplicação compartilhado CLI/MCP do REA, mantendo um provider serializado por rodada. Todas encerraram por `provider.close()`; os resultados estão nos registros de cleanup. Nenhum APK foi executado ou modificado.

Duas falhas foram preservadas, sem serem contadas como Evidence bem-sucedida: acesso negado aos controles nativos no sandbox, resolvido por execução autorizada fora dele, e consulta inicial a um namespace incorreto de `ChallengeSurrogate`, corrigida após conferir o inventário. Os arquivos originais de erro continuam no diretório `evidence`; tentativas corrigidas têm sufixo `retry1`.

O Java decompilado de alguns métodos de corrotina contém avisos e controle de fluxo inconsistente. O método de filtragem de recompensas usou fallback smali. O indicador de fonte completa não foi usado como garantia de reconstrução semântica. A análise não reconstruiu todos os chamadores, templates ativos, transações de concessão ou comportamento de servidor.

## Núcleo independente

Comando executado:

```powershell
node --test duolingo-analysis/gamification-sdk/reference-engine.test.mjs
```

Resultado final: **9 testes aprovados, 0 falhas**. Saída preservada em [validation-tests.tap](validation-tests.tap).

Casos: erro/sem nota/recorde; replay de tentativa; identidade conflitante e revisão; boosts ativos/expirados; aritmética racional/overflow; progresso e resgate de missão; desempate e zonas de liga; estado restaurado malformado; sorteio ponderado e pesos inválidos.

Esses testes verificam escolhas originais do módulo de referência. Não provam compatibilidade com Duolingo ou equivalência aos seus mecanismos. São testes em memória, sem rede, banco, concorrência entre processos, Android ou autenticação. Não há transação de concessão durável implementada.

## Documentação e índices

O comando abaixo confere identidade dos registros, unicidade de IDs, presença dos produtores investigados, links locais e o resultado salvo dos testes; gera hashes e a lista de referências web:

```powershell
node duolingo-analysis/gamification-sdk/build-evidence-index.cjs
```

As contagens efetivas estão na seção `validation` de [evidence-index.json](evidence-index.json). Os links web foram consultados para pesquisa; a verificação local do índice não faz teste contínuo de disponibilidade nem coleta snapshots completos dessas páginas.

## Escopo e custos não medidos

O Node disponível foi `v22.23.2`; o `.nvmrc` pede `24.18.0`. Não foi instalado outro toolchain. Não foram executados gates do repositório REA porque não houve alteração de produção CLI/MCP; os checks foram do artefato autônomo entregue.

Os arquivos de execução registram tempos das consultas, sem constituir benchmark comparável. Tokens, CPU total e pico de memória da família de processos não foram medidos. Não foram reproduzidos resultados A/B publicados, modelos científicos ou alegações clínicas de dependência.

Não se verificaram assinatura oficial do APK, cobertura integral DEX/JADX, reconstrução IL2CPP, conteúdo completo de cursos, modelos privados, configurações por usuário, fórmulas completas de XP, antifraude, matchmaking ou resgate remoto de recompensas.

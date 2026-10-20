# Gamificação e competitividade

Comece por [SDK-GAMIFICACAO.md](SDK-GAMIFICACAO.md): regras propostas, APIs do núcleo executável e limites.

| Documento | Finalidade |
|---|---|
| [Descobertas REA](DESCOBERTAS-REA.md) | Transições e gates de combo, Energia, boosts e ligas |
| [Questões — fontes públicas](QUESTOES-PUBLICO.md) | Autoria, variantes, montagem e geração em conversa |
| [Questões — cliente](QUESTOES-APK.md) | Modelos e fluxo estático de sessão |
| [Regras públicas](GAMIFICACAO-PUBLICO.md) | Competição, hábito, retorno e estudos históricos |
| [Descoberta local](DISCOVERY-LOCAL.md) | Candidatos e leituras smali com locais precisos |
| [Distribuição de Energia](DISTRIBUICAO-LOCAL.md) | Corroboração local do caminho de seleção ponderada |
| [Núcleo de referência](reference-engine.mjs) | Implementação original em memória |
| [Testes](reference-engine.test.mjs) | Casos de correção do núcleo, não paridade com Duolingo |
| [Índice](evidence-index.json) | IDs de Evidence, hashes, fontes e falhas preservadas |
| [Validação](VALIDACAO.md) | Checks executados e cobertura não verificada |

Este material não é SDK oficial, não usa a API do Duolingo e não recupera o backend. A investigação teve acesso a código decompilado; não certifica isolamento clean-room formal. O núcleo usa políticas originais, claramente separadas da pesquisa.

Para executar os testes sem instalar dependências:

```powershell
node --test duolingo-analysis/gamification-sdk/reference-engine.test.mjs
```

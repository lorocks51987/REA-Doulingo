# Validação executada

Data: 20/10/2026.

## Inspeção e pesquisa

- APK selecionado identificado por SHA-256, tamanho, inventário ZIP e cabeçalhos DEX na rodada registrada em `../artifact-identity.json`.
- Consulta REA/JADX da classe `ApiGuess` concluída: `ev_07d5a62efbd12891e1f8fcd491e5fb46e0c289e863c3d3925c58a7486aa7f3a8`. O registro preserva o digest do APK e os membros apresentados pelo engine.
- Evidências anteriores de classes, barra de progresso, método de retenção e Ghidra reexaminadas; não foram repetidas as análises nativas.
- Fontes públicas e código de repositórios lidos pela web. Nenhum projeto pesquisado foi instalado, executado ou chamado para acessar uma conta Duolingo.

## Verificação documental local

Comando executado com sucesso, sem dependências instaladas:

```powershell
node duolingo-analysis/review-2026-10-20/sdk/index-and-validate.cjs
```

Resultado:

| Verificação | Resultado |
|---|---|
| Catálogo versus lista original REA | 9.021 nomes iguais, sem duplicação |
| Agrupamento | 62 namespaces disjuntos; contagens reconciliadas |
| Arquivos citados em proveniência | Quatro hashes conferidos |
| Assets | 599 entradas |
| Bibliotecas nativas | 81 entradas |
| Manifesto anterior | 40 permissões, 477 componentes |
| Evidências focais | Dois registros com digest do alvo correspondente |
| Referências web | 44 URLs únicas indexadas; não é teste de disponibilidade contínua |
| Links locais de conteúdo | 17 destinos existentes no momento da execução |
| TypeScript documental | Sintaxe aceita por `stripTypeScriptTypes` do Node; resultado removido de tipos aceito pelo parser JavaScript |
| Origens literais | 194 entradas preservadas da indexação anterior; nenhum endpoint testado |

Os links para o próprio índice gerado e para este relatório são excluídos do contador de links de conteúdo para permitir geração sequencial. Ambos existem no pacote final.

O índice `document-index.json` contém hashes dos documentos e dos novos registros focais. O script pode ser reexecutado para conferir proveniência e atualizar o índice após uma edição.

## Limites da validação

Não foi executado `tsc` ou typecheck semântico dos contratos. A verificação por remoção de tipos prova apenas aceitação sintática pelo mecanismo utilizado. Os contratos não têm implementação ou validação de fronteira pronta.

O Node disponível foi `v22.23.2`; o `.nvmrc` do repositório pede `24.18.0`. Não foi instalado ou trocado o toolchain. Estes foram checks documentais autônomos, não os gates de build/testes do REA. O mecanismo de remoção de tipos emitiu aviso experimental; o comando concluiu com código zero.

Não foram executados testes do produto proposto, testes Android, emulador, medições de rede, benchmarking de modelos, verificação de assinatura oficial, reprodução de resultados científicos ou análise IL2CPP completa. Nenhum resultado aqui estabelece paridade com o app ou acesso ao seu backend.

Não se alteraram código de produção, contratos CLI/MCP ou configuração do REA. Não foram instaladas dependências, feitas compras, utilizados cookies ou enviadas mensagens a terceiros.

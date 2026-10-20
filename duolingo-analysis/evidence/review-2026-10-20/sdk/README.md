# Dossiê e SDK independente inspirado no Duolingo

Comece pela [especificação principal](SDK-DUOLINGO-ESPECIFICACAO.md).

O pacote combina pesquisa do APK e da web com uma proposta original de SDK. Cada parte distingue observação, declaração pública, inferência e proposta. Não contém SDK oficial ou backend recuperado; a exposição ao código decompilado impede certificar separação clean-room formal.

| Arquivo | Uso |
|---|---|
| [Especificação](SDK-DUOLINGO-ESPECIFICACAO.md) | Arquitetura, recursos, contratos, regras propostas e lacunas |
| [Pesquisa de produto](../PESQUISA-PRODUTO.md) | Recursos divulgados e diferenças entre épocas |
| [Repositórios](../REPOSITORIOS.md) | Pesquisas, clientes históricos e motores públicos |
| [Catálogo do APK](APK-CATALOGO.md) | Mapa estático de módulos, permissões e recursos |
| [Catálogo JSON](sdk-apk-catalog.json) | 9.021 nomes completos e metadados com proveniência |
| [Contratos](contracts.ts) | Interfaces TypeScript originais; sem implementação |
| [Origens de rede](network-origins.json) | 194 origens literais; sem observação de tráfego |
| [Índice](document-index.json) | Hashes, URLs de referência e evidências focais |
| [Validação](VALIDACAO.md) | Checks executados e limitações |

Pesquisa consultada em 20/10/2026; fontes e ofertas podem mudar. Para implementação independente, começar pelos requisitos marcados `PROPOSTA` e por conteúdo autoral.

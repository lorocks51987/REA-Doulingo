# Repositórios públicos: fatos úteis para a especificação independente

Consulta: 20/10/2026. Inspeção de páginas e código publicados; nenhum destes projetos foi instalado ou executado, e nenhuma API do Duolingo foi chamada. URLs de branches são mutáveis. Apenas HLR teve revisão identificada: `0041df0` no histórico consultado. Datas de indexação da busca não equivalem à data da última alteração.

## Aprendizagem e avaliação

### HLR oficial

[duolingo/halflife-regression](https://github.com/duolingo/halflife-regression) publica pesquisa de repetição espaçada, não o backend atual. A implementação calcula meia-vida a partir de um produto de pesos e atributos, aplica limites e prevê recordação em função do intervalo; inclui alternativas de comparação. [Código inspecionado](https://github.com/duolingo/halflife-regression/blob/master/experiment.py).

O conjunto histórico distingue aluno, idioma de estudo/interface, lexema, intervalo, exposições e acertos anteriores e da sessão. Isso ajuda a projetar eventos de aprendizagem sem presumir equivalência com o APK. [README](https://github.com/duolingo/halflife-regression/blob/master/README.md?plain=1). Licença MIT confirmada no [arquivo de licença](https://github.com/duolingo/halflife-regression/blob/master/LICENSE.md). [Histórico com revisão 0041df0](https://github.com/duolingo/halflife-regression/commits/master/).

### SLAM: pesquisa independente sobre dados do Duolingo

[NYUCCL/duolingoSLAM](https://github.com/NYUCCL/duolingoSLAM) é uma submissão acadêmica de 2018, não código do produto. O README relata posições na competição e fluxo com SyntaxNet, frequência lexical e LightGBM; resultados não foram reproduzidos.

Em [processing.py](https://github.com/NYUCCL/duolingoSLAM/blob/master/processing.py), `User`, `Exercise` e `Instance` organizam histórico, exercício e palavra. O parser trata países como lista, dias como número e tempo ausente/inválido como desconhecido; gera atributos de formato, sessão, cliente, comprimento e repetição de contexto. Estatísticas temporais preservam encontros e médias de erro. Uso independente: avaliar previsão de dificuldade por palavra, sem transformar esses atributos em contrato oficial. Licença não verificada nesta inspeção.

### STAPLE: traduções alternativas

[sweta20/duolingo-shared-task](https://github.com/sweta20/duolingo-shared-task) documenta uma submissão de 2020 para gerar várias traduções aceitáveis. O README descreve ajuste de tradução automática, hipóteses múltiplas e filtragem por classificador. Para o SDK independente, a implicação é representar conjuntos de respostas e avaliação de cobertura, em vez de uma única tradução literal. Não prova o avaliador atual do Duolingo. Código dos scripts não ficou acessível nesta coleta; detalhes de execução e licença não foram verificados.

## Notificações

[jakemaz66/RecoveringSleepingBandit](https://github.com/jakemaz66/RecoveringSleepingBandit) é uma reprodução independente de pesquisa, sem autoridade para descrever produção. O [arquivo algorithm_bandit.py efetivamente lido](https://raw.githubusercontent.com/jakemaz66/RecoveringSleepingBandit/main/algorithm_bandit.py) codifica elegibilidade de templates, calcula recompensa quando selecionado versus elegível e não selecionado, aplica penalidade de recência e avalia escolha por máximo com ponderação pela política anterior. A avaliação contém scores fixos e tratamento específico de um template; não é uma biblioteca pronta nem validação do artigo. Não reproduzimos seu ganho alegado. Licença não verificada. Uso independente: separar elegibilidade, histórico, seleção e recompensa; validar qualquer algoritmo com dados próprios.

## API não oficial e compatibilidade histórica

[KartikTalwar/Duolingo](https://github.com/KartikTalwar/Duolingo) se identifica como API Python não oficial. MIT confirmado na página e no [arquivo LICENSE.md](https://github.com/KartikTalwar/Duolingo/blob/master/LICENSE.md).

O [duolingo.py inspecionado](https://github.com/KartikTalwar/Duolingo/blob/master/duolingo.py) contém leitura de perfil, streak, calendário, idiomas, progresso, habilidades e vocabulário; também contém operações de compra e troca de idioma. Alguns métodos aparentemente de leitura podem trocar idioma. Referências incluem `/users/{username}`, `/2017-06-30/users/{id}`, `/vocabulary/overview` e dicionário de hints. São strings observadas no cliente, sem confirmação de disponibilidade ou schema atual. Não foram copiados código, cookies ou credenciais. Para implementação independente, modelar esses conceitos em serviço próprio e exigir efeitos explícitos.

Um [relato de JSONDecodeError no vocabulário](https://github.com/KartikTalwar/Duolingo/issues/139) é evidência de problema reportado por terceiro em 2024; não reproduzimos o problema e ele não estabelece o estado atual da API.

## Animação: componente público, identidade visual separada

[rive-app/rive-runtime](https://github.com/rive-app/rive-runtime/) oferece runtime C++ para arquivos `.riv`, artboards, animações e máquinas de estado. Isso é capacidade do motor, não prova de qual versão o APK usa.

No [artboard.hpp inspecionado](https://raw.githubusercontent.com/rive-app/rive-runtime/main/include/rive/artboard.hpp), existem estruturas separadas para animações, máquinas de estado, renderização, eventos, texto e contexto de dados. Um SDK próprio pode expor comandos semânticos como iniciar fala, acertar e errar, mantendo o renderizador substituível. Não se concluem nomes de inputs, visemas ou estados do Duolingo a partir do runtime genérico. Nenhum personagem ou arquivo visual do Duolingo foi incorporado. Licença do arquivo não verificada nesta coleta.

## Limites da pesquisa e uso clean room

As notas acima são fatos resumidos e propostas de uso independente. Não constituem SDK oficial ou contrato de integração com Duolingo. A documentação feita por quem viu código descompilado não estabelece, sozinha, uma separação clean room estrita: para isso, entregar apenas requisitos comportamentais revisados a implementadores sem acesso ao material proprietário. Repositórios de terceiros que redistribuem assets ou se intitulam clones não foram usados como fonte de implementação. Conteúdo curricular, áudios, mascotes, marca, modelos treinados e regras de servidor continuam sem autorização de reutilização demonstrada.

Não foram localizados e validados repositórios oficiais completos de SLAM, STAPLE ou do bandit de notificações nesta coleta. Os exemplos acadêmicos acima não substituem essa lacuna. Não há validação em runtime, benchmark ou medição de tokens/CPU/memória desses projetos.

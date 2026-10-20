# Distribuição de recompensas de energia

Inspeção estática local de 2026-10-20 por shell; sem execução do APK, conta ou backend. Não são novos Evidence REA. Caminhos relativos a `duolingo-extracted/`.

## Produtor concreto

`smali_classes2/cid.smali`, método `b(int, String, ComboMoment, Subject, int, boolean, boolean, Integer, Lyv8): Object`, linha 146, contém seleção de quantidade de energia a partir de `InLessonReward.probabilityDistribution`.

- Campo `k` da recompensa lido na linha 399.
- Mapa vazio ou soma de pesos não positiva: não escolhe quantidade nesse caminho (aproximadamente 405–431).
- Soma os valores do mapa; obtém valor aleatório na linha 435 e multiplica pela soma na linha 439.
- Percorre pares de quantidade inteira/peso, acumula os pesos (484) e escolhe a primeira quantidade cujo acumulado alcança o valor sorteado. Há fallback para uma chave no fim da iteração; o significado exato de `wo7.n0` não foi examinado.
- Calcula separadamente soma de `quantidade × peso` (576, agregação aproximadamente 586); este trecho não divide pela soma dos pesos. Para pesos que somam um, corresponde ao valor esperado usual; não afirmar normalização universal.
- Retorna resultado na linha 606.

A origem aleatória foi seguida: `smali_classes4/q4.smali`, método `e(): double`, linha 68, delega a `java.util.Random.nextDouble()` na linha 75. Logo há sorteio concreto no cliente, não apenas um nome de campo probabilístico.

`smali_classes6/xhd.smali`, construtor linha 18 e `toString` 201–225, identifica o resultado como `RewardDetermination` com ID da recompensa encontrada, energia concedida, valor esperado e presença de template. Quantidade concedida é um inteiro opcional; ausência não equivale a zero sem observar o consumidor.

## Elegibilidade antes do sorteio

`cid.c(EnergyRewardsTemplate, int, String, ComboMoment, Subject, int, boolean, boolean, Integer, Lyv8)` linha 611 percorre candidatos e chama o predicado `ya6.p` na linha 771. Também existe `cid.d(InLessonRewardExperimentRequirement, Lyv8)` linha 895 para requisitos de experimento. Nesta nota não foi demonstrada a política completa de prioridade entre candidatos.

`smali_classes6/ya6.smali`, `p(InLessonReward, int, String, ComboMoment, Subject, int, boolean, boolean, Integer): boolean`, linha 5552: exige que o momento de combo esteja na lista da recompensa, e verifica grupos de requisitos por comparadores. A inspeção dos primeiros grupos mostra listas vazias como ausência de restrição e alternativas dentro da lista; o método completo e `H` ainda precisam de inspeção para especificar todos os operadores sem ambiguidade.

`smali/com/duolingo/data/energyrewards/ComboMoment.smali`, inicializador 50: momentos serializados distinguem cinco, dez, quinze, vinte e vinte e cinco respostas seguidas, sessão longa e perfeito (strings 57–131). Esses valores enumerados não garantem que cada momento gere prêmio: ainda dependem de candidato, requisitos, experimento e distribuição.

## Conclusão com escopo

O APK implementa uma infraestrutura de **recompensa de energia variável por distribuição**, condicionada por contexto e experimentos. Não foi observada uma distribuição real de conta nem seu catálogo de valores ativos. Uma distribuição com uma única quantidade também produz prêmio fixo. Não estender a constatação a XP, gemas ou todas as contas. Nenhuma medição causal sobre retenção, dependência ou comportamento humano foi feita.

Para confirmação REA, candidatos pequenos e diretos: `cid.b`, `cid.c`, `q4.e`, `xhd.toString`; para requisitos, `ya6.p` e `ya6.H`.

# Resultado da análise headless do Ghidra

## Alvo

- Biblioteca: `libgame.so`
- Arquitetura: AArch64/ARM64
- Projeto: `C:\dev\REA\ghidra-projects\Duolingo_Ghidra_focus`
- Método: análise headless + decompilador Ghidra + busca de strings e referências

## Resultado

O script encontrou 7 funções relacionadas a strings dos termos procurados. A maioria pertence a código genérico do Android/Unity, não à lógica de aprendizado:

- `_ShowImpl`: controle do teclado virtual Android e entrada de texto.
- `GameActivityEventsInit`: registro de eventos de toque, teclado e ponte JNI.
- `FUN_0011f3b4`, `FUN_0011d1d0` e outras: rotinas de `libunwind`/tratamento de exceções.

Isso é um resultado importante: `libgame.so` não expôs, nesta busca, funções claramente nomeadas como XP, sequência ou lição. A lógica de produto provavelmente está na camada DEX/Java/Kotlin, em bibliotecas Unity/IL2CPP maiores ou no backend.

## Pseudocódigo completo

Está em `ghidra-interesting-functions.txt`. Ele deve ser tratado como pseudocódigo aproximado, não como código-fonte original.

## Próximo alvo técnico

Para lógica nativa específica, o próximo alvo é `libil2cpp.so`, mas sua análise exige tratamento separado por ser uma biblioteca Unity/IL2CPP de aproximadamente 29 MB. Para XP, progresso, sessão e telemetria de produto, REA/JADX continua sendo o caminho mais informativo.

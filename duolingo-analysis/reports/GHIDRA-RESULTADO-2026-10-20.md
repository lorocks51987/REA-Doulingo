# Resultado Ghidra — bibliotecas nativas

## Escopo

Análise headless estática do APK local. Nenhum APK foi executado, nenhuma sessão foi iniciada e nenhuma biblioteca foi modificada.

## `libduolingounity.so`

- Arquivo: `apk-raw/lib/arm64-v8a/libduolingounity.so`
- SHA-256: `653f965fb738564c29de06f1a96ee9880373bc4bfce55befcd6a96ec45d709bf`
- Arquitetura: AArch64/ARM64
- Projeto Ghidra: `ghidra-projects/Duolingo_Ghidra_unity`
- Resultado: 47 funções identificadas.

O pseudocódigo mostra `JNI_OnLoad` registrando métodos em `com/unity3d/player/NativeLoader` e rotinas de carregamento dinâmico (`dlopen`, `dlsym`) para `libunity.so`. Não apareceram funções ou strings que implementem XP, combo, questões, energia, ligas ou recompensas.

Relatório detalhado: `ghidra-libduolingounity-new.txt`.

## `libil2cpp.so`

- Arquivo: `apk-raw/lib/arm64-v8a/libil2cpp.so`
- Projeto Ghidra: `ghidra-projects/Duolingo_Ghidra_il2cpp`
- Resultado: importação iniciada, mas a análise não terminou de forma utilizável.

O Ghidra encontrou muitos metadados de exceção inconsistentes (`LSDACallSiteTable`: corpos de função e landing pads não correspondentes), produzindo uma quantidade muito grande de erros durante a análise. O processo foi interrompido antes da geração do relatório para evitar considerar pseudocódigo parcial como evidência. Isso é uma limitação do passe padrão em uma biblioteca Unity/IL2CPP grande, não uma evidência de que as regras não existam nela.

## Conclusão arquitetural

O passe nativo reforça a separação já observada no DEX: a ponte Duolingo/Unity é um carregador JNI, enquanto os modelos de sessão, desafios, combo, recompensa e liga estão expostos na camada Java/Kotlin e nos serviços remotos. A ausência de símbolos de produto no `libduolingounity.so` não permite concluir que o backend ou o IL2CPP não contenham outras regras.

## Limitações e proveniência

Este documento registra observações do Ghidra 12.1 em modo headless. O pseudocódigo é aproximado; nomes e tipos recuperados pelo decompilador não são código-fonte original. O passe `libil2cpp.so` é incompleto e deve permanecer como falha preservada, não como resultado negativo.

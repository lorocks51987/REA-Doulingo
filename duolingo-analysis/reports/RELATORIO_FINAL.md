# Dossiê consolidado — Duolingo APK e LingoLab

## Resultado

O APK analisado é `com.duolingo`, versão `6.101.2`, código `2476`, com 76.741 classes e 17.882 recursos. O SHA-256 é `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`.

## Ferramentas usadas

- REA + JADX: classes Android, manifesto, aplicação e inventário.
- Apktool: smali e recursos extraídos parcialmente.
- Ghidra 12.1: bibliotecas ELF ARM64 nativas.
- Temurin JDK 21: execução dos analisadores.

## Arquitetura observada

- Android/DEX: `DuoApp`, `LaunchActivity`, login, usuário, ciclo de vida, rede e telemetria/performance.
- Unity/IL2CPP: `libil2cpp.so`, `libunity.so`, `libgame.so` e `libduolingounity.so`.
- Suporte: áudio, animação, armazenamento e bibliotecas JNI.

## Artefatos

- APK original: `C:\dev\REA\Duolingo v6.101.2 (Premium).apk`
- Smali/recursos: `C:\dev\REA\duolingo-extracted`
- Extração bruta completa: `C:\dev\REA\duolingo-analysis\apk-raw` — 17.882 arquivos
- `.so` ARM64: `C:\dev\REA\duolingo-native`
- Projetos Ghidra: `C:\dev\REA\ghidra-projects\Duolingo_ARM64_small` e `Duolingo_ARM64_v2`
- Código adaptado: `C:\dev\REA\lingolab\App.tsx`

## Aplicação no LingoLab

Foram implementados padrões gerais e originais: microlições, XP, sequência, meta diária, feedback imediato, progresso visível e painel de retomada para lições interrompidas.

## Limitações

Esta é uma análise estática. Não houve execução do APK, captura de tráfego ou recuperação do código-fonte proprietário. `libil2cpp.so`, `libunity.so` e algumas bibliotecas de animação são grandes e exigem análise individual mais lenta no Ghidra.

## Evidências REA

`ev_3d994d864c0dcf7565445ab9484a87457e332681b11cd33f5fef1f5aacf47238`, `ev_2e173853d8f7cb8bb60d9d8f71c9e7e582b6ea8a6f1f90b6e7176d5a4ac2c6b0` e `ev_f53b1394922ef1e618c9b6e5c03789e7b9e2620e40ef8c2da2f57cb81191879b`.

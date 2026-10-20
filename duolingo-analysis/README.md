# Dossiê único — análise do APK Duolingo

Este diretório centraliza a análise. Os artefatos grandes permanecem em seus locais originais para evitar cópias desnecessárias.

## Arquivo principal

- APK: `C:\dev\REA\Duolingo v6.101.2 (Premium).apk`
- SHA-256: `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f`

## Relatórios

- Relatório técnico: `C:\dev\REA\DUOLINGO_APK_ANALYSIS_REPORT.md`
- Relatório clean-room do LingoLab: `C:\dev\REA\REA_CLEANROOM_REPORT.md`

## Evidências REA/JADX

- APK completo: `ev_3d994d864c0dcf7565445ab9484a87457e332681b11cd33f5fef1f5aacf47238`
- Busca de classes: `ev_2e173853d8f7cb8bb60d9d8f71c9e7e582b6ea8a6f1f90b6e7176d5a4ac2c6b0`
- `DuoApp`: `ev_f53b1394922ef1e618c9b6e5c03789e7b9e2620e40ef8c2da2f57cb81191879b`

## Estrutura dos artefatos

- Extração Apktool/smali: `C:\dev\REA\duolingo-extracted`
- Extração bruta completa do APK: `C:\dev\REA\duolingo-analysis\apk-raw`
- Bibliotecas nativas extraídas: `C:\dev\REA\duolingo-native`
- Projetos Ghidra: `C:\dev\REA\ghidra-projects`
- Logs do Ghidra: `C:\dev\REA\ghidra-*.log`
- Projeto adaptado: `C:\dev\REA\lingolab`

## Como abrir

Para abrir os projetos Ghidra:

```powershell
& 'C:\dev\REA\tools\ghidra_12.1_PUBLIC\ghidraRun.bat'
```

Depois selecione `C:\dev\REA\ghidra-projects` e abra `Duolingo_ARM64_small`.

## Limites

O APK não deve ser tratado como código-fonte original. DEX, recursos e bibliotecas nativas precisam de ferramentas diferentes; por isso o dossiê reúne REA/JADX, Apktool e Ghidra. As conclusões são estáticas e não comprovam comportamento em execução.

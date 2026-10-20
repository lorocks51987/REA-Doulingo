---
title: Dossiê de Evidências REA e Hashes
tags:
  - evidencias
  - rea
  - hashes
  - integridade
  - auditoria
date: 2026-10-20
---

# 📑 Dossiê de Evidências REA e Hashes

Esta nota cataloga os identificadores de evidências gerados pelo motor **REA (Reverse Engineer Anything)** durante a inspeção do pacote APK.

Voltar ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 🔒 Hashes Criptográficos e Arquivos Locais

| Arquivo | Localização no Projeto | SHA-256 |
| :--- | :--- | :--- |
| **APK Principal** | `duolingo-analysis/binaries/Duolingo v6.101.2 (Premium).apk` | `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f` |
| **APK Secundário** | `duolingo-analysis/binaries/com.duolingo-5-158-4-android6.apk` | Verificado em auditoria prévia |
| **Instalador Desktop** | `duolingo-analysis/binaries/Duolingo - Language Lessons Installer.exe` | Arquivo Windows PE32 |

---

## 🧬 Identificadores de Evidência REA

* **`ev_3d994d864c0dcf7565445ab9484a87457e332681b11cd33f5fef1f5aacf47238`**:
  * *Descrição*: Registro primário de ingestão do APK no JADX headless, comprovando o carregamento das 76.741 classes DEX e manifesto.
* **`ev_2e173853d8f7cb8bb60d9d8f71c9e7e582b6ea8a6f1f90b6e7176d5a4ac2c6b0`**:
  * *Descrição*: Inventário e extração do catálogo de bibliotecas nativas ARM64 (`lib/arm64-v8a/`).
* **`ev_f53b1394922ef1e618c9b6e5c03789e7b9e2620e40ef8c2da2f57cb81191879b`**:
  * *Descrição*: Mapeamento da classe `com.duolingo.core.DuoApp` e rastreamento das chamadas de inicialização crítica.
* **`ev_f4f2bdf998f50d1b4c7ba96436e04619950c559d42b5a3cd22ee16706b94e951`**:
  * *Descrição*: Varredura semântica dos arquivos Smali e recursos descompactados com identificação dos termos de produto.

---

## 🔗 Notas Relacionadas
* [[Visão Geral e Identidade do APK]]
* [[Inventário de Classes e Bibliotecas ELF ARM64]]
* [[Modelo de Implementação Própria (Clean-Room)]]

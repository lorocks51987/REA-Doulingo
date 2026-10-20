---
title: Inventário de Classes e Bibliotecas ELF ARM64
tags:
  - inventario
  - elf
  - arm64
  - classes-dex
  - bibliotecas
date: 2026-10-20
---

# 📦 Inventário de Classes e Bibliotecas ELF ARM64

Registro detalhado dos componentes de baixo nível e contadores identificados na extração e análise.

Voltar ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 🏛️ Inventário de Bibliotecas Nativas (`lib/arm64-v8a/`)

Total de **22 bibliotecas nativas** encontradas no APK:

1. `libil2cpp.so` — Código Unity C++ convertido via IL2CPP (~29 MB).
2. `libunity.so` — Engine de renderização e runtime da Unity (~20 MB).
3. `libgame.so` — Lógica de interação de jogo e eventos de toque (~4.5 MB).
4. `librive.so` — Motor vetorial Rive para renderização dos personagens (~3.8 MB).
5. `librive-android.so` — Integração do Rive com views nativas do Android.
6. `libduolingounity.so` — Camada de comunicação JNI entre Duolingo e Unity.
7. `libmain.so` — Ponto de entrada nativo C++ de inicialização.
8. `libflutter.so` / `libapp.so` — Não presentes (Duolingo não utiliza Flutter nesta versão).
9. Bibliotecas adicionais de áudio, descompactação, decodificadores de mídia e codecs Ogg/WebM.

---

## 📂 Contadores e Métricas de Código

* **Total de Classes DEX**: 76.741 classes.
* **Arquivos Smali extraídos via Apktool**:
  * 1.179 arquivos contendo referências textuais a `lesson`.
  * 17.277 arquivos com termos de produto e gamificação (inclui dependências de terceiros e código gerado).
* **Recursos Brutos Extraídos**:
  * 17.882 arquivos (layouts XML, strings, assets de áudio `.mp3`/`.ogg`, animações e fontes).

---

## 🔗 Notas Relacionadas
* [[Camada Nativa e JNI (Ghidra & C++)]]
* [[Arquitetura Híbrida (Android DEX vs Unity vs Rive)]]
* [[Dossiê de Evidências REA e Hashes]]

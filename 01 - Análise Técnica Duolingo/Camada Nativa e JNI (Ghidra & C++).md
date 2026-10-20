---
title: Camada Nativa e JNI (Ghidra & C++)
tags:
  - ghidra
  - nativo
  - arm64
  - jni
  - c-plus-plus
  - engenharia-reversa
date: 2026-10-20
---

# ⚙️ Camada Nativa e JNI (Ghidra & C++)

A análise em baixo nível das bibliotecas dinâmicas ELF AArch64 (`.so`) foi executada no **Ghidra 12.1** com decompilação AArch64 e inspeção de símbolos JNI.

Voltar ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 🔬 Bibliotecas Nativas Analisadas

O APK contém 22 bibliotecas em `lib/arm64-v8a/`:

| Biblioteca | Tamanho Aprox. | Função Identificada |
| :--- | :--- | :--- |
| `libil2cpp.so` | ~29 MB | Código C++ gerado a partir do C# do Unity (lógica de minigames). |
| `libunity.so` | ~20 MB | Runtime da engine Unity (renderizador, física, áudio 3D). |
| `libgame.so` | ~4.5 MB | Código proprietário de interação e loop de eventos de jogo. |
| `librive.so` | ~3.8 MB | Renderizador vetorial e máquina de estados para animações Rive. |
| `libduolingounity.so` | ~1.2 MB | Conector JNI específico entre a Activity Android e o Unity. |
| `libmain.so` | ~250 KB | Ponto de entrada padrão de inicialização nativa Android. |

---

## 🕵️ Descobertas no Ghidra (`libgame.so`)

O projeto Ghidra analisou `libgame.so` e extraiu funções candidatas:

1. **`GameActivityEventsInit`**:
   * Inicializa o subsistema de captura de eventos de hardware do Android (toques na tela, gestos multitoque e ciclo de vida de foco de janela).
2. **`_ShowImpl`**:
   * Responsável por chamar a API do Android `InputMethodManager` para erguer ou ocultar o teclado virtual nativo enquanto a tela de jogo nativa está ativa.
3. **Mecanismos de Exceção (`libunwind`)**:
   * Contém rotinas de tratamento de falhas em C++ para evitar que uma exceção em tempo de execução derrube o app abruptamente sem registrar telemetria.

---

## 🚫 O Que Não Está no Código Nativo

A descompilação no Ghidra confirmou que:
* **Não há regras de negócio centrais em C++**: Cálculo de pontuação de XP, regras de ofensiva (*streak*), catálogo de cursos e compras ficam na **camada DEX/Java** ou são validados diretamente no **backend**.
* Isso significa que o código nativo é utilizado quase exclusivamente para **desempenho gráfico, animação e renderização**, e não para a lógica contábil da gamificação.

---

## 🔗 Notas Relacionadas
* [[Arquitetura Híbrida (Android DEX vs Unity vs Rive)]]
* [[Inventário de Classes e Bibliotecas ELF ARM64]]
* [[Dossiê de Evidências REA e Hashes]]

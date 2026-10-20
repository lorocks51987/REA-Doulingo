---
title: Visão Geral e Identidade do APK
tags:
  - duolingo
  - apk
  - engenharia-reversa
  - jadx
  - rea
date: 2026-10-20
---

# 📦 Visão Geral e Identidade do APK

Esta nota reúne a caracterização estática completa do pacote Android do Duolingo inspecionado via **REA** com o provider **JADX headless**.

Voltar ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 🏷️ Identidade do Artefato

| Propriedade | Valor Observado |
| :--- | :--- |
| **Nome do Pacote** | `com.duolingo` |
| **Versão** | `6.101.2` (Version Code: `2476`) |
| **Arquivo Local** | `duolingo-analysis/binaries/Duolingo v6.101.2 (Premium).apk` |
| **Tamanho** | ~200 MB |
| **SHA-256** | `19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f` |
| **SDK Mínimo (minSdkVersion)** | `29` (Android 10) |
| **SDK Alvo (targetSdkVersion)** | `36` (Android 16 preview/alvo) |
| **Classe de Aplicação** | `com.duolingo.core.DuoApp` |
| **Activity Inicial (Launcher)** | `com.duolingo.splash.LaunchActivity` |

---

## 📊 Volume de Código e Recursos

* **Total de Classes DEX**: **76.741** classes carregadas pelo JADX.
* **Total de Recursos**: **17.882** recursos empacotados (layouts, drawables, áudios, strings, fontes e modelos vetoriais).
* **Bibliotecas Nativas (ARM64-v8a)**: **22** arquivos `.so` em `lib/arm64-v8a`.

---

## 📋 Permissões Declaradas no AndroidManifest.xml

A inspeção do manifesto revelou a declaração de capacidades para:
* Conexão com a Internet e monitoramento de conectividade de rede.
* Gravação e processamento de áudio (reconhecimento de fala e exercícios de pronúncia).
* Câmera (leitura de fotos de perfil e eventuais recursos de realidade aumentada).
* Notificações push e agendamento de alarmes de alta prioridade (para os lembretes diários da sequência).
* Acesso ao calendário e contatos (integração social para convidar amigos).
* Biometria e armazenamento local.

> [!NOTE] Observação Crítica de Engenharia Reversa
> Declaração no manifesto representa **autorização concedida**, mas não prova execução nem transmissão contínua de dados em tempo real sem análise dinâmica ou tráfego de rede.

---

## 🔗 Notas Relacionadas
* [[Arquitetura Híbrida (Android DEX vs Unity vs Rive)]]
* [[Ciclo de Vida e Performance (DuoApp)]]
* [[Dossiê de Evidências REA e Hashes]]

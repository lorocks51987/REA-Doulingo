---
title: Modelo de Implementação Própria (Clean-Room)
tags:
  - clean-room
  - lingolab
  - ack-admy
  - arquitetura
  - boas-praticas
date: 2026-10-20
---

# 🛡️ Modelo de Implementação Própria (Clean-Room)

Para garantir total conformidade legal, ética e técnica, todo o aprendizado obtido na análise de engenharia reversa do Duolingo é aplicado sob o princípio de **Clean-Room Design** (projeto sala limpa).

Voltar ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 📜 O Princípio Clean-Room

1. **Nenhum byte copiado**: Não se copia código descompilado, recursos gráficos, marcas, sons proprietários ou dados de banco de dados do app analisado.
2. **Extração de especificações funcionais e comportamentais**: A análise extrai apenas **conceitos de arquitetura, fluxos lógicos e padrões de UX/UI**.
3. **Reimplementação independente**: Um novo time ou camada desenvolve o código original a partir das especificações funcionais.

---

## 🏗️ Como o LingoLab e o ACK-ADMY Estruturam a Solução

A implementação limpa desenvolvida no projeto (`lingolab/App.tsx` e módulos TypeScript):

```
src/
├── learning/
│   ├── model.ts      # Modelos de dados próprios (Lição, Pergunta, Sessão)
│   └── catalog.ts    # Conteúdo didático 100% original e autoral
├── privacy/
│   └── telemetry.ts  # Métricas éticas locais com consentimento
└── ui/
    └── components/   # Botões acessíveis, barras de progresso e feedbacks
```

### Principais Diferenciais da Implementação Própria:
* **Transparência de Dados**: O usuário tem controle sobre quais métricas são coletadas.
* **Leveza Extrema**: Em vez de um instalador de 200 MB, a solução Web/PWA carrega em menos de 1 segundo com bundle enxuto.
* **Modularidade**: Facilidade para plugar novos tipos de exercícios (ex: simulador de terminal de comando no ACK-ADMY).

---

## 🔗 Notas Relacionadas
* [[Diretrizes de UX e UI Educacional]]
* [[Dossiê de Evidências REA e Hashes]]
* [[Arquitetura Híbrida (Android DEX vs Unity vs Rive)]]

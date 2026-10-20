---
title: Repetição Espaçada e Modelos de Retenção (HLR & Birdbrain)
tags:
  - hlr
  - birdbrain
  - repeticao-espacada
  - inteligencia-artificial
  - retencao
date: 2026-10-20
---

# 🧠 Repetição Espaçada e Modelos de Retenção: HLR & Birdbrain

O agendamento inteligente de exercícios de revisão do Duolingo é fundamentado em duas iniciativas principais documentadas pela equipe de pesquisa do Duolingo: o algoritmo matemático **HLR (Half-Life Regression)** e o sistema neural **Birdbrain**.

Voltar ao [[05 - Especificação de SDK Independente|Dossiê do SDK]] ou ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 📈 1. O Modelo Matemático HLR (Half-Life Regression)

O trabalho pioneiro de Burr Settles e Brendan Meeder introduziu a modelagem da curva de esquecimento de Ebbinghaus através de regressão de meia-vida.

### As Duas Fórmulas Fundamentais:

1. **Probabilidade de Lembrança ($p$)**:
   $$p = 2^{-\frac{\Delta}{h}}$$
   * $\Delta$: Tempo decorrido desde a última prática daquele item.
   * $h$: A "meia-vida" da memória (quanto tempo leva para a probabilidade de acerto cair para 50%).

2. **Cálculo da Meia-Vida ($h$) baseada em características**:
   $$h = 2^{\theta \cdot x}$$
   * $x$: Vetor de características do aluno (número de vezes que acertou, número de vezes que errou, complexidade do vocabulário).
   * $\theta$: Vetor de pesos aprendidos pelo algoritmo de machine learning.

---

## 🐦 2. O Sistema Birdbrain

Enquanto o HLR modelava primariamente o esquecimento temporal, o **Birdbrain** expandiu a personalização para estimar em tempo real:
* A **proficiência dinâmica do aluno** em uma dada habilidade.
* A **dificuldade intrínseca de cada exercício individual**.

> **Objetivo de Ouro da Pedagogia**: Manter o aluno na "Zona de Desenvolvimento Proximal" (ZDP) de Vygotsky — nem tão fácil que gere tédio, nem tão difícil que gere frustração e abandono. A taxa ideal de acerto alvo calibrada fica em torno de **80% a 85%**.

---

## 💻 3. Interfaces Recomendadas para o SDK Independente

No SDK proposto, a responsabilidade pedagógica é desacoplada em três contratos modulares:

```typescript
export interface RecallScheduler {
  calculateNextReview(itemHistory: ItemAttemptHistory): {
    dueAt: Instant;
    estimatedRetention: number;
  };
}

export interface DifficultyEstimator {
  estimateSuccessProbability(userId: Id, challengeId: Id): number;
}

export interface SessionPlanner {
  selectChallengesForSession(criteria: {
    userId: Id;
    targetSuccessRate: number; // ex: 0.82
    maxDurationMinutes: number;
  }): readonly ChallengeBase[];
}
```

---

## 🔗 Notas Relacionadas
* [[Psicologia do Loop de Engajamento]]
* [[Sistema de Microlições e Trilha de Aprendizado]]
* [[Contratos TypeScript (contracts.ts)]]

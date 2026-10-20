---
title: Contratos TypeScript do SDK Independente
tags:
  - typescript
  - contratos
  - tipos
  - sdk
  - api
date: 2026-10-20
---

# 💻 Contratos TypeScript do SDK Independente (`contracts.ts`)

Esta nota documenta os contratos tipados e interfaces em TypeScript elaborados para o SDK independente de aprendizado.

Voltar ao [[05 - Especificação de SDK Independente|Dossiê do SDK]] ou ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 🧱 1. Tipos Fundamentais e Tratamento de Erros

O SDK adota o padrão funcional `Result<T>` com erros tipados (`SdkError`), garantindo que falhas sejam tratadas explicitamente sem lançamento de exceções ocultas:

```typescript
export type Id = string;
export type Revision = string;
export type Instant = string;   // UTC ISO 8601
export type LocalDate = string; // Civil yyyy-mm-dd

export type ErrorCode =
  | "invalid_input" | "not_found" | "unauthorized" | "forbidden"
  | "conflict" | "resource_exhausted" | "unsupported"
  | "unavailable" | "cancelled";

export interface SdkError {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  operationId?: Id;
  details?: Readonly<Record<string, unknown>>;
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: SdkError };
```

---

## 📚 2. Estrutura Hierárquica do Currículo

O conteúdo segue a hierarquia: `Course → Section → Unit → PathNode`:

```typescript
export interface Course {
  id: Id;
  revision: Revision;
  subject: "language" | "math" | "music" | "chess";
  uiLocale: string;
  learningLocale?: string;
  title: string;
  sections: readonly Section[];
}

export interface Section {
  id: Id;
  title: string;
  units: readonly Unit[];
}

export interface Unit {
  id: Id;
  title: string;
  objectiveIds: readonly Id[];
  nodes: readonly PathNode[];
}

export interface PathNode {
  id: Id;
  kind: "lesson" | "practice" | "story" | "checkpoint";
  prerequisiteNodeIds: readonly Id[];
  lessonBlueprintIds: readonly Id[];
}

export interface Progress {
  userId: Id;
  courseId: Id;
  courseRevision: Revision;
  revision: Revision;
  nodes: readonly {
    nodeId: Id;
    state: "locked" | "available" | "in_progress" | "completed";
    completedAt?: Instant;
  }[];
}
```

---

## 🎯 3. Sessão e Idempotência de Conclusão

```typescript
export interface Session {
  id: Id;
  userId: Id;
  courseId: Id;
  pathNodeId: Id;
  revision: Revision;
  state: "created" | "active" | "finishing" | "completed" | "abandoned" | "expired";
  createdAt: Instant;
  currentChallengeIndex: number;
  totalChallenges: number;
  remainingHearts?: number;
  energySpent?: number;
}

export interface SessionCompletionReceipt {
  sessionId: Id;
  completedAt: Instant;
  xpAwarded: number;
  gemsAwarded: number;
  streakIncremented: boolean;
  streakDays: number;
  receiptSignature: string; // Prova criptográfica durável
}
```

---

## ⚙️ 4. Interface Central do SDK (`IndependentLearningSdk`)

```typescript
export interface IndependentLearningSdk {
  getCourse(courseId: Id, revision?: Revision): Promise<Result<Course>>;
  getProgress(userId: Id, courseId: Id): Promise<Result<Progress>>;
  
  createSession(options: {
    userId: Id;
    courseId: Id;
    pathNodeId: Id;
    idempotencyKey: string;
  }): Promise<Result<Session>>;
  
  getChallenge(sessionId: Id, cursor: number): Promise<Result<ChallengeBase>>;
  
  submitAttempt(attempt: ChallengeAttempt): Promise<Result<AttemptResult>>;
  
  finishSession(sessionId: Id, idempotencyKey: string): Promise<Result<SessionCompletionReceipt>>;
  
  abandonSession(sessionId: Id): Promise<Result<{ status: "abandoned" }>>;
}
```

---

## 🔗 Notas Relacionadas
* [[Ciclo de Vida da Sessão e Máquina de Estados]]
* [[Tipos de Exercícios e Políticas de Correção]]
* [[Economia, Vidas vs Energia e Ledger de XP]]

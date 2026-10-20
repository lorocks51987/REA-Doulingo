---
title: Economia, Vidas vs Energia e Ledger de XP
tags:
  - economia
  - xp
  - ledger
  - vidas
  - energia
  - seguranca
date: 2026-10-20
---

# 💎 Economia, Vidas vs Energia e Ledger de XP

A integridade do sistema de gamificação depende de um modelo contábil seguro contra fraudes, adulterações de saldo e duplicidades de rede.

Voltar ao [[05 - Especificação de SDK Independente|Dossiê do SDK]] ou ao [[00 - MOC (Índice Geral do Cofre)|MOC]].

---

## 📒 1. Ledger Append-Only (Livro-Razão Imutável)

Em vez de armazenar o saldo do usuário como um número solto no banco (`user.xp = 1250`), o SDK adota o padrão de **Ledger Imutável (Append-Only)**:

```
[ID 101] +15 XP | Sessão sess_abc concluída | 2026-10-20T10:00:00Z
[ID 102] +5 XP  | Bônus de Combo perfeito   | 2026-10-20T10:00:00Z
[ID 103] -50 💎 | Compra de Freeze de Streak | 2026-10-20T10:05:00Z
```

### Vantagens do Ledger:
1. **Auditoria Total**: Qualquer alteração de saldo possui um motivo registrado (`reason`), identificador de operação de origem (`sourceOperationId`) e instante UTC.
2. **Idempotência**: Se uma requisição de conclusão for enviada 3 vezes pelo app devido a instabilidade de 4G, o servidor verifica que a transação para aquele `sourceOperationId` já foi processada e retorna o mesmo saldo sem duplicar o ganho.
3. **Resolução de Conflitos**: Permite conciliação determinística entre o cliente offline e a nuvem.

---

## ❤️ 2. Vidas (*Hearts*) vs ⚡ Energia (*Energy*)

A evolução recente do Duolingo introduziu a mecânica de **Energia** como alternativa ao modelo punitivo tradicional de **Vidas**:

| Aspecto | Modelo Tradicional (Vidas / *Hearts*) | Modelo Moderno (Energia / *Energy*) |
| :--- | :--- | :--- |
| **Gatilho de Consumo** | Desconta 1 vida exclusivamente quando o aluno **erra** uma questão. | Consome uma quantidade fixa de energia para **iniciar ou manter** a sessão. |
| **Efeito Psicológico** | Ansiedade diante do erro; medo de arriscar respostas difíceis. | Foco na dedicação de tempo diário; o erro passa a ser visto como parte natural do aprendizado. |
| **Recarga** | Praticar lições antigas ou esperar horas. | Regeneração contínua por tempo ou conclusão bem-sucedida de tarefas. |

### Representação Tipada no SDK:

```typescript
export type AccessResource =
  | { kind: "none" }
  | { kind: "hearts"; current: number; max: number; regeneratesAt?: Instant }
  | { kind: "energy"; current: number; max: number; burnRatePerMinute: number };
```

---

## 🔗 Notas Relacionadas
* [[Sequência (Streak), Vidas e Ligas]]
* [[Contratos TypeScript (contracts.ts)]]
* [[Ciclo de Vida da Sessão e Máquina de Estados]]

/**
 * Independent, in-memory reference rules. NOT Duolingo code or compatibility.
 * Numeric policy, XP arithmetic and tie handling below are original choices.
 * Caller supplies authoritative grades/results; this module grants no remote rights.
 */
const ok = value => ({ ok: true, value });
const err = (code, message) => ({ ok: false, error: { code, message } });
const integer = n => Number.isSafeInteger(n) && n >= 0;
const id = value => typeof value === 'string' && value.length > 0;
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validSession = s => record(s) && id(s.id) && id(s.policyRevision) &&
  [s.revision, s.currentRun, s.bestRun, s.correct, s.wrong].every(integer) &&
  s.currentRun <= s.bestRun && record(s.attempts) && s.state === 'active';
const validQuest = q => record(q) && id(q.id) && id(q.metric) &&
  integer(q.progress) && integer(q.target) && q.target > 0 && q.progress <= q.target &&
  record(q.receipts) && typeof q.claimed === 'boolean';

export function newSession(idValue, policyRevision) {
  if (!id(idValue) || !id(policyRevision)) return err('invalid_input', 'Session and policy IDs required');
  return ok({ id: idValue, policyRevision, revision: 0, currentRun: 0, bestRun: 0,
    correct: 0, wrong: 0, attempts: {}, state: 'active' });
}

/** A repeated immutable attempt is a no-op; changed content under its ID conflicts. */
export function recordAttempt(session, attempt) {
  if (!validSession(session) || !attempt || !id(attempt.id) ||
      !['correct', 'wrong', 'ungraded'].includes(attempt.grade) || !integer(attempt.expectedRevision))
    return err('invalid_input', 'Active session, valid attempt and expected revision required');
  const key = JSON.stringify([attempt.id]);
  if (Object.hasOwn(session.attempts, key)) {
    if (session.attempts[key] !== attempt.grade) return err('conflict', 'Attempt identity reused with another grade');
    return ok({ session, duplicate: true, effects: [] });
  }
  if (attempt.expectedRevision !== session.revision) return err('conflict', 'Session revision changed');
  if (session.revision === Number.MAX_SAFE_INTEGER ||
      (attempt.grade === 'correct' && [session.correct, session.currentRun].includes(Number.MAX_SAFE_INTEGER)) ||
      (attempt.grade === 'wrong' && session.wrong === Number.MAX_SAFE_INTEGER))
    return err('capacity', 'Session counters exceed safe integer range');
  const next = structuredClone(session);
  next.attempts[key] = attempt.grade;
  next.revision++;
  const effects = [];
  if (attempt.grade === 'correct') {
    next.correct++;
    next.currentRun++;
    next.bestRun = Math.max(next.bestRun, next.currentRun);
    effects.push({ kind: 'correct_run', count: next.currentRun });
  } else if (attempt.grade === 'wrong') {
    next.wrong++;
    effects.push({ kind: 'run_ended', previousCount: next.currentRun });
    next.currentRun = 0;
  }
  return ok({ session: next, duplicate: false, effects });
}

/** Original settlement policy: floor((base + correct*perCorrect + bonuses)*highest boost). */
export function previewXp(session, policy, boosts, atMs) {
  if (!validSession(session) ||
      !policy || policy.revision !== session.policyRevision ||
      ![policy.baseXp, policy.perCorrectXp, policy.perfectBonusXp].every(integer) ||
      !Array.isArray(policy.comboMilestones) || !Array.isArray(boosts) || !integer(atMs))
    return err('invalid_input', 'Valid session and matching policy required');
  if (policy.comboMilestones.some(m => !m || !integer(m.run) || m.run === 0 || !integer(m.bonusXp)))
    return err('invalid_input', 'Invalid milestone');
  if (boosts.some(b => !b || !id(b.id) || !integer(b.fromMs) || !integer(b.untilMs) ||
      b.untilMs <= b.fromMs || !integer(b.numerator) || !integer(b.denominator) ||
      b.denominator === 0 || b.numerator < b.denominator) ||
      new Set(boosts.map(b => b.id)).size !== boosts.length)
    return err('invalid_input', 'Invalid boost');
  const candidates = boosts.filter(b => b.fromMs <= atMs && atMs < b.untilMs);
  // Rational comparison and arithmetic avoid floating-point rounding at settlement.
  let chosen = { id: null, numerator: 1, denominator: 1 };
  for (const b of candidates) {
    const left = BigInt(b.numerator) * BigInt(chosen.denominator);
    const right = BigInt(chosen.numerator) * BigInt(b.denominator);
    if (left > right || (left === right && (chosen.id === null || b.id < chosen.id))) chosen = b;
  }
  const comboBonus = policy.comboMilestones.filter(m => session.bestRun >= m.run)
    .reduce((max, m) => Math.max(max, m.bonusXp), 0);
  const perfectBonus = session.correct > 0 && session.wrong === 0 ? policy.perfectBonusXp : 0;
  const raw = BigInt(policy.baseXp) + BigInt(session.correct) * BigInt(policy.perCorrectXp) +
    BigInt(comboBonus) + BigInt(perfectBonus);
  const xp = raw * BigInt(chosen.numerator) / BigInt(chosen.denominator);
  if (xp > BigInt(Number.MAX_SAFE_INTEGER)) return err('capacity', 'XP exceeds safe integer range');
  return ok({ status: 'preview', xp: Number(xp), base: policy.baseXp,
    perCorrectTotal: session.correct * policy.perCorrectXp, comboBonus, perfectBonus,
    boostId: chosen.id, policyRevision: policy.revision });
}

/** Quest consumes confirmed, immutable receipts; caller persists returned state atomically. */
export function advanceQuest(quest, receipt) {
  if (!validQuest(quest) || !receipt || !id(receipt.id) ||
      !id(receipt.metric) || !integer(receipt.amount) || receipt.status !== 'confirmed')
    return err('invalid_input', 'Quest and confirmed receipt required');
  const key = JSON.stringify([receipt.id]);
  const fingerprint = JSON.stringify([receipt.metric, receipt.amount]);
  if (Object.hasOwn(quest.receipts, key)) {
    if (quest.receipts[key] !== fingerprint) return err('conflict', 'Receipt identity reused');
    return ok({ quest, duplicate: true });
  }
  if (receipt.metric !== quest.metric) return ok({ quest, ignored: true });
  const next = structuredClone(quest);
  next.receipts[key] = fingerprint;
  next.progress = Math.min(next.target, next.progress + receipt.amount);
  next.completed = next.progress >= next.target;
  return ok({ quest: next, duplicate: false });
}

/** This only records a claim intent locally; it never grants money or remote balances. */
export function claimQuest(quest) {
  if (!validQuest(quest))
    return err('invalid_input', 'Valid quest required');
  if (quest.progress < quest.target) return err('ineligible', 'Quest is not complete');
  if (quest.claimed) return ok({ quest, duplicate: true, effects: [] });
  return ok({ quest: { ...quest, claimed: true }, duplicate: false,
    effects: [{ kind: 'quest_claim_intent', questId: quest.id }] });
}

/** Original deterministic tie break: score descending, tieKey ascending, then ID. */
export function rankCohort(entries, rules) {
  if (!Array.isArray(entries) || !rules || !integer(rules.promote) || !integer(rules.demote) ||
      rules.promote + rules.demote > entries.length ||
      entries.some(e => !e || !id(e.id) || !id(e.tieKey) || !integer(e.xp)) ||
      new Set(entries.map(e => e.id)).size !== entries.length)
    return err('invalid_input', 'Valid entries, unique IDs and nonoverlapping zones required');
  const compareText = (a, b) => a < b ? -1 : a > b ? 1 : 0;
  const ordered = [...entries].sort((a, b) => b.xp - a.xp ||
    compareText(a.tieKey, b.tieKey) || compareText(a.id, b.id));
  return ok(ordered.map((entry, i) => ({ ...entry, rank: i + 1,
    zone: i < rules.promote ? 'promotion' :
      i >= ordered.length - rules.demote ? 'relegation' : 'stay',
    status: 'snapshot' })));
}

/** Original simulator: caller supplies U in [0,1); zero-weight prizes never win. */
export function drawReward(distribution, unitSample) {
  if (!Array.isArray(distribution) || distribution.length === 0 ||
      typeof unitSample !== 'number' || !Number.isFinite(unitSample) || unitSample < 0 || unitSample >= 1 ||
      distribution.some(d => !d || !integer(d.amount) || typeof d.weight !== 'number' ||
        !Number.isFinite(d.weight) || d.weight < 0))
    return err('invalid_input', 'Nonnegative weighted amounts and a sample in [0,1) required');
  const totalWeight = distribution.reduce((s, d) => s + d.weight, 0);
  if (!Number.isFinite(totalWeight) || totalWeight <= 0)
    return err('invalid_input', 'Positive finite total weight required');
  const target = unitSample * totalWeight;
  let cumulative = 0;
  let selectedAmount = null;
  let lastPositive = null;
  let expectedAmount = 0;
  for (const d of distribution) {
    expectedAmount += d.amount * (d.weight / totalWeight);
    if (d.weight === 0) continue;
    lastPositive = d.amount;
    cumulative += d.weight;
    if (selectedAmount === null && target < cumulative) selectedAmount = d.amount;
  }
  return ok({ selectedAmount: selectedAmount ?? lastPositive, expectedAmount, totalWeight });
}

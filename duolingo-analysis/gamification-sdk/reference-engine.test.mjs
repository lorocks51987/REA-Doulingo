import test from 'node:test';
import assert from 'node:assert/strict';
import { newSession, recordAttempt, previewXp, advanceQuest, claimQuest, rankCohort, drawReward } from './reference-engine.mjs';
const value = r => { assert.equal(r.ok, true, JSON.stringify(r)); return r.value; };
const policy = { revision: 'original-demo-v1', baseXp: 9, perCorrectXp: 2,
  perfectBonusXp: 3, comboMilestones: [{ run: 4, bonusXp: 2 }, { run: 8, bonusXp: 5 }] };

test('ungraded preserves run; incorrect resets current but retains best', () => {
  let s = value(newSession('s', policy.revision));
  for (const grade of ['correct', 'correct', 'ungraded', 'wrong', 'correct'])
    s = value(recordAttempt(s, { id: String(s.revision), grade, expectedRevision: s.revision })).session;
  assert.equal(s.currentRun, 1); assert.equal(s.bestRun, 2);
  assert.equal(s.correct, 3); assert.equal(s.wrong, 1);
});

test('attempt retry is idempotent; conflicting identity/revision rejected; input immutable', () => {
  const s = value(newSession('s', policy.revision));
  const event = { id: '__proto__', grade: 'correct', expectedRevision: 0 };
  const next = value(recordAttempt(s, event)).session;
  assert.equal(s.correct, 0);
  assert.equal(value(recordAttempt(next, event)).duplicate, true);
  assert.equal(recordAttempt(next, { ...event, grade: 'wrong' }).error.code, 'conflict');
  assert.equal(recordAttempt(next, { ...event, id: 'new' }).error.code, 'conflict');
  assert.equal({}.polluted, undefined);
});

test('XP chooses highest active boost without stacking; expiry is exclusive', () => {
  const s = { ...value(newSession('s', policy.revision)), correct: 4, bestRun: 4 };
  const boosts = [{ id: 'a', numerator: 5, denominator: 4, fromMs: 0, untilMs: 100 },
    { id: 'b', numerator: 2, denominator: 1, fromMs: 0, untilMs: 50 }];
  assert.equal(value(previewXp(s, policy, boosts, 49)).xp, 44);
  assert.equal(value(previewXp(s, policy, boosts, 50)).xp, 27);
  assert.equal(value(previewXp(s, policy, boosts, 100)).xp, 22);
  assert.equal(previewXp(s, { ...policy, revision: 'other' }, boosts, 50).ok, false);
});

test('XP handles large intermediate integers and rejects overflow/invalid boost', () => {
  const s = { ...value(newSession('s', policy.revision)), correct: Number.MAX_SAFE_INTEGER, wrong: 1 };
  assert.equal(previewXp(s, policy, [], 0).error.code, 'capacity');
  assert.equal(previewXp(s, policy, [{ id: 'x', numerator: 2, denominator: 0,
    fromMs: 0, untilMs: 10 }], 0).ok, false);
});

test('quest ignores unrelated metrics, deduplicates receipts, rejects changed receipt and claims once', () => {
  const q = { id: 'q', metric: 'sessions', progress: 0, target: 2, receipts: {}, claimed: false };
  const receipt = { id: 'r', metric: 'sessions', amount: 2, status: 'confirmed' };
  assert.equal(value(advanceQuest(q, { ...receipt, metric: 'xp' })).ignored, true);
  assert.equal(advanceQuest(q, { ...receipt, status: 'pending' }).ok, false);
  const next = value(advanceQuest(q, receipt)).quest;
  assert.equal(value(advanceQuest(next, receipt)).duplicate, true);
  assert.equal(advanceQuest(next, { ...receipt, amount: 3 }).error.code, 'conflict');
  assert.equal(claimQuest(q).error.code, 'ineligible');
  const claimed = value(claimQuest(next)).quest;
  assert.equal(value(claimQuest(claimed)).effects.length, 0);
});

test('cohort tie breaks are deterministic; zones do not overlap; source array unchanged', () => {
  const entries = [{ id: 'c', tieKey: '2', xp: 5 }, { id: 'b', tieKey: '1', xp: 8 },
    { id: 'a', tieKey: '1', xp: 8 }];
  const r = value(rankCohort(entries, { promote: 1, demote: 1 }));
  assert.deepEqual(r.map(x => x.id), ['a', 'b', 'c']);
  assert.deepEqual(r.map(x => x.zone), ['promotion', 'stay', 'relegation']);
  assert.equal(entries[0].id, 'c');
  assert.equal(rankCohort(entries, { promote: 2, demote: 2 }).ok, false);
  assert.equal(rankCohort([entries[0], entries[0]], { promote: 0, demote: 0 }).ok, false);
});

test('malformed restored state returns tagged errors instead of throwing', () => {
  assert.equal(recordAttempt({ state: 'active' }, { id: 'a', grade: 'correct', expectedRevision: 0 }).ok, false);
  assert.equal(previewXp({}, policy, [], 0).ok, false);
  assert.equal(advanceQuest({ metric: 'sessions' }, {}).ok, false);
  assert.equal(claimQuest(null).ok, false);
});

test('weighted draw normalizes expected value and never selects zero-weight outcome', () => {
  const d = [{ amount: 99, weight: 0 }, { amount: 1, weight: 2 }, { amount: 4, weight: 6 }];
  assert.equal(value(drawReward(d, 0)).selectedAmount, 1);
  assert.equal(value(drawReward(d, 0.25)).selectedAmount, 4);
  assert.equal(value(drawReward(d, 0.99)).expectedAmount, 3.25);
  assert.equal(value(drawReward([{ amount: 7, weight: 1 }], 0.9)).selectedAmount, 7);
});

test('weighted draw rejects invalid samples and unbounded/empty weights', () => {
  assert.equal(drawReward([], 0).ok, false);
  assert.equal(drawReward([{ amount: 1, weight: 0 }], 0).ok, false);
  assert.equal(drawReward([{ amount: 1, weight: -1 }], 0).ok, false);
  assert.equal(drawReward([{ amount: 1, weight: Infinity }], 0).ok, false);
  assert.equal(drawReward([{ amount: 1, weight: 1 }], 1).ok, false);
});

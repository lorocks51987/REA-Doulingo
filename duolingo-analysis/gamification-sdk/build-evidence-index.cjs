// Local documentary validation; reads records, never runs APK or calls network.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = __dirname;
const expected = '19ae27b023cb2e323a7f5a497b55af966d7118195d3688764913de709a77539f';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const records = [], failures = [], cleanup = [];
const operations = {};
for (const name of fs.readdirSync(path.join(root, 'evidence')).sort()) {
  if (!name.endsWith('.json') || name.endsWith('.run.json')) continue;
  const bytes = fs.readFileSync(path.join(root, 'evidence', name));
  const r = JSON.parse(bytes.toString('utf8'));
  const source = 'evidence/' + name;
  if (name.endsWith('.cleanup.json')) {
    assert.equal(r.providerClose, 'completed', source);
    cleanup.push({ path: source, ...r }); continue;
  }
  if (!r.evidence_id) {
    failures.push({ path: source, sha256: digest(bytes), code: r.code,
      category: r.category, message: r.message }); continue;
  }
  assert.equal(r.subject.digest.sha256, expected, source);
  assert.ok(r.normalized_result, source);
  const n = r.normalized_result;
  const text = n.source?.text ?? '';
  operations[r.operation] = (operations[r.operation] ?? 0) + 1;
  records.push({ path: source, sha256: digest(bytes), evidenceId: r.evidence_id,
    operation: r.operation, artifactSha256: r.subject.digest.sha256,
    parameters: r.parameters, className: n.class_name,
    method: n.method, representation: n.representation,
    sourceStatus: n.source?.status, bodyStatus: n.body_status,
    fellBack: n.fell_back, markers: n.markers,
    decompilerWarningInText: /JADX WARN|Method not decompiled/.test(text),
    methodsCount: n.methods?.length, fieldsCount: n.fields?.length,
    limitations: r.limitations });
}
assert.equal(new Set(records.map(r => r.evidenceId)).size, records.length);
assert.ok(records.some(r => r.method?.name === 'b' && r.className === 'defpackage.cid'));
assert.ok(records.some(r => r.className === 'com.duolingo.core.challenges.ChallengeSurrogate'));
const urls = new Set();
const missing = [];
let checkedLinks = 0;
const documents = [];
for (const name of fs.readdirSync(root).filter(n => n.endsWith('.md')).sort()) {
  const bytes = fs.readFileSync(path.join(root, name));
  documents.push({ path: name, bytes: bytes.length, sha256: digest(bytes) });
  for (const match of bytes.toString('utf8').matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = match[1];
    if (/^https?:\/\//.test(target)) { urls.add(target); continue; }
    if (target === 'evidence-index.json') continue;
    if (!fs.existsSync(path.resolve(root, target.split('#')[0]))) missing.push({ name, target });
    checkedLinks++;
  }
}
assert.deepEqual(missing, []);
const testOutput = fs.readFileSync(path.join(root, 'validation-tests.tap'), 'utf8');
assert.match(testOutput, /# tests 9\b/);
assert.match(testOutput, /# pass 9\b/);
assert.match(testOutput, /# fail 0\b/);
const implemented = ['reference-engine.mjs', 'reference-engine.test.mjs'].map(name => {
  const bytes = fs.readFileSync(path.join(root, name));
  return { path: name, bytes: bytes.length, sha256: digest(bytes) };
});
const summary = { successfulEvidenceRecords: records.length, failuresPreserved: failures.length,
  operations, providerCloseRecords: cleanup.length, referencedWebUrls: urls.size,
  localLinksChecked: checkedLinks, missingLocalLinks: missing.length,
  referenceTests: { tests: 9, passed: 9, failed: 0 }, runtime: process.version };
fs.writeFileSync(path.join(root, 'evidence-index.json'), JSON.stringify({
  format: 'independent-gamification-research-index', version: 1,
  date: '2026-10-20', artifactSha256: expected,
  notes: ['Static observations do not establish runtime behavior.',
    'No official authenticity verification or backend access.',
    'Generated source marked complete may still contain decompiler control-flow errors.',
    'Successful records are REA 6.4.0 shared workflow Evidence with JADX 0.7.1.',
    'Reference implementation policies are original; tests do not prove Duolingo parity.'],
  validation: summary, documents, implemented,
  webReferences: [...urls].sort().map(url => ({ url, researchDate: '2026-10-20',
    revision: 'mutable URL; no full-page snapshot retained' })),
  records, failures, cleanup
}, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));

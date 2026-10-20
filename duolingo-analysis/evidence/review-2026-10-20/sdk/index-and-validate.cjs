// Gera índices documentais e verifica consistência local. Não acessa a rede.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { stripTypeScriptTypes } = require('node:module');
const vm = require('node:vm');
const root = __dirname;
const read = p => {
  const b = fs.readFileSync(p);
  return (b[0] === 0xff && b[1] === 0xfe ? b.toString('utf16le') : b.toString('utf8')).replace(/^\uFEFF/, '');
};
const json = p => JSON.parse(read(p));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const write = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n');
const catalog = json(path.join(root, 'sdk-apk-catalog.json'));
const classes = catalog.class_inventory.subsystems.flatMap(s => {
  assert.equal(s.count, s.class_names.length);
  return s.class_names;
});
assert.equal(classes.length, 9021);
assert.equal(new Set(classes).size, classes.length);
assert.equal(catalog.zip.assets.length, catalog.zip.assets_count);
assert.equal(catalog.zip.native_libraries.length, 81);
assert.equal(catalog.manifest.components.length, 477);
assert.equal(catalog.manifest.permissions.length, 40);
for (const source of catalog.provenance) {
  assert.equal(hash(path.resolve(root, source.path)), source.sha256_file, source.path);
}
const sourceClasses = json(path.resolve(root, '../../audit-2026-10-19/classes-duolingo.json'));
assert.deepEqual([...classes].sort(), [...sourceClasses.normalized_result.matches].sort());
const smali = json(path.resolve(root, '../../audit-2026-10-19/smali-index.json'));
write('network-origins.json', {
  authority: 'Prior literal static text indexing; not network traffic or live endpoint validation',
  source: '../../audit-2026-10-19/smali-index.json',
  sourceSha256: hash(path.resolve(root, '../../audit-2026-10-19/smali-index.json')),
  artifactSha256: catalog.artifact.sha256,
  provenance: 'Pre-existing decoded smali; extraction-to-APK binding was not independently regenerated',
  origins: smali.endpoints,
  limitations: ['Origins can be SDK or inactive code.', 'No URLs were requested.',
    'The stored files count is the producer counter, not a newly deduplicated file count.']
});
const docPaths = [
  'SDK-DUOLINGO-ESPECIFICACAO.md', 'APK-CATALOGO.md',
  '../PESQUISA-PRODUTO.md', '../REPOSITORIOS.md'
];
const urls = new Set();
let localLinks = 0;
for (const name of docPaths) {
  const p = path.resolve(root, name);
  for (const m of read(p).matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = m[1];
    if (/^https?:\/\//.test(target)) { urls.add(target); continue; }
    if (target === 'VALIDACAO.md' || target === 'document-index.json') continue;
    assert.ok(fs.existsSync(path.resolve(path.dirname(p), target.split('#')[0])), `${name}: ${target}`);
    localLinks++;
  }
}
const evidence = ['../lesson-progress-class.json', '../challenge-guess-class.json'].map(name => {
  const p = path.resolve(root, name);
  const r = json(p);
  assert.equal(r.subject.digest.sha256, catalog.artifact.sha256);
  assert.equal(r.operation, 'inspect_android_class');
  assert.ok(r.normalized_result.class_name);
  return { path: name, fileSha256: hash(p), evidenceId: r.evidence_id,
    operation: r.operation, artifactSha256: r.subject.digest.sha256,
    className: r.normalized_result.class_name,
    methods: r.normalized_result.methods.length, fields: r.normalized_result.fields.length,
    innerClasses: r.normalized_result.inner_classes };
});
const contractPath = path.join(root, 'contracts.ts');
const stripped = stripTypeScriptTypes(read(contractPath));
// Arquivo só de tipos: depois da remoção, export vazio é declaração de módulo.
new vm.Script(stripped.replace(/\bexport\s*\{\s*\}\s*;?/g, ''));
const summary = {
  classes: classes.length, uniqueClasses: new Set(classes).size,
  namespaces: catalog.class_inventory.subsystems.length,
  assets: catalog.zip.assets.length, nativeLibraries: catalog.zip.native_libraries.length,
  permissions: catalog.manifest.permissions.length, components: catalog.manifest.components.length,
  referencedWebUrls: urls.size, checkedLocalLinks: localLinks,
  newEvidenceRecords: evidence.length, typescriptSyntax: 'passed via Node stripTypeScriptTypes; not semantic typechecking',
  runtime: process.version
};
write('document-index.json', {
  version: 1, researchDate: '2026-10-20',
  scope: 'Research dossier and proposed independent SDK; no production integration',
  documents: [...docPaths, 'contracts.ts', 'sdk-apk-catalog.json', 'network-origins.json'].map(name => ({
    path: name, sha256: hash(path.resolve(root, name)), bytes: fs.statSync(path.resolve(root, name)).size
  })),
  referencedWebUrls: [...urls].sort().map(url => ({ url, accessedDate: '2026-10-20',
    revisionPolicy: 'URL may be mutable; no full source snapshot retained' })),
  evidence, validation: summary
});
console.log(JSON.stringify(summary, null, 2));

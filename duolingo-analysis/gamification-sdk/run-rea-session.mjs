// Uses the installed REA shared CLI/MCP application workflow and Evidence builder.
// One provider owns its JADX session; close() joins worker/workspace cleanup.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root = 'C:/dev/REA';
const installed = path.join(root, '.npm-cache/_npx/dea9475797100b20/node_modules/rea-agents/dist');
const { createAndroidAnalysisProvider } = await import(pathToFileURL(path.join(installed, 'composition/android.js')));
const { AndroidAnalysisService } = await import(pathToFileURL(path.join(installed, 'application/android/AndroidAnalysisService.js')));
const { projectAnalysisError } = await import(pathToFileURL(path.join(installed, 'domain/analysisErrorProjection.js')));
const folder = path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1');
const out = path.join(folder, 'evidence');
const apk = path.join(root, 'duolingo-analysis/binaries/Duolingo v6.101.2 (Premium).apk');
const env = { ...process.env, JAVA_HOME: path.join(root, 'tools/jdk-21.0.12.1+1'),
  REA_JADX_MCP_JAR: path.join(root, 'tools/android/jadx-headless-mcp-0.7.1-all.jar'),
  TEMP: path.join(root, '.rea-temp'), TMP: path.join(root, '.rea-temp') };
fs.mkdirSync(out, { recursive: true });
const provider = createAndroidAnalysisProvider(env);
const service = new AndroidAnalysisService(provider);
const controller = new AbortController();
process.on('SIGINT', () => controller.abort());
const records = new Map();
const plan = JSON.parse(fs.readFileSync(process.argv[2], 'utf8').replace(/^\uFEFF/, ''));
try {
  for (const job of plan) {
    let destination = path.join(out, job.name + '.json');
    if (fs.existsSync(destination)) {
      const previous = JSON.parse(fs.readFileSync(destination, 'utf8'));
      if (previous.evidence_id) {
        records.set(job.name, previous);
        console.log(JSON.stringify({ name: job.name, reused: true }));
        continue;
      }
      let retry = 1;
      while (fs.existsSync(path.join(out, job.name + '.retry' + retry + '.json'))) retry++;
      destination = path.join(out, job.name + '.retry' + retry + '.json');
    }
    let input = { path: apk, ...job.input };
    if (job.classFromSearch) {
      const source = records.get(job.classFromSearch.record)?.normalized_result?.matches ?? [];
      const names = source.filter(n => n === job.classFromSearch.exact || n.endsWith('.' + job.classFromSearch.exact));
      if (names.length !== 1) throw new Error('Ambiguous search for ' + job.name + ': ' + JSON.stringify(names));
      input.class_name = names[0];
    }
    if (job.methodFromClass) {
      const source = records.get(job.methodFromClass.record)?.normalized_result;
      const methods = source?.methods.filter(m => m.name === job.methodFromClass.name &&
        (job.methodFromClass.signature === undefined || m.reported_signature === job.methodFromClass.signature)) ?? [];
      if (methods.length !== 1) throw new Error('Ambiguous method for ' + job.name);
      input.class_name = source.class_name;
      input.method_name = methods[0].name;
      input.overload_index = methods[0].overload_index;
    }
    const started = Date.now();
    const startedAt = new Date().toISOString();
    const result = await service.execute(job.operation, input, { signal: controller.signal });
    const record = result.ok ? result.value : projectAnalysisError(result.error);
    fs.writeFileSync(destination, JSON.stringify(record));
    records.set(job.name, record);
    const n = record.normalized_result;
    const summary = { name: job.name, ok: result.ok, operation: job.operation,
      evidenceId: record.evidence_id, startedAt, elapsedMs: Date.now() - started,
      className: n?.class_name, methods: n?.methods, fields: n?.fields,
      method: n?.method, representation: n?.representation, bodyStatus: n?.body_status,
      matches: n?.matches, error: result.ok ? undefined : record };
    fs.writeFileSync(path.join(out, job.name + '.run.json'), JSON.stringify(summary, null, 2));
    console.log(JSON.stringify(summary));
    if (!result.ok && ['provider_cleanup_failed', 'cancelled'].includes(record.code)) break;
  }
} finally {
  await provider.close();
  fs.writeFileSync(path.join(out, path.basename(process.argv[2]) + '.cleanup.json'),
    JSON.stringify({ providerClose: 'completed', at: new Date().toISOString() }));
}

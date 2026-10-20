// Local investigation runner. Executes cached REA serially; no target execution.
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const root = 'C:/dev/REA';
const apk = path.join(root, 'duolingo-analysis/binaries/Duolingo v6.101.2 (Premium).apk');
const cli = path.join(root, '.npm-cache/_npx/dea9475797100b20/node_modules/rea-agents/scripts/rea.mjs');
const out = path.join(__dirname, 'evidence');
fs.mkdirSync(out, { recursive: true });
const env = { ...process.env,
  JAVA_HOME: path.join(root, 'tools/jdk-21.0.12.1+1'),
  REA_JADX_MCP_JAR: path.join(root, 'tools/android/jadx-headless-mcp-0.7.1-all.jar'),
  TEMP: path.join(root, '.rea-temp'), TMP: path.join(root, '.rea-temp') };
const plan = JSON.parse(fs.readFileSync(process.argv[2], 'utf8').replace(/^\uFEFF/, ''));
async function run(job) {
  const outputPath = path.join(out, job.name + '.json');
  if (fs.existsSync(outputPath)) throw new Error('Refusing to overwrite ' + outputPath);
  const args = [cli, job.operation, apk, ...job.selectors, '--format', 'json'];
  const stdout = fs.openSync(outputPath, 'wx');
  const stderr = fs.openSync(path.join(out, job.name + '.stderr.txt'), 'wx');
  const start = Date.now();
  const startedAt = new Date().toISOString();
  const result = await new Promise(resolve => {
    const child = spawn(process.execPath, args, { env, windowsHide: true,
      stdio: ['ignore', stdout, stderr] });
    child.on('error', e => resolve({ error: e.message, exitCode: null }));
    child.on('exit', (code, signal) => resolve({ exitCode: code, signal }));
  });
  fs.closeSync(stdout); fs.closeSync(stderr);
  let summary = null;
  try {
    const record = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    summary = { evidenceId: record.evidence_id, operation: record.operation,
      className: record.normalized_result?.class_name,
      methods: record.normalized_result?.methods,
      fields: record.normalized_result?.fields,
      method: record.normalized_result?.method,
      representation: record.normalized_result?.representation,
      bodyStatus: record.normalized_result?.body_status };
  } catch (e) { summary = { parseError: e.message }; }
  const audit = { name: job.name, operation: job.operation, selectors: job.selectors,
    startedAt, elapsedMs: Date.now() - start, ...result, summary };
  fs.writeFileSync(path.join(out, job.name + '.run.json'), JSON.stringify(audit, null, 2));
  console.log(JSON.stringify(audit));
}
(async () => { for (const job of plan) await run(job); })().catch(e => {
  console.error(e); process.exitCode = 1;
});

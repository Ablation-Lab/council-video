// Generates narration takes with the ElevenLabs text-to-speech API, in place of
// pasting lines into the website by hand.
//
// It reads the narration from each section's script (`SECTION.script` in the files
// listed under "sections" in tts.config.json), joins the beats that share a recording
// line (beats marked `skip: true` are cut sentences and are never sent), and writes
// each take to <line>.mp3 in the project root, where hand-made takes go. From there
// scripts/part-voiceover.mjs normalises it and times its words as usual.
//
//   node scripts/tts.mjs                  dry run (the default): lists every line, what
//                                         would happen to it, and the characters and
//                                         credits a real run would spend. Spends nothing.
//   node scripts/tts.mjs --generate       generates what the dry run lists
//   --regenerate p1-04-code,p1-02-hook    also replace these recorded takes (never otherwise)
//   --voice <voice id>                    use this voice instead of tts.config.json's
//
// Recorded takes (a <line>.mp3 this script didn't write) are never replaced unless
// named in --regenerate. Every generation is cached in .tts-cache/ (git-ignored) by a
// hash of its text, voice, model, settings and output format, so an unchanged line
// is never paid for twice; going back to an earlier wording reuses its cached take.
// A run refuses to start if it would spend more than maxCreditsPerRun.
//
// The API key is read only from the ELEVENLABS_API_KEY environment variable. It is
// never printed, logged or written anywhere; error messages are scrubbed of it.
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import * as esbuild from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = path.join(ROOT, '.tts-cache');
const MANIFEST = path.join(CACHE, 'manifest.json');
const API = 'https://api.elevenlabs.io';

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const generate = flag('--generate');
const regenerate = new Set((option('--regenerate') ?? '').split(',').filter(Boolean));

const config = JSON.parse(fs.readFileSync(path.join(ROOT, 'tts.config.json'), 'utf8'));
const voiceId = option('--voice') ?? config.voiceId;
const elevenKey = process.env.ELEVENLABS_API_KEY ?? '';
const scrub = (text) => (elevenKey ? String(text).split(elevenKey).join('[key]') : String(text));

/* ---------- The narration, from each section's script ---------- */

const loadSection = async (file) => {
  fs.mkdirSync(CACHE, {recursive: true});
  const out = path.join(CACHE, `section-${path.basename(file, path.extname(file))}.cjs`);
  await esbuild.build({
    entryPoints: [path.join(ROOT, file)],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: out,
    loader: {'.json': 'json'},
    logLevel: 'error',
  });
  const mod = createRequire(import.meta.url)(out);
  fs.rmSync(out);
  const section = mod.SECTION;
  if (!section?.script) throw new Error(`${file} has no exported SECTION with a script`);
  return section.script;
};

const lines = new Map(); // line id -> {text parts, cut sentences}
for (const file of config.sections) {
  for (const beat of await loadSection(file)) {
    if (!beat.line) continue;
    if (!lines.has(beat.line)) lines.set(beat.line, {spoken: [], cut: []});
    lines.get(beat.line)[beat.skip ? 'cut' : 'spoken'].push(beat.text);
  }
}

/* ---------- What each line needs ---------- */

const sortKeys = (o) => Object.fromEntries(Object.entries(o ?? {}).sort(([a], [b]) => a.localeCompare(b)));
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const request = (text) => ({
  text,
  voiceId,
  modelId: config.modelId,
  outputFormat: config.outputFormat,
  voiceSettings: sortKeys(config.voiceSettings),
  seed: config.seed ?? null,
});
const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};

const plan = [...lines].map(([line, {spoken, cut}]) => {
  const text = spoken.join(' ');
  const req = request(text);
  const hash = sha256(JSON.stringify(req)).slice(0, 32);
  const target = path.join(ROOT, `${line}.mp3`);
  const cached = path.join(CACHE, `${hash}.mp3`);
  const ours = manifest[line];
  const exists = fs.existsSync(target);
  // A take this script wrote, and nobody has replaced since.
  const generated = exists && ours && sha256(fs.readFileSync(target)) === ours.fileSha;
  let status;
  if (!text) status = 'all cut';
  else if (exists && !generated && !regenerate.has(line)) status = 'recorded, kept';
  else if (generated && ours.hash === hash && !regenerate.has(line)) status = 'generated, up to date';
  else status = fs.existsSync(cached) ? 'from cache (free)' : 'generate';
  return {line, text, cut, req, hash, target, cached, status, chars: [...text].length};
});

/* ---------- Dry run report ---------- */

const multiplier = async () => {
  if (!elevenKey) return {x: 1, note: 'assumed 1 credit per character (no key to look up the model rate)'};
  try {
    const r = await fetch(`${API}/v1/models`, {headers: {'xi-api-key': elevenKey}});
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const model = (await r.json()).find((m) => m.model_id === config.modelId);
    if (!model) throw new Error(`model ${config.modelId} not found`);
    const x = (model.model_rates?.character_cost_multiplier ?? 1) * (model.model_rates?.cost_discount_multiplier ?? 1);
    return {x, note: `${config.modelId} rate from GET /v1/models: ${x} credit(s) per character`};
  } catch (e) {
    return {x: 1, note: `assumed 1 credit per character (model rate lookup failed: ${scrub(e.message)})`};
  }
};

const toPay = plan.filter((p) => p.status === 'generate');
const totalChars = toPay.reduce((n, p) => n + p.chars, 0);
const rate = await multiplier();
const credits = Math.ceil(totalChars * rate.x);

console.log(`${generate ? 'GENERATE' : 'DRY RUN'}: voice ${voiceId || '(not set)'}, model ${config.modelId}, ${config.outputFormat}, settings ${JSON.stringify(config.voiceSettings)}${config.seed != null ? `, seed ${config.seed}` : ''}\n`);
const width = Math.max(...plan.map((p) => p.line.length));
for (const p of plan) {
  const preview = p.text.length > 70 ? `${p.text.slice(0, 67)}...` : p.text;
  console.log(`  ${p.line.padEnd(width)}  ${p.status.padEnd(21)}  ${String(p.chars).padStart(4)} chars  "${preview}"`);
  for (const c of p.cut) console.log(`  ${''.padEnd(width)}  ${'(cut, never sent)'.padEnd(21)}              "${c}"`);
}
const all = plan.reduce((n, p) => n + p.chars, 0);
console.log(`\n  To generate: ${toPay.length} line(s), ${totalChars} characters, about ${credits} credits (${rate.note}).`);
console.log(`  For reference, every line in these sections: ${all} characters. Per-run cap: ${config.maxCreditsPerRun} credits.`);

if (!generate) {
  console.log('\nDry run: nothing was generated and no credits were spent. Add --generate to run it.');
  process.exit(0);
}

/* ---------- Generate ---------- */

const work = plan.filter((p) => p.status === 'generate' || p.status === 'from cache (free)');
if (!work.length) {
  console.log('\nNothing to generate.');
  process.exit(0);
}
if (toPay.length && !elevenKey) throw new Error('ELEVENLABS_API_KEY is not set.');
if (toPay.length && !voiceId) throw new Error('No voice: set "voiceId" in tts.config.json or pass --voice <id>.');
if (credits > config.maxCreditsPerRun) {
  throw new Error(`This run would spend about ${credits} credits, over maxCreditsPerRun (${config.maxCreditsPerRun}). Nothing was generated.`);
}

const tts = async (p) => {
  const url = `${API}/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(config.outputFormat)}`;
  const body = {text: p.text, model_id: config.modelId, voice_settings: config.voiceSettings};
  if (config.seed != null) body.seed = config.seed;
  const r = await fetch(url, {
    method: 'POST',
    headers: {'xi-api-key': elevenKey, 'Content-Type': 'application/json', Accept: 'audio/mpeg'},
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`${p.line}: ElevenLabs returned HTTP ${r.status}: ${scrub((await r.text()).slice(0, 500))}`);
  return {audio: Buffer.from(await r.arrayBuffer()), requestId: r.headers.get('request-id')};
};

let spent = 0;
for (const p of work) {
  let requestId = null;
  if (p.status === 'generate') {
    const res = await tts(p);
    fs.writeFileSync(p.cached, res.audio);
    requestId = res.requestId;
    spent += p.chars;
  }
  // A recorded take named in --regenerate is kept in .tts-cache/replaced/ first.
  const ours = manifest[p.line];
  if (fs.existsSync(p.target) && !(ours && sha256(fs.readFileSync(p.target)) === ours.fileSha)) {
    const keep = path.join(CACHE, 'replaced', `${p.line}-${new Date().toISOString().replace(/[:.]/g, '-')}.mp3`);
    fs.mkdirSync(path.dirname(keep), {recursive: true});
    fs.copyFileSync(p.target, keep);
    console.log(`  kept the recorded ${path.basename(p.target)} as ${path.relative(ROOT, keep)}`);
  }
  fs.copyFileSync(p.cached, p.target);
  manifest[p.line] = {
    hash: p.hash,
    fileSha: sha256(fs.readFileSync(p.target)),
    text: p.text,
    voiceId: p.req.voiceId,
    modelId: p.req.modelId,
    outputFormat: p.req.outputFormat,
    voiceSettings: p.req.voiceSettings,
    seed: p.req.seed,
    requestId,
    at: new Date().toISOString(),
  };
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
  console.log(`  wrote ${path.basename(p.target)} (${p.status === 'generate' ? 'generated' : 'from cache'})`);
}
console.log(`\nDone: ${spent} characters sent. Next: node scripts/part-voiceover.mjs <prefix> <dir> to normalise and time the takes.`);
